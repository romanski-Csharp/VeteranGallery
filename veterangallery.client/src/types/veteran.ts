export const MilitaryBranch = {
    LandForces: 0,
    AirForce: 1,
    Navy: 2,
    AirAssault: 3,
    SpecialOps: 4
} as const;

export type MilitaryBranchType = typeof MilitaryBranch[keyof typeof MilitaryBranch];

export interface Veteran {
    $type: string;
    id: string;
    fullName: string;
    rank: string;
    unitName: string;
    story: string;
    branch: MilitaryBranchType;
    photoUrl?: string;
}

export interface Pilot extends Veteran {
    vehicleModel: string;
    experienceValue: number;
}

export interface Infantryman extends Veteran {
    specialization: string;
}

export interface DroneOperator extends Veteran {
    vehicleModel: string;
    experienceValue: number;
}