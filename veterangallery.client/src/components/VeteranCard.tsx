import { Link, useLocation } from 'react-router-dom';
import { MilitaryBranch } from '../types/veteran';
import type { Veteran, Pilot, Infantryman, DroneOperator } from '../types/veteran';


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
                <div style={{ fontSize: '0.85rem', color: '#93c5fd', marginTop: '4px' }}>
                    {p.vehicleModel} • {p.experienceValue} hrs
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div style={{ fontSize: '0.85rem', color: '#86efac', marginTop: '4px' }}>
                    {i.specialization}
                </div>
            );
        }
        if (veteran.$type === 'drone_op') {
            const d = veteran as DroneOperator;
            return (
                <div style={{ fontSize: '0.85rem', color: '#d8b4fe', marginTop: '4px' }}>
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
            style={{
                display: 'block',
                textDecoration: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '3/4', 
                backgroundColor: '#1e293b',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <img
                src={veteran.photoUrl || '/default-hero.png'}
                alt={veteran.fullName}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                }}
                onError={(e) => { e.currentTarget.src = '/default-hero.png'; }}
            />

            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.65)', 
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                backdropFilter: 'blur(4px)', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {getBranchName()}
            </div>

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 60%, transparent 100%)',
                padding: '2.5rem 1rem 1rem 1rem', 
                color: 'white'
            }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {veteran.fullName}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {veteran.rank} • {veteran.unitName}
                </p>
                {renderSpecializedInfo()}
            </div>
        </Link>
    );
};

export default VeteranCard;