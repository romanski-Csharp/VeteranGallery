namespace VeteranGallery.Domain.Entities;

public class SpecialForcesSoldier : SpecialOpsVeteran
{
    public string SpecialUnit { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Fighter of Special Operations Forces. Unit: {SpecialUnit}. {GetSpecialOpsSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {SpecialUnit}".Trim();
}
