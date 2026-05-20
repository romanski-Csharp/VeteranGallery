using System.Text.Json;
using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.API.Data;

public class JsonVeteranRepository : IVeteranRepository
{
    private readonly string _filePath = "veterans.json";
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };

    public async Task<IEnumerable<Veteran>> GetAllAsync()
    {
        if (!File.Exists(_filePath)) return Enumerable.Empty<Veteran>();

        var json = await File.ReadAllTextAsync(_filePath);
        return JsonSerializer.Deserialize<List<Veteran>>(json, _options) ?? new List<Veteran>();
    }

    public async Task<Veteran?> GetByIdAsync(Guid id)
    {
        var all = await GetAllAsync();
        return all.FirstOrDefault(v => v.Id == id);
    }

    public async Task AddAsync(Veteran veteran)
    {
        var all = (await GetAllAsync()).ToList();
        all.Add(veteran);
        var json = JsonSerializer.Serialize(all, _options);
        await File.WriteAllTextAsync(_filePath, json);
    }
    public async Task DeleteAsync(Guid id)
    {
        var all = (await GetAllAsync()).ToList();
        var veteranToRemove = all.FirstOrDefault(v => v.Id == id);

        if (veteranToRemove != null)
        {
            all.Remove(veteranToRemove);
            var json = JsonSerializer.Serialize(all, _options);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}