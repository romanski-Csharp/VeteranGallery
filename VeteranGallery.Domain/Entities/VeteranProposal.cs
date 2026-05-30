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

    public bool IsEditable => Status == ProposalStatus.Pending;

    public static VeteranProposal CreateNew(Veteran veteran)
    {
        veteran.RegenerateId();
        return new VeteranProposal
        {
            Type = ProposalType.Create,
            TargetVeteranId = null,
            ProposedData = veteran
        };
    }

    public static VeteranProposal CreateUpdate(Veteran veteran)
    {
        return new VeteranProposal
        {
            Type = ProposalType.Update,
            TargetVeteranId = veteran.Id,
            ProposedData = veteran
        };
    }

    public void Approve()
    {
        if (Status != ProposalStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot approve a proposal with status '{Status}'. Expected '{ProposalStatus.Pending}'.");
        Status = ProposalStatus.Approved;
    }

    public void Reject()
    {
        if (Status != ProposalStatus.Pending)
            throw new InvalidOperationException(
                $"Cannot reject a proposal with status '{Status}'. Expected '{ProposalStatus.Pending}'.");
        Status = ProposalStatus.Rejected;
    }

    public void Restore()
    {
        if (Status != ProposalStatus.Rejected)
            throw new InvalidOperationException(
                $"Cannot restore a proposal with status '{Status}'. Expected '{ProposalStatus.Rejected}'.");
        Status = ProposalStatus.Pending;
    }
}