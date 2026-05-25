using System.Text.Json;
using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.API.Data;

public class JsonVeteranRepository : IVeteranRepository
{
    private readonly string _filePath = "veterans.json";
    private readonly JsonSerializerOptions _options = new() { WriteIndented = true };

    public async Task<IEnumerable<Veteran>> GetAllAsync(string? search = null, int? branch = null, string? sortBy = null)
    {
        if (!File.Exists(_filePath)) return new List<Veteran>();
        var json = await File.ReadAllTextAsync(_filePath);
        var all = JsonSerializer.Deserialize<List<Veteran>>(json, _options) ?? new List<Veteran>();

        if (branch.HasValue)
        {
            all = all.Where(v => (int)v.Branch == branch.Value).ToList();
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.ToLower();
            all = all.Where(v =>
                v.FullName.ToLower().Contains(q) ||
                v.UnitName.ToLower().Contains(q) ||
                (v is Pilot p && p.VehicleModel.ToLower().Contains(q)) ||
                (v is Infantryman i && i.Specialization.ToLower().Contains(q))
            ).ToList();
        }

        all = sortBy switch
        {
            "name_asc" => all.OrderBy(v => v.FullName).ToList(),
            "name_desc" => all.OrderByDescending(v => v.FullName).ToList(),
            "rank" => all.OrderByDescending(v => (int)v.Rank).ThenBy(v => v.FullName).ToList(),
            _ => all.OrderByDescending(v => v.Id).ToList()
        };

        return all;
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
    public async Task UpdateAsync(Veteran veteran)
    {
        var all = (await GetAllAsync()).ToList();
        var index = all.FindIndex(v => v.Id == veteran.Id);

        if (index != -1)
        {
            all[index] = veteran;
            var json = JsonSerializer.Serialize(all, _options);
            await File.WriteAllTextAsync(_filePath, json);
        }
    }
}