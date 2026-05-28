using Microsoft.AspNetCore.Authorization;
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
    public async Task<ActionResult<IEnumerable<Veteran>>> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] int? branch = null,
        [FromQuery] string? sortBy = null)
    {
        var veterans = await _repository.GetAllAsync(search, branch, sortBy);
        return Ok(veterans);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Veteran>> GetById(Guid id)
    {
        var veteran = await _repository.GetByIdAsync(id);
        if (veteran == null) return NotFound();
        return Ok(veteran);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Create([FromBody] Veteran veteran)
    {
        await _repository.AddAsync(veteran);
        return CreatedAtAction(nameof(GetAll), new { id = veteran.Id }, veteran);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Update(Guid id, [FromBody] Veteran veteran)
    {
        if (id != veteran.Id) return BadRequest("ID mismatch");

        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return NotFound();

        await _repository.UpdateAsync(veteran);
        return NoContent();
    }
}