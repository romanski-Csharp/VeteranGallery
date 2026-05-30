using VeteranGallery.Domain.Interfaces;

namespace VeteranGallery.Domain.Entities;

public class TankCrewman : LandForcesVeteran, IVehicleOperator
{
    public string VehicleModel { get; set; } = string.Empty;
    public string CrewPosition { get; set; } = string.Empty;

    public string GetOperationalSummary()
        => $"Tank: {VehicleModel}. Crew Position: {CrewPosition}. {GetGroundForcesSummary()}";

    public override string GetSpecializedDescription()
        => $"Tank Crewman. {GetOperationalSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {VehicleModel} {CrewPosition}".Trim();
}
