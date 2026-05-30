namespace VeteranGallery.Domain.Entities;

public class AirDefenseOperator : AirForceVeteran
{
    public string SystemType { get; set; } = string.Empty;
    public int ConfirmedInterceptions { get; set; }

    public override string GetSpecializedDescription()
        => $"Air Defense Operator. System: {SystemType}. Confirmed Interceptions: {ConfirmedInterceptions}. {GetAviatorSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {SystemType}".Trim();
}
