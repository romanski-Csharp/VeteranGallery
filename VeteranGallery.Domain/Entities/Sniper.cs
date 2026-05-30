namespace VeteranGallery.Domain.Entities;

public class Sniper : SpecialOpsVeteran
{
    public int MaxEffectiveRange { get; set; }
    public string RifleModel { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Sniper. Rifle: {RifleModel}. Max Effective Range: {MaxEffectiveRange} m. {GetSpecialOpsSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {RifleModel}".Trim();
}
