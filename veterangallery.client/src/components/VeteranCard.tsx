import { Link, useLocation } from 'react-router-dom';
import { MilitaryBranch, getRankDisplayName } from '../types/veteran';
import type { Veteran, Pilot, Infantryman, DroneOperator, NavySailor } from '../types/veteran';


interface Props {
    veteran: Veteran;
}

const VeteranCard = ({ veteran }: Props) => {
    const location = useLocation();

    const getBranchName = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces: return "Land Forces";
            case MilitaryBranch.AirForce: return "Air Force";
            case MilitaryBranch.AirAssault: return "Air Assault";
            case MilitaryBranch.Navy: return "Navy";
            default: return "Armed Forces";
        }
    };

    const renderSpecializedInfo = () => {
        if (veteran.$type === 'pilot') {
            const p = veteran as Pilot;
            return (
                <div className="text-[0.85rem] text-blue-300 mt-1">
                    {p.vehicleModel} • {p.experienceValue} hrs
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div className="text-[0.85rem] text-green-300 mt-1">
                    {i.specialization}
                </div>
            );
        }
        if (veteran.$type === 'navy') {
            const n = veteran as NavySailor;
            return (
                <div className="text-[0.85rem] text-sky-300 mt-1">
                    {n.specialization}
                </div>
            );
        }
        if (veteran.$type === 'drone_op') {
            const d = veteran as DroneOperator;
            return (
                <div className="text-[0.85rem] text-purple-300 mt-1">
                    {d.vehicleModel} • {d.experienceValue} sorties
                </div>
            );
        }
        return null;
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