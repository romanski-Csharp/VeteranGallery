using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class AirForceVeteran : Veteran
{
    protected AirForceVeteran()
    {
        Branch = MilitaryBranch.AirForce;
    }

    public override string BranchDisplayName => "Air Force";
}
