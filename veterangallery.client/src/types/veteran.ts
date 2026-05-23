export const MilitaryBranch = {
    LandForces: 1,
    AirForce: 2,
    AirAssault: 3,
    Navy: 4
} as const;

export type MilitaryBranch = typeof MilitaryBranch[keyof typeof MilitaryBranch];

export const MilitaryRank = {
    Recruit: 1, 
    SoldierOrSailor: 2, 
    SeniorSoldierOrSeniorSailor: 3,
    JuniorSergeantOrPettyOfficer2ndClass: 4, 
    SergeantOrPettyOfficer1stClass: 5,
    SeniorSergeantOrChiefPettyOfficer: 6, 
    ChiefSergeantOrChiefShipPettyOfficer: 7,
    StaffSergeantOrStaffWarrantOfficer: 8, 
    MasterSergeantOrMasterWarrantOfficer: 9,
    SeniorMasterSergeantOrSeniorMasterWarrantOfficer: 10, 
    ChiefMasterSergeantOrChiefMasterWarrantOfficer: 11,
    JuniorLieutenant: 12, 
    Lieutenant: 13, 
    SeniorLieutenant: 14, 
    CaptainOrCaptainLieutenant: 15,
    MajorOrCaptain3rdRank: 16, 
    LieutenantColonelOrCaptain2ndRank: 17, 
    ColonelOrCaptain1stRank: 18,
    BrigadierGeneralOrCommodore: 19, 
    MajorGeneralOrRearAdmiral: 20, 
    LieutenantGeneralOrViceAdmiral: 21, 
    GeneralOrAdmiral: 22
} as const;

export type MilitaryRank = typeof MilitaryRank[keyof typeof MilitaryRank];

export interface Veteran {
    id: string;
    fullName: string;
    rank: MilitaryRank;
    unitName: string;
    story: string;
    branch: MilitaryBranch;
    photoUrl?: string;
    $type: string;
}

export interface Pilot extends Veteran {
    $type: 'pilot';
    vehicleModel: string;
    experienceValue: number;
}

export interface Infantryman extends Veteran {
    $type: 'infantry';
    specialization: string;
}

export interface DroneOperator extends Veteran {
    $type: 'drone_op';
    vehicleModel: string;
    experienceValue: number;
}

export const getRankDisplayName = (rank: MilitaryRank, branch: MilitaryBranch): string => {
    const isNavy = branch === MilitaryBranch.Navy;
    
    switch (rank) {
        case MilitaryRank.Recruit: return 'Recruit';
        case MilitaryRank.SoldierOrSailor: return isNavy ? 'Seaman' : 'Soldier';
        case MilitaryRank.SeniorSoldierOrSeniorSailor: return isNavy ? 'Senior Seaman' : 'Senior Soldier';
        
        case MilitaryRank.JuniorSergeantOrPettyOfficer2ndClass: return isNavy ? 'Petty Officer 2nd Class' : 'Junior Sergeant';
        case MilitaryRank.SergeantOrPettyOfficer1stClass: return isNavy ? 'Petty Officer 1st Class' : 'Sergeant';
        case MilitaryRank.SeniorSergeantOrChiefPettyOfficer: return isNavy ? 'Chief Petty Officer' : 'Senior Sergeant';
        case MilitaryRank.ChiefSergeantOrChiefShipPettyOfficer: return isNavy ? 'Chief Ship Petty Officer' : 'Chief Sergeant';
        
        case MilitaryRank.StaffSergeantOrStaffWarrantOfficer: return isNavy ? 'Staff Warrant Officer' : 'Staff Sergeant';
        case MilitaryRank.MasterSergeantOrMasterWarrantOfficer: return isNavy ? 'Master Warrant Officer' : 'Master Sergeant';
        case MilitaryRank.SeniorMasterSergeantOrSeniorMasterWarrantOfficer: return isNavy ? 'Senior Master Warrant Officer' : 'Senior Master Sergeant';
        case MilitaryRank.ChiefMasterSergeantOrChiefMasterWarrantOfficer: return isNavy ? 'Chief Master Warrant Officer' : 'Chief Master Sergeant';

        case MilitaryRank.JuniorLieutenant: return 'Junior Lieutenant';
        case MilitaryRank.Lieutenant: return 'Lieutenant';
        case MilitaryRank.SeniorLieutenant: return 'Senior Lieutenant';
        case MilitaryRank.CaptainOrCaptainLieutenant: return isNavy ? 'Captain-Lieutenant' : 'Captain';
        
        case MilitaryRank.MajorOrCaptain3rdRank: return isNavy ? 'Captain 3rd Rank' : 'Major';
        case MilitaryRank.LieutenantColonelOrCaptain2ndRank: return isNavy ? 'Captain 2nd Rank' : 'Lieutenant Colonel';
        case MilitaryRank.ColonelOrCaptain1stRank: return isNavy ? 'Captain 1st Rank' : 'Colonel';
        
        case MilitaryRank.BrigadierGeneralOrCommodore: return isNavy ? 'Commodore' : 'Brigadier General';
        case MilitaryRank.MajorGeneralOrRearAdmiral: return isNavy ? 'Rear Admiral' : 'Major General';
        case MilitaryRank.LieutenantGeneralOrViceAdmiral: return isNavy ? 'Vice Admiral' : 'Lieutenant General';
        case MilitaryRank.GeneralOrAdmiral: return isNavy ? 'Admiral' : 'General';
        
        default: return 'Unknown Rank';
    }
};