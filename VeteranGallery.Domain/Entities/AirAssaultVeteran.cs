using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class AirAssaultVeteran : Veteran
{
    protected AirAssaultVeteran()
    {
        Branch = MilitaryBranch.AirAssault;
    }

    public override string BranchDisplayName => "Air Assault Forces";

    public int TotalOperationHours { get; set; }

    public string GetOperatorSummary()
        => $"Operation Hours: {TotalOperationHours}.";

    public override string GetSearchableText() => string.Empty;
}
