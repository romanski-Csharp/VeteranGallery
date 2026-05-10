using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

public abstract class Veteran
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string FullName { get; set; } = string.Empty;
    public string Rank { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty; 
    public string Story { get; set; } = string.Empty;
    public MilitaryBranch Branch { get; set; }
    public string? PhotoUrl { get; set; }
    public abstract string GetSpecializedDescription();
}