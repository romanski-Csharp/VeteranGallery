using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class SpecialOpsVeteran : Veteran
{
    protected SpecialOpsVeteran()
    {
        Branch = MilitaryBranch.SpecialOps;
    }

    public override string BranchDisplayName => "Special Operations Forces";

    public string MissionType { get; set; } = string.Empty;

    public bool IsClassified { get; set; }

    public string GetSpecialOpsSummary()
        => IsClassified ? "Details of service are classified." : $"Mission Type: {MissionType}.";

    public override string GetSearchableText()
        => IsClassified ? string.Empty : MissionType;
}
