using MongoDB.Driver;
using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.API.Data;

public class MongoVeteranRepository : IVeteranRepository
{
    private readonly IMongoCollection<Veteran> _veterans;

    public MongoVeteranRepository()
    {
        var connectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING");
        var dbName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME");
        var collectionName = Environment.GetEnvironmentVariable("MONGODB_COLLECTION_NAME");

        var mongoClient = new MongoClient(connectionString);
        var mongoDatabase = mongoClient.GetDatabase(dbName);
        _veterans = mongoDatabase.GetCollection<Veteran>(collectionName);
    }

    public async Task<IEnumerable<Veteran>> GetAllAsync(string? search = null, int? branch = null, string? sortBy = null)
    {
        var all = await _veterans.Find(v => v.IsDeleted == false).ToListAsync();

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
                (v is Infantryman i && i.Specialization.ToLower().Contains(q)) ||
                (v is NavySailor n && n.Specialization.ToLower().Contains(q))
            ).ToList();
        }

        all = sortBy switch
        {
            "name_asc" => all.OrderBy(v => v.FullName).ToList(),
            "name_desc" => all.OrderByDescending(v => v.FullName).ToList(),
            "rank" => all.OrderByDescending(v => (int)v.Rank).ThenBy(v => v.FullName).ToList(),
            _ => all.OrderByDescending(v => v.CreatedAt).ToList()
        };

        return all;
    }

    public async Task<Veteran?> GetByIdAsync(Guid id)
    {
        return await _veterans.Find(v => v.Id == id).FirstOrDefaultAsync();
    }

    public async Task AddAsync(Veteran veteran)
    {
        await _veterans.InsertOneAsync(veteran);
    }

    public async Task UpdateAsync(Veteran veteran)
    {
        await _veterans.ReplaceOneAsync(v => v.Id == veteran.Id, veteran);
    }

    public async Task DeleteAsync(Guid id)
    {
        var update = Builders<Veteran>.Update.Set(v => v.IsDeleted, true);
        await _veterans.UpdateOneAsync(v => v.Id == id, update);
    }
}