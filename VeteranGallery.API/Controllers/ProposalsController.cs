using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Enums;
using VeteranGallery.Domain.Interfaces;
using System.Reflection;

namespace VeteranGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProposalsController : ControllerBase
{
    private readonly IProposalRepository _proposalRepository;
    private readonly IVeteranRepository _veteranRepository;

    public ProposalsController(IProposalRepository proposalRepository, IVeteranRepository veteranRepository)
    {
        _proposalRepository = proposalRepository;
        _veteranRepository = veteranRepository;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> SubmitProposal([FromBody] Veteran proposedVeteran, [FromQuery] bool isUpdate = false)
    {
        var proposal = new VeteranProposal
        {
            Type = isUpdate ? ProposalType.Update : ProposalType.Create,
            TargetVeteranId = isUpdate ? proposedVeteran.Id : null,
            ProposedData = proposedVeteran
        };

        if (proposal.Type == ProposalType.Create)
        {
            var propInfo = typeof(Veteran).GetProperty("Id");
            if (propInfo != null && propInfo.CanWrite)
            {
                propInfo.SetValue(proposal.ProposedData, Guid.NewGuid());
            }
        }

        await _proposalRepository.AddAsync(proposal);
        return Ok(new { message = "Пропозиція успішно відправлена на модерацію!" });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<VeteranProposal>>> GetProposals([FromQuery] int status = 1)
    {
        var proposals = await _proposalRepository.GetProposalsAsync((ProposalStatus)status);
        return Ok(proposals);
    }

    [HttpPost("{id}/restore")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RestoreProposal(Guid id)
    {
        var proposal = await _proposalRepository.GetByIdAsync(id);
        if (proposal == null || proposal.Status != ProposalStatus.Rejected)
            return NotFound("Пропозицію не знайдено або вона не відхилена.");

        await _proposalRepository.UpdateStatusAsync(id, ProposalStatus.Pending);
        return Ok(new { message = "Пропозицію успішно повернуто на розгляд." });
    }

    [HttpGet("{id}/compare")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetComparison(Guid id)
    {
        var proposal = await _proposalRepository.GetByIdAsync(id);
        if (proposal == null) return NotFound();

        Veteran? currentVeteran = null;
        if (proposal.TargetVeteranId.HasValue)
        {
            currentVeteran = await _veteranRepository.GetByIdAsync(proposal.TargetVeteranId.Value);
        }

        return Ok(new
        {
            Proposal = proposal.ProposedData,
            Current = currentVeteran
        });
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveProposal(Guid id)
    {
        var proposal = await _proposalRepository.GetByIdAsync(id);
        if (proposal == null || proposal.Status != ProposalStatus.Pending)
            return NotFound("Пропозицію не знайдено або вона вже оброблена.");

        if (proposal.Type == ProposalType.Create)
        {
            await _veteranRepository.AddAsync(proposal.ProposedData);
        }
        else if (proposal.Type == ProposalType.Update)
        {
            await _veteranRepository.UpdateAsync(proposal.ProposedData);
        }

        await _proposalRepository.UpdateStatusAsync(id, ProposalStatus.Approved);
        return Ok(new { message = "Профіль успішно схвалено та опубліковано!" });
    }
    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RejectProposal(Guid id)
    {
        var proposal = await _proposalRepository.GetByIdAsync(id);
        if (proposal == null || proposal.Status != ProposalStatus.Pending)
            return NotFound("Пропозицію не знайдено або вона вже оброблена.");

        await _proposalRepository.UpdateStatusAsync(id, ProposalStatus.Rejected);
        return Ok(new { message = "Пропозицію відхилено." });
    }
}