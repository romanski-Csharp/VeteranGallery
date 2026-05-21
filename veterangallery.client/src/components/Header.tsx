import { useState } from 'react';
import { MilitaryBranch } from '../types/veteran';

interface Props {
    onFilterChange: (branch: number | null) => void;
}

const Header = ({ onFilterChange }: Props) => {
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    const handleFilter = (branch: number | null) => {
        setActiveFilter(branch);
        onFilterChange(branch);
    };

    // Внутрішній компонент для красивих кнопок фільтрації
    const FilterButton = ({ label, value }: { label: string, value: number | null }) => {
        const isActive = activeFilter === value;
        return (
            <button
                onClick={() => handleFilter(value)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '9999px', // Робить форму "капсули"
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: isActive ? '#0f172a' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    boxShadow: isActive ? '0 4px 10px rgba(15, 23, 42, 0.2)' : 'none',
                }}
                onMouseOver={(e) => { if (!isActive) e.currentTarget.style.color = '#0f172a'; }}
                onMouseOut={(e) => { if (!isActive) e.currentTarget.style.color = '#64748b'; }}
            >
                {label}
            </button>
        );
    };

    return (
        <header style={{
            position: 'sticky', // Прилипає до верху при скролі
            top: 0,
            zIndex: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(12px)', // Ефект розмиття фону
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-1px' }}>
                    VG
                </div>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Veteran Gallery
                </h1>
            </div>

            <nav style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                <FilterButton label="All Heroes" value={null} />
                <FilterButton label="Land Forces" value={MilitaryBranch.LandForces} />
                <FilterButton label="Air Force" value={MilitaryBranch.AirForce} />
                <FilterButton label="Air Assault" value={MilitaryBranch.AirAssault} />
                <FilterButton label="Navy" value={MilitaryBranch.Navy} />
            </nav>
        </header>
    );
};

export default Header;