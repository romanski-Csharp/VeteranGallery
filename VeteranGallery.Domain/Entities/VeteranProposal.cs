using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public class VeteranProposal
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? TargetVeteranId { get; set; }

    public ProposalType Type { get; set; }
    public ProposalStatus Status { get; set; } = ProposalStatus.Pending;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public required Veteran ProposedData { get; set; }
}