using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.Domain.Entities;

public class Pilot : Veteran, IVehicleOperator
{
    public string VehicleModel { get; set; } = string.Empty;
    public int ExperienceValue { get; set; }

    public override string GetSpecializedDescription()
        => $"Pilot of air forces. Aircraft: {VehicleModel}. Flight hours: {ExperienceValue}.";
}