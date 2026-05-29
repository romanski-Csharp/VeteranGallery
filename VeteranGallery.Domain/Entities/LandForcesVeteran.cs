using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class LandForcesVeteran : Veteran
{
    protected LandForcesVeteran()
    {
        Branch = MilitaryBranch.LandForces;
    }

    public override string BranchDisplayName => "Land Forces";
}
