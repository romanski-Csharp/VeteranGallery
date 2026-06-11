using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class LandForcesVeteran : Veteran
{
    protected LandForcesVeteran()
    {
        Branch = MilitaryBranch.LandForces;
    }

    public override string BranchDisplayName => "Land Forces";

    public string GetGroundForcesSummary()
        => string.Empty;

    public override string GetSearchableText() => string.Empty;
}
