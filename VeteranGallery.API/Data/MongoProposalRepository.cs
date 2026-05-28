using MongoDB.Driver;
using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Enums;
using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.API.Data;

public class MongoProposalRepository : IProposalRepository
{
    private readonly IMongoCollection<VeteranProposal> _proposals;

    public MongoProposalRepository()
    {
        var connectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING");
        var dbName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME");
        var collectionName = Environment.GetEnvironmentVariable("MONGODB_PROPOSALS_COLLECTION_NAME") ?? "Proposals";

        var mongoClient = new MongoClient(connectionString);
        var mongoDatabase = mongoClient.GetDatabase(dbName);
        _proposals = mongoDatabase.GetCollection<VeteranProposal>(collectionName);
    }

    public async Task<IEnumerable<VeteranProposal>> GetProposalsAsync(ProposalStatus status)
    {
        return await _proposals.Find(p => p.Status == status)
                               .SortByDescending(p => p.SubmittedAt)
                               .ToListAsync();
    }

    public async Task<VeteranProposal?> GetByIdAsync(Guid id)
    {
        return await _proposals.Find(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task AddAsync(VeteranProposal proposal)
    {
        await _proposals.InsertOneAsync(proposal);
    }

    public async Task UpdateStatusAsync(Guid id, ProposalStatus status)
    {
        var update = Builders<VeteranProposal>.Update.Set(p => p.Status, status);
        await _proposals.UpdateOneAsync(p => p.Id == id, update);
    }
}