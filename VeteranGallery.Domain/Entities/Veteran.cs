using System.Text.Json.Serialization;
using VeteranGallery.Domain.Enums;

namespace VeteranGallery.Domain.Entities;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "$type")]
[JsonDerivedType(typeof(Infantryman), typeDiscriminator: "infantry")]
[JsonDerivedType(typeof(Artillery), typeDiscriminator: "artillery")]
[JsonDerivedType(typeof(TankCrewman), typeDiscriminator: "tank_crew")]
[JsonDerivedType(typeof(Pilot), typeDiscriminator: "pilot")]
[JsonDerivedType(typeof(AirDefenseOperator), typeDiscriminator: "air_defense")]
[JsonDerivedType(typeof(FlightNavigator), typeDiscriminator: "navigator")]
[JsonDerivedType(typeof(DroneOperator), typeDiscriminator: "drone_op")]
[JsonDerivedType(typeof(Paratrooper), typeDiscriminator: "paratrooper")]
[JsonDerivedType(typeof(AirAssaultSapper), typeDiscriminator: "assault_sapper")]
[JsonDerivedType(typeof(NavySailor), typeDiscriminator: "navy")]
[JsonDerivedType(typeof(CombatDiver), typeDiscriminator: "combat_diver")]
[JsonDerivedType(typeof(NavalArtillerist), typeDiscriminator: "naval_artillery")]
[JsonDerivedType(typeof(SpecialForcesSoldier), typeDiscriminator: "special_ops")]
[JsonDerivedType(typeof(Sniper), typeDiscriminator: "sniper")]
[JsonDerivedType(typeof(SpecialOpsIntelligence), typeDiscriminator: "spec_intel")]
public abstract class Veteran
{
    private Guid _id = Guid.NewGuid();
    public Guid Id { get => _id; init => _id = value; }

    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string FullName { get; set; } = string.Empty;
    public MilitaryRank Rank { get; set; }
    public string UnitName { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public MilitaryBranch Branch { get; set; }
    public string? PhotoUrl { get; set; }

    public virtual string BranchDisplayName => "Armed Forces";

    public abstract string GetSpecializedDescription();

    public void RegenerateId() => _id = Guid.NewGuid();

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(FullName))
            throw new ArgumentException("Veteran's full name cannot be empty.", nameof(FullName));
        if (string.IsNullOrWhiteSpace(UnitName))
            throw new ArgumentException("Unit name cannot be empty.", nameof(UnitName));
        if (string.IsNullOrWhiteSpace(Story))
            throw new ArgumentException("Veteran's story cannot be empty.", nameof(Story));
    }

    public virtual string GetSearchableText() => string.Empty;

    public bool IsSeniorOfficer() => (int)Rank >= (int)MilitaryRank.BrigadierGeneralOrCommodore;

    public string GetRankDisplayName() => Rank switch
    {
        MilitaryRank.Recruit                                             => "Recruit",
        MilitaryRank.SoldierOrSailor                                     => "Soldier / Sailor",
        MilitaryRank.SeniorSoldierOrSeniorSailor                         => "Senior Soldier / Senior Sailor",
        MilitaryRank.JuniorSergeantOrPettyOfficer2ndClass                => "Junior Sergeant / Petty Officer 2nd Class",
        MilitaryRank.SergeantOrPettyOfficer1stClass                      => "Sergeant / Petty Officer 1st Class",
        MilitaryRank.SeniorSergeantOrChiefPettyOfficer                   => "Senior Sergeant / Chief Petty Officer",
        MilitaryRank.ChiefSergeantOrChiefShipPettyOfficer                => "Chief Sergeant / Chief Ship Petty Officer",
        MilitaryRank.StaffSergeantOrStaffWarrantOfficer                  => "Staff Sergeant / Staff Warrant Officer",
        MilitaryRank.MasterSergeantOrMasterWarrantOfficer                => "Master Sergeant / Master Warrant Officer",
        MilitaryRank.SeniorMasterSergeantOrSeniorMasterWarrantOfficer    => "Senior Master Sergeant / Senior Master Warrant Officer",
        MilitaryRank.ChiefMasterSergeantOrChiefMasterWarrantOfficer      => "Chief Master Sergeant / Chief Master Warrant Officer",
        MilitaryRank.JuniorLieutenant                                    => "Junior Lieutenant",
        MilitaryRank.Lieutenant                                          => "Lieutenant",
        MilitaryRank.SeniorLieutenant                                    => "Senior Lieutenant",
        MilitaryRank.CaptainOrCaptainLieutenant                          => "Captain / Captain-Lieutenant",
        MilitaryRank.MajorOrCaptain3rdRank                               => "Major / Captain 3rd Rank",
        MilitaryRank.LieutenantColonelOrCaptain2ndRank                   => "Lieutenant Colonel / Captain 2nd Rank",
        MilitaryRank.ColonelOrCaptain1stRank                             => "Colonel / Captain 1st Rank",
        MilitaryRank.BrigadierGeneralOrCommodore                         => "Brigadier General / Commodore",
        MilitaryRank.MajorGeneralOrRearAdmiral                           => "Major General / Rear Admiral",
        MilitaryRank.LieutenantGeneralOrViceAdmiral                      => "Lieutenant General / Vice Admiral",
        MilitaryRank.GeneralOrAdmiral                                    => "General / Admiral",
        _                                                                => Rank.ToString()
    };
}