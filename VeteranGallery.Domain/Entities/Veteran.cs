using System.Text.Json.Serialization;
using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "$type")]
[JsonDerivedType(typeof(Infantryman), typeDiscriminator: "infantry")]
[JsonDerivedType(typeof(Pilot), typeDiscriminator: "pilot")]
[JsonDerivedType(typeof(DroneOperator), typeDiscriminator: "drone_op")]
[JsonDerivedType(typeof(Navy), typeDiscriminator: "navy")]
public abstract class Veteran
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string FullName { get; set; } = string.Empty;
    public MilitaryRank Rank { get; set; }
    public string UnitName { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public MilitaryBranch Branch { get; set; }
    public string? PhotoUrl { get; set; }

    public abstract string GetSpecializedDescription();
}