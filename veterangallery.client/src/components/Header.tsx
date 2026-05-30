import { useState } from 'react';
import { Search, Info, ShieldAlert, LogOut } from 'lucide-react';
import { MilitaryBranch } from '../types/veteran';
import { CustomSelect } from './CustomSelect';
import AboutModal from './AboutModal';
import { LoginModal } from './LoginModal';
import { logoutAdmin } from '../api/apiClient';

interface Props {
    onFilterChange: (branch: number | null) => void;
    onSearchChange: (query: string) => void;
    onSortChange: (sort: string) => void;
}

const Header = ({ onFilterChange, onSearchChange, onSortChange }: Props) => {
    const [activeFilter, setActiveFilter] = useState<number | null>(null);
    const [currentSort, setCurrentSort] = useState<string>('');
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const isAdmin = !!localStorage.getItem('adminToken');

    const sortOptions = [
        { label: 'Sort: Newest First', value: '' },
        { label: 'Name: A to Z', value: 'name_asc' },
        { label: 'Name: Z to A', value: 'name_desc' },
        { label: 'Rank: High to Low', value: 'rank' }
    ];

    const handleFilter = (branch: number | null) => {
        setActiveFilter(branch);
        onFilterChange(branch);
    };

    const handleSortChange = (value: string) => {
        setCurrentSort(value);
        onSortChange(value);
    };

    const handleLogout = () => {
        logoutAdmin();
        window.location.reload();
    };

    const FilterButton = ({ label, value }: { label: string, value: number | null }) => {
        const isActive = activeFilter === value;
        return (
            <button
                onClick={() => handleFilter(value)}
                className={`px-4 py-2 rounded-full border-none text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap ${
                    isActive 
                        ? 'bg-slate-900 text-white shadow-[0_4px_10px_rgba(15,23,42,0.2)]' 
                        : 'bg-transparent text-slate-500 hover:text-slate-900'
                }`}
            >
                {label}
            </button>
        );
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex justify-between items-center gap-8 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-[1.2rem] tracking-tight">
                            VG
                        </div>
                        <h1 className="m-0 text-xl font-extrabold text-slate-900 tracking-[-0.5px] whitespace-nowrap">
                            Veteran Gallery
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                        <button
                            onClick={() => setIsAboutOpen(true)}
                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border-none px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-all duration-200"
                        >
                            <Info size={14} /> About App
                        </button>

                        {isAdmin ? (
                            <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full border border-red-300">
                                <span className="text-xs font-extrabold text-red-700">ADMIN</span>
                                <button onClick={handleLogout} className="bg-transparent border-none p-0 text-red-700 cursor-pointer flex items-center" title="Exit Admin Mode">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsLoginOpen(true)} 
                                className="bg-transparent border-none text-slate-400 hover:text-slate-800 cursor-pointer p-1.5 transition-colors duration-200 flex items-center" 
                                title="Commander Login"
                            >
                                <ShieldAlert size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 max-w-[600px] flex gap-4 relative z-[60]">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, rank, unit, or spec..."
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full py-2.5 pl-[42px] pr-4 rounded-full border border-slate-200 bg-slate-50 text-[0.9rem] text-slate-900 outline-none box-border transition-all duration-200 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/10"
                        />
                    </div>

                    <div className="min-w-[190px]">
                        <CustomSelect
                            value={currentSort}
                            onChange={handleSortChange}
                            options={sortOptions}
                            borderRadius="9999px"
                        />
                    </div>
                </div>

                <nav className="flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200 overflow-x-auto">
                    <FilterButton label="All Heroes" value={null} />
                    <FilterButton label="Land Forces" value={MilitaryBranch.LandForces} />
                    <FilterButton label="Air Force" value={MilitaryBranch.AirForce} />
                    <FilterButton label="Air Assault" value={MilitaryBranch.AirAssault} />
                    <FilterButton label="Navy" value={MilitaryBranch.Navy} />
                    <FilterButton label="Special Ops" value={MilitaryBranch.SpecialOps} />
                </nav>
            </header>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
        </>
    );
};

export default Header;