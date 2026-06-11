using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class AirForceVeteran : Veteran
{
    protected AirForceVeteran()
    {
        Branch = MilitaryBranch.AirForce;
    }

    public override string BranchDisplayName => "Air Force";

    public int TotalFlightHours { get; set; }

    public string GetAviatorSummary()
    {
        return $"Flight Hours: {TotalFlightHours} hours.";
    }

    public override string GetSearchableText() => string.Empty;
}
