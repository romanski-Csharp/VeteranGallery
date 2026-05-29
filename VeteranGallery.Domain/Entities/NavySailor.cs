namespace VeteranGallery.Domain.Entities;

public class NavySailor : NavyVeteran
{
    public string Specialization { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Navy, specialization: {Specialization}. Service in unit {UnitName}.";
}
