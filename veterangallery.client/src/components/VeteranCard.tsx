import { Link, useLocation } from 'react-router-dom';
import { MilitaryBranch, getRankDisplayName } from '../types/veteran';
import type {
    Veteran, Pilot, Infantryman, DroneOperator, NavySailor,
    Artillery, TankCrewman, AirDefenseOperator, FlightNavigator,
    CombatDiver, NavalArtillerist, Paratrooper, AirAssaultSapper,
    Sniper, SpecialForcesSoldier, SpecialOpsIntelligence
} from '../types/veteran';

interface Props {
    veteran: Veteran;
}

const VeteranCard = ({ veteran }: Props) => {
    const location = useLocation();

    const getBranchName = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces:  return 'Land Forces';
            case MilitaryBranch.AirForce:    return 'Air Force';
            case MilitaryBranch.AirAssault:  return 'Air Assault';
            case MilitaryBranch.Navy:        return 'Navy';
            case MilitaryBranch.SpecialOps:  return 'Special Ops';
            default: return 'Armed Forces';
        }
    };

    const renderSpecializedInfo = () => {
        switch (veteran.$type) {
            case 'infantry': {
                const v = veteran as Infantryman;
                return <div className="text-[0.85rem] text-green-300 mt-1">{v.specialization}</div>;
            }
            case 'artillery': {
                const v = veteran as Artillery;
                return <div className="text-[0.85rem] text-green-300 mt-1">{v.weaponSystem} • {v.maxRangeKm} km</div>;
            }
            case 'tank_crew': {
                const v = veteran as TankCrewman;
                return <div className="text-[0.85rem] text-green-300 mt-1">{v.vehicleModel} • {v.crewPosition}</div>;
            }
            case 'pilot': {
                const v = veteran as Pilot;
                return <div className="text-[0.85rem] text-blue-300 mt-1">{v.vehicleModel} • {v.experienceValue} hrs</div>;
            }
            case 'air_defense': {
                const v = veteran as AirDefenseOperator;
                return <div className="text-[0.85rem] text-blue-300 mt-1">{v.systemType} • {v.confirmedInterceptions} intercepts</div>;
            }
            case 'navigator': {
                const v = veteran as FlightNavigator;
                return <div className="text-[0.85rem] text-blue-300 mt-1">{v.navigationSystem} • {v.sortieCount} sorties</div>;
            }
            case 'drone_op': {
                const v = veteran as DroneOperator;
                return <div className="text-[0.85rem] text-purple-300 mt-1">{v.vehicleModel} • {v.experienceValue} sorties</div>;
            }
            case 'paratrooper': {
                const v = veteran as Paratrooper;
                return <div className="text-[0.85rem] text-purple-300 mt-1">{v.parachuteType} • {v.totalJumps} jumps</div>;
            }
            case 'assault_sapper': {
                const v = veteran as AirAssaultSapper;
                return <div className="text-[0.85rem] text-purple-300 mt-1">{v.sapperQualification} • {v.minesCleared} demined</div>;
            }
            case 'navy': {
                const v = veteran as NavySailor;
                return <div className="text-[0.85rem] text-sky-300 mt-1">{v.specialization}</div>;
            }
            case 'combat_diver': {
                const v = veteran as CombatDiver;
                return <div className="text-[0.85rem] text-sky-300 mt-1">{v.underwaterMissions} missions • {v.divingDepthRating} m depth</div>;
            }
            case 'naval_artillery': {
                const v = veteran as NavalArtillerist;
                return <div className="text-[0.85rem] text-sky-300 mt-1">{v.coastalSystem} • {v.coastalSector}</div>;
            }
            case 'special_ops': {
                const v = veteran as SpecialForcesSoldier;
                return <div className="text-[0.85rem] text-red-300 mt-1">{v.isClassified ? 'Classified' : v.specialUnit}</div>;
            }
            case 'sniper': {
                const v = veteran as Sniper;
                return <div className="text-[0.85rem] text-red-300 mt-1">{v.rifleModel} • {v.maxEffectiveRange} m</div>;
            }
            case 'spec_intel': {
                const v = veteran as SpecialOpsIntelligence;
                return <div className="text-[0.85rem] text-red-300 mt-1">{v.isClassified ? 'Classified' : v.intelSpecialty}</div>;
            }
            default:
                return null;
        }
    };

    return (
        <Link
            to={`/veteran/${veteran.id}`}
            state={{ background: location }}
            className="block no-underline rounded-2xl overflow-hidden relative aspect-[3/4] bg-slate-800 shadow-md transition-transform duration-200 cursor-pointer hover:scale-[1.03]"
        >
            <img
                src={veteran.photoUrl || '/default-hero.png'}
                alt={veteran.fullName}
                className="w-full h-full object-cover block"
                onError={(e) => { e.currentTarget.src = '/default-hero.png'; }}
            />

            <div className="absolute top-3 right-3 bg-black/65 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xs uppercase tracking-[0.5px]">
                {getBranchName()}
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent pt-10 px-4 pb-4 text-white">
                <h3 className="m-0 mb-1 text-xl font-bold">
                    {veteran.fullName}
                </h3>
                <p className="m-0 text-sm text-slate-300">
                    {getRankDisplayName(veteran.rank, veteran.branch)} • {veteran.unitName}
                </p>
                {renderSpecializedInfo()}
            </div>
        </Link>
    );
};

export default VeteranCard;