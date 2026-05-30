namespace VeteranGallery.Domain.Entities;

public class SpecialOpsIntelligence : SpecialOpsVeteran
{
    public string IntelSpecialty { get; set; } = string.Empty;
    public int FieldOperations { get; set; }

    public override string GetSpecializedDescription()
        => IsClassified
            ? "Intelligence Officer. Details of service are classified."
            : $"Intelligence Officer. Specialty: {IntelSpecialty}. Field Operations: {FieldOperations}.";

    public override string GetSearchableText()
        => IsClassified ? string.Empty : $"{base.GetSearchableText()} {IntelSpecialty}".Trim();
}
