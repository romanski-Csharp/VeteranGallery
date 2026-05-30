using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class NavyVeteran : Veteran
{
    protected NavyVeteran()
    {
        Branch = MilitaryBranch.Navy;
    }

    public override string BranchDisplayName => "Navy";

    public string VesselName { get; set; } = string.Empty;

    public string VesselType { get; set; } = string.Empty;

    public int TotalSeaDays { get; set; }

    public string GetNavySummary()
        => $"Vessel: {VesselName} ({VesselType}). Sea Days: {TotalSeaDays}.";

    public override string GetSearchableText() => $"{VesselName} {VesselType}".Trim();
}
