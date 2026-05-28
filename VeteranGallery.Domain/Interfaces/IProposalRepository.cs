using VeteranGallery.Domain.Entities;
using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Interfaces;

public interface IProposalRepository
{
    Task<IEnumerable<VeteranProposal>> GetProposalsAsync(ProposalStatus status);
    Task<VeteranProposal?> GetByIdAsync(Guid id);
    Task AddAsync(VeteranProposal proposal);
    Task UpdateStatusAsync(Guid id, ProposalStatus status);
}