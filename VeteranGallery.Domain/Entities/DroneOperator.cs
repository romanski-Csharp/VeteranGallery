using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.Domain.Entities;

public class DroneOperator : AirAssaultVeteran, IVehicleOperator
{
    public string VehicleModel { get; set; } = string.Empty;

    public string GetOperationalSummary()
        => $"Drone Model: {VehicleModel}. {GetOperatorSummary()}";

    public override string GetSpecializedDescription()
        => $"Drone Operator. {GetOperationalSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {VehicleModel}".Trim();
}