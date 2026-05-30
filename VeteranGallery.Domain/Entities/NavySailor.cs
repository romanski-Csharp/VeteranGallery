namespace VeteranGallery.Domain.Entities;

public class NavySailor : NavyVeteran
{
    public string Specialization { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Navy Sailor, Specialization: {Specialization}. {GetNavySummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {Specialization}".Trim();
}
