namespace VeteranGallery.Domain.Entities;

public class Artillery : LandForcesVeteran
{
    public string WeaponSystem { get; set; } = string.Empty;
    public int MaxRangeKm { get; set; }

    public override string GetSpecializedDescription()
        => $"Artillery Specialist. System: {WeaponSystem}. Max Range: {MaxRangeKm} km. {GetGroundForcesSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {WeaponSystem}".Trim();
}
