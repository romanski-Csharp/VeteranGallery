namespace VeteranGallery.Domain.Entities;

public class FlightNavigator : AirForceVeteran
{
    public string NavigationSystem { get; set; } = string.Empty;
    public int SortieCount { get; set; }

    public override string GetSpecializedDescription()
        => $"Flight Navigator. Navigation System: {NavigationSystem}. Combat Sorties: {SortieCount}. {GetAviatorSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {NavigationSystem}".Trim();
}
