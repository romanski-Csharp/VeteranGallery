namespace VeteranGallery.Domain.Entities;

public class Infantryman : Veteran
{
    public string Specialization { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Infantryman, specialization: {Specialization}. Service in unit {UnitName}.";
}