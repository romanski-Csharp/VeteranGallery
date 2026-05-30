using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class AirForceVeteran : Veteran
{
    protected AirForceVeteran()
    {
        Branch = MilitaryBranch.AirForce;
    }

    public override string BranchDisplayName => "Air Force";

    public int TotalFlightHours { get; set; }

    public string AirBase { get; set; } = string.Empty;

    public bool HasCombatMissions { get; set; }

    public string GetAviatorSummary()
    {
        var missionStatus = HasCombatMissions ? "Combat Missions: Yes" : "Combat Missions: No Data";
        return $"Base: {AirBase}. Flight Hours: {TotalFlightHours} hours. {missionStatus}.";
    }

    public override string GetSearchableText() => AirBase;
}
