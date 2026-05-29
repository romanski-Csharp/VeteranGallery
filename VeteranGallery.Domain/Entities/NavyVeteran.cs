using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class NavyVeteran : Veteran
{
    protected NavyVeteran()
    {
        Branch = MilitaryBranch.Navy;
    }

    public override string BranchDisplayName => "Navy";
}
