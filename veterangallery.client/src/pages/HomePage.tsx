import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, SearchX, Activity, CheckCircle, XCircle, Eye, X, RefreshCw, Archive } from 'lucide-react';
import Header from '../components/Header';
import VeteranCard from '../components/VeteranCard';
import { getVeterans, getProposals, approveProposal, rejectProposal, getComparison, restoreProposal } from '../api/apiClient';
import type { Veteran } from '../types/veteran';
import { getRankDisplayName } from '../types/veteran';

const HomePage = () => {
    const [veterans, setVeterans] = useState<Veteran[]>([]);
    const [gridKey, setGridKey] = useState(0);
    const [activeBranch, setActiveBranch] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('System Online');

    const isAdmin = !!localStorage.getItem('adminToken');
    const [activeTab, setActiveTab] = useState<'gallery' | 'pending' | 'rejected'>('gallery');
    const [proposals, setProposals] = useState<any[]>([]);
    const [proposalsLoading, setProposalsLoading] = useState(false);
    const [viewingProposal, setViewingProposal] = useState<any>(null);

    useEffect(() => {
        if (activeTab === 'gallery') {
            const loadData = async () => {
                setLoading(true);
                setStatusMessage('Fetching data from server...');
                try {
                    const data = await getVeterans(searchQuery, activeBranch, sortBy);
                    setVeterans(data);
                    setGridKey(prev => prev + 1);
                    setStatusMessage('Data synchronized');
                } catch (error) {
                    setStatusMessage('Error: Cannot connect to server');
                } finally {
                    setLoading(false);
                }
            };
            const delay = setTimeout(() => { loadData(); }, 300);
            return () => clearTimeout(delay);
        }
    }, [activeBranch, searchQuery, sortBy, activeTab]);

    useEffect(() => {
        if (isAdmin && (activeTab === 'pending' || activeTab === 'rejected')) {
            fetchProposalsData(activeTab === 'pending' ? 1 : 3);
        }
    }, [isAdmin, activeTab]);

    const fetchProposalsData = async (status: number) => {
        setProposalsLoading(true);
        try {
            const data = await getProposals(status);
            setProposals(data);
        } catch (err) {
            console.error(err);
        } finally {
            setProposalsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!window.confirm("Publish this to public gallery?")) return;
        await approveProposal(id);
        setViewingProposal(null);
        fetchProposalsData(1);
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Move this proposal to the Rejected archive?")) return;
        await rejectProposal(id);
        setViewingProposal(null);
        fetchProposalsData(1);
    };

    const handleRestore = async (id: string) => {
        if (!window.confirm("Restore this proposal to the Pending Queue?")) return;
        await restoreProposal(id);
        setViewingProposal(null);
        fetchProposalsData(3);
    };

    const handleViewComparison = async (p: any) => {
        if (p.type === 2) {
            const compData = await getComparison(p.id);
            setViewingProposal({ ...p, current: compData.current });
        } else {
            setViewingProposal(p);
        }
    };

    const getFieldClassName = (propVal: any, currVal: any, baseClass: string = '') => {
        if (currVal !== undefined && propVal !== currVal) {
            return `${baseClass} bg-yellow-100 px-1 py-0.5 rounded`;
        }
        return baseClass;
    };

    const getSubtypeLabel = (type: string): string => {
        const labels: Record<string, string> = {
            'infantry': 'Infantryman', 'artillery': 'Artillery Specialist', 'tank_crew': 'Tank Crewman',
            'pilot': 'Pilot', 'air_defense': 'Air Defense Operator', 'navigator': 'Flight Navigator',
            'drone_op': 'Drone Operator', 'paratrooper': 'Paratrooper', 'assault_sapper': 'Air Assault Sapper',
            'navy': 'Navy Sailor', 'combat_diver': 'Combat Diver', 'naval_artillery': 'Naval Artillerist',
            'special_ops': 'Special Forces Soldier', 'sniper': 'Sniper', 'spec_intel': 'Intelligence Officer',
        };
        return labels[type] ?? 'Unknown';
    };

    const renderSpecializedMetrics = (data: any, compareData?: any) => {
        if (!data) return null;
        const type = data.$type;

        const colorMap: Record<string, string> = {
            infantry: 'green', artillery: 'green', tank_crew: 'green',
            pilot: 'blue', air_defense: 'blue', navigator: 'blue',
            drone_op: 'purple', paratrooper: 'purple', assault_sapper: 'purple',
            navy: 'sky', combat_diver: 'sky', naval_artillery: 'sky',
            special_ops: 'red', sniper: 'red', spec_intel: 'red',
        };
        const color = colorMap[type];
        if (!color) return null;

        const label = getSubtypeLabel(type);
        const fields: { label: string; propKey: string; suffix?: string }[] = (() => {
            switch (type) {
                case 'infantry':        return [{ label: 'Specialization', propKey: 'specialization' }];
                case 'artillery':       return [{ label: 'Weapon System', propKey: 'weaponSystem' }, { label: 'Max Range', propKey: 'maxRangeKm', suffix: ' km' }];
                case 'tank_crew':       return [{ label: 'Tank', propKey: 'vehicleModel' }, { label: 'Crew Position', propKey: 'crewPosition' }];
                case 'pilot':           return [{ label: 'Aircraft', propKey: 'vehicleModel' }, { label: 'Flight Hours', propKey: 'experienceValue', suffix: ' hrs' }];
                case 'air_defense':     return [{ label: 'System', propKey: 'systemType' }, { label: 'Confirmed Interceptions', propKey: 'confirmedInterceptions' }];
                case 'navigator':       return [{ label: 'Navigation System', propKey: 'navigationSystem' }, { label: 'Combat Sorties', propKey: 'sortieCount' }];
                case 'drone_op':        return [{ label: 'Drone Model', propKey: 'vehicleModel' }, { label: 'Sorties', propKey: 'experienceValue' }];
                case 'paratrooper':     return [{ label: 'Parachute System', propKey: 'parachuteType' }, { label: 'Total Jumps', propKey: 'totalJumps' }];
                case 'assault_sapper':  return [{ label: 'Qualification', propKey: 'sapperQualification' }, { label: 'Objects Demined', propKey: 'minesCleared' }];
                case 'navy':            return [{ label: 'Specialization', propKey: 'specialization' }];
                case 'combat_diver':    return [{ label: 'Max Depth', propKey: 'divingDepthRating', suffix: ' m' }, { label: 'Underwater Missions', propKey: 'underwaterMissions' }];
                case 'naval_artillery': return [{ label: 'Coastal System', propKey: 'coastalSystem' }, { label: 'Sector', propKey: 'coastalSector' }];
                case 'special_ops':     return data.isClassified ? [] : [{ label: 'Special Unit', propKey: 'specialUnit' }, { label: 'Mission Type', propKey: 'missionType' }];
                case 'sniper':          return data.isClassified ? [] : [{ label: 'Rifle', propKey: 'rifleModel' }, { label: 'Max Effective Range', propKey: 'maxEffectiveRange', suffix: ' m' }];
                case 'spec_intel':      return data.isClassified ? [] : [{ label: 'Specialty', propKey: 'intelSpecialty' }, { label: 'Field Operations', propKey: 'fieldOperations' }];
                default:                return [];
            }
        })();

        return (
            <div className={`border border-${color}-200 bg-${color}-50 rounded-xl p-4 mt-6`}>
                <h4 className={`m-0 mb-3 text-${color}-800 text-[0.8rem] uppercase tracking-[0.5px] font-bold`}>
                    Specialized Profile Metrics — {label}
                </h4>
                <div className="flex flex-col gap-1.5">
                    {(type === 'special_ops' || type === 'sniper' || type === 'spec_intel') && data.isClassified ? (
                        <p className="my-0 text-[0.9rem] italic text-slate-500">Service details are classified.</p>
                    ) : (
                        fields.map(f => (
                            <p key={f.propKey} className="my-0 text-[0.9rem]">
                                <strong>{f.label}:</strong>{' '}
                                <span className={getFieldClassName(data[f.propKey], compareData?.[f.propKey])}>
                                    {data[f.propKey] != null ? `${data[f.propKey]}${f.suffix ?? ''}` : <em className="text-slate-400">N/A</em>}
                                </span>
                            </p>
                        ))
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen flex flex-col bg-slate-50 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] pb-10">
            <Header onFilterChange={setActiveBranch} onSearchChange={setSearchQuery} onSortChange={setSortBy} />

            <main className="flex-1 max-w-[1200px] w-full mx-auto p-8">

                {isAdmin && (
                    <div className="flex gap-8 border-b-2 border-slate-200 mb-8">
                        <button onClick={() => setActiveTab('gallery')} className={`bg-transparent border-none pb-2.5 text-[1.1rem] font-extrabold cursor-pointer border-b-3 ${activeTab === 'gallery' ? 'text-slate-900 border-blue-500' : 'text-slate-400 border-transparent'}`}>
                            Public Gallery
                        </button>
                        <button onClick={() => setActiveTab('pending')} className={`flex items-center gap-2 bg-transparent border-none pb-2.5 text-[1.1rem] font-extrabold cursor-pointer border-b-3 ${activeTab === 'pending' ? 'text-amber-600 border-amber-600' : 'text-slate-400 border-transparent'}`}>
                            Pending
                            {activeTab === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[0.8rem]">{proposals.length}</span>}
                        </button>
                        <button onClick={() => setActiveTab('rejected')} className={`flex items-center gap-2 bg-transparent border-none pb-2.5 text-[1.1rem] font-extrabold cursor-pointer border-b-3 ${activeTab === 'rejected' ? 'text-red-600 border-red-600' : 'text-slate-400 border-transparent'}`}>
                            Rejected
                        </button>
                    </div>
                )}

                <div style={{ display: activeTab === 'gallery' ? 'block' : 'none' }}>
                    <div className="mb-8 flex justify-end">
                        <Link to="/add-veteran" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full no-underline font-semibold transition-all duration-200 shadow-md hover:bg-slate-800">
                            <PlusCircle size={20} /> Add New Profile
                        </Link>
                    </div>

                    {loading && veterans.length === 0 ? (
                        <div className="text-center mt-16 text-slate-500 font-semibold">Loading heroes...</div>
                    ) : veterans.length === 0 ? (
                        <div className="text-center mt-16 text-slate-500">
                            <SearchX size={64} className="mx-auto mb-4 opacity-50" />
                            <h3>No records found</h3>
                        </div>
                    ) : (
                        <div key={gridKey} className={`grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-8 transition-opacity duration-200 ease-in-out ${loading ? 'opacity-40' : 'opacity-100'}`}>
                            {veterans.map((v, index) => (
                                <div key={v.id} style={{ animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`, animationDelay: `${index * 0.05}s`, opacity: 0 }}>
                                    <VeteranCard veteran={v} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: (activeTab === 'pending' || activeTab === 'rejected') ? 'block' : 'none' }}>
                    {proposalsLoading ? (
                        <div className="text-center p-12 text-slate-500">Loading queue...</div>
                    ) : proposals.length === 0 ? (
                        <div className="text-center bg-white p-16 rounded-2xl border border-dashed border-slate-300">
                            {activeTab === 'pending' ? <CheckCircle size={48} color="#cbd5e1" className="block mx-auto mb-4" /> : <Archive size={48} color="#cbd5e1" className="block mx-auto mb-4" />}
                            <h3 className="text-slate-600 m-0">Queue is empty</h3>
                            <p className="text-slate-400 text-[0.9rem]">{activeTab === 'pending' ? 'All profiles are up to date.' : 'No rejected proposals.'}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {proposals.map(p => (
                                <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm flex gap-6 items-start">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                        <img src={p.proposedData.photoUrl || '/default-hero.png'} alt="Hero" className="w-full h-full object-cover" onError={e => e.currentTarget.src = '/default-hero.png'} />
                                    </div>
                                    <div className="flex-1">
                                        <span className={`text-[0.7rem] font-extrabold uppercase px-2 py-1 rounded inline-block mb-2 ${p.type === 1 ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                            {p.type === 1 ? 'New Profile' : 'Profile Edit'}
                                        </span>
                                        <span className="text-[0.7rem] font-bold uppercase px-2 py-1 rounded inline-block mb-2 ml-2 bg-slate-100 text-slate-600">
                                            {getSubtypeLabel(p.proposedData.$type)}
                                        </span>

                                        <h3 className="m-0 mb-1 text-[1.2rem] text-slate-900 font-bold">{p.proposedData.fullName}</h3>
                                        <p className="m-0 text-slate-500 text-[0.9rem]">{getRankDisplayName(p.proposedData.rank, p.proposedData.branch)} • {p.proposedData.unitName}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button onClick={() => handleViewComparison(p)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border-none rounded-lg font-semibold cursor-pointer transition-colors">
                                            <Eye size={16} /> View / Compare
                                        </button>

                                        {activeTab === 'pending' ? (
                                            <>
                                                <button onClick={() => handleApprove(p.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white hover:bg-green-600 border-none rounded-lg font-semibold cursor-pointer transition-colors">
                                                    <CheckCircle size={16} /> Approve
                                                </button>
                                                <button onClick={() => handleReject(p.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 border-none rounded-lg font-semibold cursor-pointer transition-colors">
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleRestore(p.id)} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 border-none rounded-lg font-semibold cursor-pointer transition-colors">
                                                <RefreshCw size={16} /> Restore
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <footer className="fixed bottom-0 inset-x-0 bg-slate-900 text-slate-300 px-6 py-2 flex justify-between items-center text-[0.8rem] z-[100] shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-2">
                    <Activity size={16} style={{ color: '#22c55e' }} />
                    <span className="font-medium text-white">Status:</span> {statusMessage}
                </div>
                <div className="flex gap-6 font-medium">
                    <span>Total Profiles: <strong className="text-white">{veterans.length}</strong></span>
                    <span className="border-l border-slate-800 pl-6">Infantry: <strong className="text-white">{veterans.filter(v => v.$type === 'infantry').length}</strong></span>
                    <span className="border-l border-slate-800 pl-6">Aviation: <strong className="text-white">{veterans.filter(v => v.$type === 'pilot').length}</strong></span>
                    <span className="border-l border-slate-800 pl-6">Navy: <strong className="text-white">{veterans.filter(v => v.$type === 'navy').length}</strong></span>
                    <span className="border-l border-slate-800 pl-6">Drones: <strong className="text-white">{veterans.filter(v => v.$type === 'drone_op').length}</strong></span>
                </div>
            </footer>

            {viewingProposal && (
                <div className="fixed inset-0 z-[1000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-8" onClick={() => setViewingProposal(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-[1050px] max-h-[90vh] flex overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>

                        <button onClick={() => setViewingProposal(null)} className="absolute top-5 right-5 z-10 bg-white/90 border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-sm text-slate-900 hover:bg-white transition-colors">
                            <X size={20} />
                        </button>

                        <div className="w-[38%] shrink-0 bg-slate-800">
                            <img src={viewingProposal.proposedData.photoUrl || '/default-hero.png'} alt="Hero" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/default-hero.png'; }} />
                        </div>

                        <div className="custom-scroll flex-1 p-12 pr-10 overflow-y-auto">
                            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-[0.85rem] mb-2 ${viewingProposal.type === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {viewingProposal.type === 1 ? 'New Profile Preview' : 'Proposed Edits Comparison'}
                            </div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold text-[0.85rem] mb-6 ml-2 bg-slate-100 text-slate-600">
                                {getSubtypeLabel(viewingProposal.proposedData.$type)}
                            </div>


                            {viewingProposal.type === 1 || !viewingProposal.current ? (
                                <>
                                    <h2 className="m-0 mb-2 text-[2.5rem] text-slate-900 font-extrabold leading-none">{viewingProposal.proposedData.fullName}</h2>
                                    <p className="m-0 mb-8 text-slate-500 text-[1.1rem] font-medium">
                                        {getRankDisplayName(viewingProposal.proposedData.rank, viewingProposal.proposedData.branch)} • {viewingProposal.proposedData.unitName}
                                    </p>
                                    <div className="border-t border-slate-200 pt-6">
                                        <h3 className="text-[0.9rem] uppercase tracking-[0.5px] text-slate-400 mb-4 font-bold">Combat Story & Legacy</h3>
                                        <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[1rem] break-all overflow-wrap-anywhere">
                                            {viewingProposal.proposedData.story}
                                        </p>
                                    </div>
                                    {renderSpecializedMetrics(viewingProposal.proposedData)}
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="border-r border-slate-200 pr-6">
                                        <h4 className="text-slate-400 uppercase text-[0.75rem] tracking-[0.5px] mb-4">Current Database State</h4>
                                        <h2 className="m-0 mb-2 text-[1.5rem] text-slate-500 font-bold">{viewingProposal.current.fullName}</h2>
                                        <p className="m-0 mb-4 text-slate-400 text-[0.9rem] font-medium">
                                            {getRankDisplayName(viewingProposal.current.rank, viewingProposal.current.branch)} • {viewingProposal.current.unitName}
                                        </p>
                                        <div className="border-t border-dashed border-slate-200 pt-4">
                                            <p className="text-slate-500 leading-normal whitespace-pre-line text-[0.9rem] break-all overflow-wrap-anywhere">
                                                {viewingProposal.current.story}
                                            </p>
                                        </div>
                                        {renderSpecializedMetrics(viewingProposal.current)}
                                    </div>
                                    <div>
                                        <h4 className="text-yellow-600 uppercase text-[0.75rem] tracking-[0.5px] mb-4">Proposed Changes</h4>
                                        <h2 className={getFieldClassName(viewingProposal.proposedData.fullName, viewingProposal.current.fullName, 'm-0 mb-2 text-[1.5rem] text-slate-900 font-bold')}>
                                            {viewingProposal.proposedData.fullName}
                                        </h2>
                                        <p className={getFieldClassName(
                                            `${viewingProposal.proposedData.rank}-${viewingProposal.proposedData.unitName}`,
                                            `${viewingProposal.current.rank}-${viewingProposal.current.unitName}`,
                                            'm-0 mb-4 text-slate-900 text-[0.9rem] font-semibold'
                                        )}>
                                            {getRankDisplayName(viewingProposal.proposedData.rank, viewingProposal.proposedData.branch)} • {viewingProposal.proposedData.unitName}
                                        </p>
                                        <div className="border-t border-dashed border-slate-200 pt-4">
                                            <p className={getFieldClassName(viewingProposal.proposedData.story, viewingProposal.current.story, 'text-slate-900 leading-normal whitespace-pre-line text-[0.9rem] break-all overflow-wrap-anywhere')}>
                                                {viewingProposal.proposedData.story}
                                            </p>
                                        </div>
                                        {renderSpecializedMetrics(viewingProposal.proposedData, viewingProposal.current)}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 mt-8 border-t border-slate-200 pt-6">
                                {activeTab === 'pending' ? (
                                    <>
                                        <button onClick={() => handleApprove(viewingProposal.id)} className="px-6 py-3 bg-green-500 text-white rounded-lg border-none cursor-pointer font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors">
                                            <CheckCircle size={20} /> Approve & Publish
                                        </button>
                                        <button onClick={() => handleReject(viewingProposal.id)} className="px-6 py-3 bg-red-100 text-red-600 rounded-lg border-none cursor-pointer font-semibold flex items-center gap-2 hover:bg-red-200 transition-colors">
                                            <XCircle size={20} /> Reject Proposal
                                        </button>
                                    </>
                                ) : (
                                        <button onClick={() => handleRestore(viewingProposal.id)} className="px-6 py-3 bg-indigo-100 text-indigo-600 rounded-lg border-none cursor-pointer font-semibold flex items-center gap-2 hover:bg-indigo-200 transition-colors">
                                            <RefreshCw size={20} /> Restore to Pending
                                        </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;