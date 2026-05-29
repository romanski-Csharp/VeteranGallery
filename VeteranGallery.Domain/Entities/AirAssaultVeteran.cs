using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class AirAssaultVeteran : Veteran
{
    protected AirAssaultVeteran()
    {
        Branch = MilitaryBranch.AirAssault;
    }

    public override string BranchDisplayName => "Air Assault Forces";
}
