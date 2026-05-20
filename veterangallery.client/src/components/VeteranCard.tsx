import { Link } from 'react-router-dom';
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
                    <p>Aircraft: {p.vehicleModel}</p>
                    <p>Flight hours: {p.experienceValue}</p>
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#16a34a' }}>
                    <p>Specialization: {i.specialization}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="veteran-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>

            <div className="card-image-container" style={{ height: '200px', overflow: 'hidden', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <img
                    src={veteran.photoUrl || '/default-hero.png'}
                    alt={veteran.fullName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/default-hero.png'; }}
                />
                <div className="branch-icon" style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', padding: '6px', borderRadius: '50%' }}>
                    {getBranchIcon()}
                </div>
            </div>

            <div className="card-content" style={{ padding: '1rem', flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{veteran.fullName}</h3>
                <p className="rank-unit" style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                    {veteran.rank} • {veteran.unitName}
                </p>
                <p className="story" style={{ fontSize: '0.875rem', color: '#334155', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {veteran.story}
                </p>
                <div className="specialized-info">
                    {renderSpecializedInfo()}
                </div>
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
                <Link
                    to={`/veteran/${veteran.id}`}
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        backgroundColor: '#1e293b',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default VeteranCard;