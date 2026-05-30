namespace VeteranGallery.Domain.Entities;

public class Paratrooper : AirAssaultVeteran
{
    public int TotalJumps { get; set; }
    public string ParachuteType { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Paratrooper. Total Jumps: {TotalJumps}. Parachute System: {ParachuteType}. {GetOperatorSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {ParachuteType}".Trim();
}
