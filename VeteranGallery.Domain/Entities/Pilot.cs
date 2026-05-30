using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.Domain.Entities;

public class Pilot : AirForceVeteran, IVehicleOperator
{
    public string VehicleModel { get; set; } = string.Empty;

    public string GetOperationalSummary()
        => $"Vehicle Model: {VehicleModel}. {GetAviatorSummary()}";

    public override string GetSpecializedDescription()
        => $"Pilot of the Air Force. {GetOperationalSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {VehicleModel}".Trim();
}