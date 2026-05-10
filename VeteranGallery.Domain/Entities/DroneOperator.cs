using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.Domain.Entities;

public class DroneOperator : Veteran, IVehicleOperator
{
    public string VehicleModel { get; set; } = string.Empty;
    public int ExperienceValue { get; set; }

    public override string GetSpecializedDescription()
        => $"Drone operator of Unmanned Systems Forces. Drone: {VehicleModel}. Experience: {ExperienceValue} hours.";
}