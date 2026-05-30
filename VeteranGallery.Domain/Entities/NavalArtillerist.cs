namespace VeteranGallery.Domain.Entities;

public class NavalArtillerist : NavyVeteran
{
    public string CoastalSystem { get; set; } = string.Empty;
    public string CoastalSector { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Naval Artillerist. System: {CoastalSystem}. Sector: {CoastalSector}. {GetNavySummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {CoastalSystem} {CoastalSector}".Trim();
}
