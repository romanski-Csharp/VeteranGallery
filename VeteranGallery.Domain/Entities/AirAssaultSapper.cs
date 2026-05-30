namespace VeteranGallery.Domain.Entities;

public class AirAssaultSapper : AirAssaultVeteran
{
    public int MinesCleared { get; set; }
    public string SapperQualification { get; set; } = string.Empty;

    public override string GetSpecializedDescription()
        => $"Air Assault Sapper. Qualification: {SapperQualification}. Objects Demined: {MinesCleared}. {GetOperatorSummary()}";

    public override string GetSearchableText()
        => $"{base.GetSearchableText()} {SapperQualification}".Trim();
}
