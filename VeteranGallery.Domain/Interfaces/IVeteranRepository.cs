using VeteranGallery.Domain.Entities;

namespace VeteranGallery.Domain.Interfaces;

public interface IVeteranRepository
{
    Task<IEnumerable<Veteran>> GetAllAsync(string? search = null, int? branch = null, string? sortBy = null);
    Task<Veteran?> GetByIdAsync(Guid id);
    Task AddAsync(Veteran veteran);
    Task DeleteAsync(Guid id);
    Task UpdateAsync(Veteran veteran);
}