import { useState } from 'react';
import { Search } from 'lucide-react';
import { MilitaryBranch } from '../types/veteran';

interface Props {
    onFilterChange: (branch: number | null) => void;
    onSearchChange: (query: string) => void;
    onSortChange: (sort: string) => void;
}

const Header = ({ onFilterChange, onSearchChange, onSortChange }: Props) => {
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    const handleFilter = (branch: number | null) => {
        setActiveFilter(branch);
        onFilterChange(branch);
    };

    const FilterButton = ({ label, value }: { label: string, value: number | null }) => {
        const isActive = activeFilter === value;
        return (
            <button
                onClick={() => handleFilter(value)}
                style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: isActive ? '#0f172a' : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    boxShadow: isActive ? '0 4px 10px rgba(15, 23, 42, 0.2)' : 'none',
                    whiteSpace: 'nowrap'
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
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-1px' }}>
                    VG
                </div>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
                    Veteran Gallery
                </h1>
            </div>

            <div style={{ flex: 1, maxWidth: '600px', display: 'flex', gap: '1rem', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, rank, unit, or spec..."
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 36px',
                            borderRadius: '9999px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#f8fafc',
                            fontSize: '0.9rem',
                            color: '#0f172a',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#94a3b8';
                            e.target.style.backgroundColor = '#ffffff';
                            e.target.style.boxShadow = '0 0 0 3px rgba(148, 163, 184, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.backgroundColor = '#f8fafc';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>

                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '9999px',
                        border: '1px solid #e2e8f0',
                        outline: 'none',
                        backgroundColor: '#f8fafc',
                        color: '#475569',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#94a3b8';
                        e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.backgroundColor = '#f8fafc';
                    }}
                >
                    <option value="">Sort: Newest First</option>
                    <option value="name_asc">Name: A to Z</option>
                    <option value="name_desc">Name: Z to A</option>
                    <option value="rank">Rank: High to Low</option>
                </select>
            </div>

            <nav style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '9999px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
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