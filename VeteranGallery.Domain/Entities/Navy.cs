namespace VeteranGallery.Domain.Entities;

public class Navy : Veteran
{
    public string Specialization { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Navy, specialization: {Specialization}. Service in unit {UnitName}.";
}
