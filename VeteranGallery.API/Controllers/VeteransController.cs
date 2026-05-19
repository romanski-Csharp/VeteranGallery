using Microsoft.AspNetCore.Mvc;
using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VeteransController : ControllerBase
{
    private readonly IVeteranRepository _repository;

    public VeteransController(IVeteranRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Veteran>>> GetAll()
    {
        var veterans = await _repository.GetAllAsync();
        return Ok(veterans);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] Veteran veteran)
    {
        await _repository.AddAsync(veteran);
        return CreatedAtAction(nameof(GetAll), new { id = veteran.Id }, veteran);
    }
}