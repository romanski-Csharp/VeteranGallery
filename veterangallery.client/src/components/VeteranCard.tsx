import { Plane, Users, Anchor, Crosshair, HelpCircle } from 'lucide-react';
import { MilitaryBranch } from '../types/veteran';
import type { Veteran, Pilot, Infantryman, DroneOperator } from '../types/veteran';

interface Props {
    veteran: Veteran;
}

const VeteranCard = ({ veteran }: Props) => {
    const getBranchIcon = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces: return <Users className="w-6 h-6" />;
            case MilitaryBranch.AirForce: return <Plane className="w-6 h-6" />;
            case MilitaryBranch.AirAssault: return <Crosshair className="w-6 h-6" />;
            case MilitaryBranch.Navy: return <Anchor className="w-6 h-6" />;
            default: return <HelpCircle className="w-6 h-6" />;
        }
    };

    const renderSpecializedInfo = () => {
        if (veteran.$type === 'pilot') {
            const p = veteran as Pilot;
            return (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#2563eb' }}>
                    <p>🛩️ Aircraft: {p.vehicleModel}</p>
                    <p>⏱️ Flight hours: {p.experienceValue}</p>
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#16a34a' }}>
                    <p>🎯 Specialization: {i.specialization}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="veteran-card">
            <div className="card-image-container">
                <img
                    src={veteran.photoUrl || '/src/assets/hero.png'}
                    alt={veteran.fullName}
                />
                <div className="branch-icon">
                    {getBranchIcon()}
                </div>
            </div>
            <div className="card-content">
                <h3>{veteran.fullName}</h3>
                <p className="rank-unit">{veteran.rank} • {veteran.unitName}</p>
                <p className="story">{veteran.story}</p>
                <div className="specialized-info">
                    {renderSpecializedInfo()}
                </div>
            </div>
        </div>
    );
};

export default VeteranCard;