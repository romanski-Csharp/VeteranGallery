namespace VeteranGallery.Domain.Entities;

public class Infantryman : LandForcesVeteran
{
    public string Specialization { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Infantryman, Specialization: {Specialization}. {GetGroundForcesSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {Specialization}".Trim();
}