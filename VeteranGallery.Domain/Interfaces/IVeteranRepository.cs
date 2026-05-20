using VeteranGallery.Domain.Entities;

namespace VeteranGallery.Domain.Interfaces;

public interface IVeteranRepository
{
    Task<IEnumerable<Veteran>> GetAllAsync();
    Task<Veteran?> GetByIdAsync(Guid id);
    Task AddAsync(Veteran veteran);
    Task DeleteAsync(Guid id);
}