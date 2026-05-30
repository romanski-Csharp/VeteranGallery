using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class LandForcesVeteran : Veteran
{
    protected LandForcesVeteran()
    {
        Branch = MilitaryBranch.LandForces;
    }

    public override string BranchDisplayName => "Land Forces";

    public string PrimaryWeapon { get; set; } = string.Empty;

    public int CombatDeployments { get; set; }

    public string AreaOfOperations { get; set; } = string.Empty;

    public string GetGroundForcesSummary()
        => $"Area: {AreaOfOperations}. Weapon: {PrimaryWeapon}. Combat Deployments: {CombatDeployments}.";

    public override string GetSearchableText() => $"{PrimaryWeapon} {AreaOfOperations}".Trim();
}
