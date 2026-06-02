import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Users, Anchor, Crosshair, Shield, HelpCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { getVeteranById, deleteVeteran } from '../api/apiClient';
import { MilitaryBranch, getRankDisplayName } from '../types/veteran';
import AddVeteranForm from '../components/AddVeteranForm';
import type { Veteran } from '../types/veteran';

const VeteranDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [veteran, setVeteran] = useState<Veteran | null>(null);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const fetchVeteran = async () => {
        if (!id) return;
        try {
            const data = await getVeteranById(id);
            setVeteran(data);
        } catch (err) {
            console.error("Error fetching veteran details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        fetchVeteran();
        return () => { document.body.style.overflow = 'auto'; };
    }, [id]);

    const handleClose = () => {
        if (isEditing) {
            const confirmExit = window.confirm("You are currently editing. Are you sure you want to exit without saving?");
            if (!confirmExit) return;
        }
        navigate(-1);
    };

    const handleDelete = async () => {
        if (!id) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this hero's profile?");
        if (!confirmDelete) return;

        try {
            await deleteVeteran(id);
            window.location.href = '/';
        } catch (err) {
            alert("Error: Could not delete the profile.");
        }
    };

    const handleUpdateSuccess = async () => {
        setIsEditing(false);
        setShowMenu(false);
        await fetchVeteran();
    };

    if (loading || !veteran) return null;

    const isAdmin = !!localStorage.getItem('adminToken');

    const getBranchIcon = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces:  return <Users size={20} />;
            case MilitaryBranch.AirForce:    return <Plane size={20} />;
            case MilitaryBranch.AirAssault:  return <Crosshair size={20} />;
            case MilitaryBranch.Navy:        return <Anchor size={20} />;
            case MilitaryBranch.SpecialOps:  return <Shield size={20} />;
            default: return <HelpCircle size={20} />;
        }
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

    const renderSpecializedDetails = () => {
        const v = veteran as any;

        const renderBranchInfo = () => {
            switch (veteran.branch) {
                case MilitaryBranch.AirForce:
                    return (
                        <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                            <h5 className="m-0 mb-2 text-slate-500 text-[0.8rem] uppercase tracking-wide">Air Force Service</h5>
                            <div className="grid grid-cols-3 gap-3">
                                {v.airBase && <p className="my-0.5 text-[0.9rem]"><strong>Air Base:</strong> {v.airBase}</p>}
                                <p className="my-0.5 text-[0.9rem]"><strong>Flight Hours:</strong> {v.totalFlightHours ?? 0}</p>
                                <p className="my-0.5 text-[0.9rem]"><strong>Combat Missions:</strong> {v.hasCombatMissions ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                    );
                case MilitaryBranch.LandForces:
                    return (
                        <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                            <h5 className="m-0 mb-2 text-slate-500 text-[0.8rem] uppercase tracking-wide">Land Forces Service</h5>
                            <div className="grid grid-cols-3 gap-3">
                                {v.primaryWeapon && <p className="my-0.5 text-[0.9rem]"><strong>Weapon:</strong> {v.primaryWeapon}</p>}
                                {v.areaOfOperations && <p className="my-0.5 text-[0.9rem]"><strong>Area:</strong> {v.areaOfOperations}</p>}
                                <p className="my-0.5 text-[0.9rem]"><strong>Deployments:</strong> {v.combatDeployments ?? 0}</p>
                            </div>
                        </div>
                    );
                case MilitaryBranch.Navy:
                    return (
                        <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                            <h5 className="m-0 mb-2 text-slate-500 text-[0.8rem] uppercase tracking-wide">Naval Service</h5>
                            <div className="grid grid-cols-3 gap-3">
                                {v.vesselName && <p className="my-0.5 text-[0.9rem]"><strong>Vessel:</strong> {v.vesselName}</p>}
                                {v.vesselType && <p className="my-0.5 text-[0.9rem]"><strong>Type:</strong> {v.vesselType}</p>}
                                <p className="my-0.5 text-[0.9rem]"><strong>Sea Days:</strong> {v.totalSeaDays ?? 0}</p>
                            </div>
                        </div>
                    );
                case MilitaryBranch.AirAssault:
                    return (
                        <div className="bg-slate-50 p-4 rounded-lg mb-4 border border-slate-200">
                            <h5 className="m-0 mb-2 text-slate-500 text-[0.8rem] uppercase tracking-wide">Air Assault Service</h5>
                            <div className="grid grid-cols-2 gap-3">
                                {v.primaryTheatre && <p className="my-0.5 text-[0.9rem]"><strong>Theatre:</strong> {v.primaryTheatre}</p>}
                                <p className="my-0.5 text-[0.9rem]"><strong>Operation Hours:</strong> {v.totalOperationHours ?? 0}</p>
                            </div>
                        </div>
                    );
                default:
                    return null;
            }
        };

        switch (veteran.$type) {
            case 'infantry': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500">
                            <h4 className="m-0 mb-2 text-green-800 text-[0.9rem] uppercase">Infantry Record</h4>
                            <p className="my-1"><strong>Specialization:</strong> {v.specialization}</p>
                        </div>
                    </div>
                );
            }
            case 'artillery': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500">
                            <h4 className="m-0 mb-2 text-green-800 text-[0.9rem] uppercase">Artillery Record</h4>
                            <p className="my-1"><strong>Weapon System:</strong> {v.weaponSystem}</p>
                            <p className="my-1"><strong>Max Range:</strong> {v.maxRangeKm} km</p>
                        </div>
                    </div>
                );
            }
            case 'tank_crew': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-green-50 p-5 rounded-xl border-l-4 border-green-500">
                            <h4 className="m-0 mb-2 text-green-800 text-[0.9rem] uppercase">Armoured Forces Record</h4>
                            <p className="my-1"><strong>Tank:</strong> {v.vehicleModel}</p>
                            <p className="my-1"><strong>Crew Position:</strong> {v.crewPosition}</p>
                        </div>
                    </div>
                );
            }
            case 'pilot': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
                            <h4 className="m-0 mb-2 text-blue-800 text-[0.9rem] uppercase">Aviation Record</h4>
                            <p className="my-1"><strong>Aircraft:</strong> {v.vehicleModel}</p>
                            <p className="my-1"><strong>Flight Hours:</strong> {v.experienceValue} hrs</p>
                        </div>
                    </div>
                );
            }
            case 'air_defense': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
                            <h4 className="m-0 mb-2 text-blue-800 text-[0.9rem] uppercase">Air Defense Record</h4>
                            <p className="my-1"><strong>System:</strong> {v.systemType}</p>
                            <p className="my-1"><strong>Confirmed Interceptions:</strong> {v.confirmedInterceptions}</p>
                        </div>
                    </div>
                );
            }
            case 'navigator': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500">
                            <h4 className="m-0 mb-2 text-blue-800 text-[0.9rem] uppercase">Navigation Record</h4>
                            <p className="my-1"><strong>Navigation System:</strong> {v.navigationSystem}</p>
                            <p className="my-1"><strong>Combat Sorties:</strong> {v.sortieCount}</p>
                        </div>
                    </div>
                );
            }
            case 'drone_op': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-purple-50 p-5 rounded-xl border-l-4 border-purple-500">
                            <h4 className="m-0 mb-2 text-purple-800 text-[0.9rem] uppercase">Drone Operations Record</h4>
                            <p className="my-1"><strong>Drone Model:</strong> {v.vehicleModel}</p>
                            <p className="my-1"><strong>Sorties:</strong> {v.experienceValue}</p>
                        </div>
                    </div>
                );
            }
            case 'paratrooper': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-purple-50 p-5 rounded-xl border-l-4 border-purple-500">
                            <h4 className="m-0 mb-2 text-purple-800 text-[0.9rem] uppercase">Airborne Record</h4>
                            <p className="my-1"><strong>Parachute System:</strong> {v.parachuteType}</p>
                            <p className="my-1"><strong>Total Jumps:</strong> {v.totalJumps}</p>
                        </div>
                    </div>
                );
            }
            case 'assault_sapper': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-purple-50 p-5 rounded-xl border-l-4 border-purple-500">
                            <h4 className="m-0 mb-2 text-purple-800 text-[0.9rem] uppercase">Sapper Record</h4>
                            <p className="my-1"><strong>Qualification:</strong> {v.sapperQualification}</p>
                            <p className="my-1"><strong>Objects Demined:</strong> {v.minesCleared}</p>
                        </div>
                    </div>
                );
            }
            case 'navy': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-sky-50 p-5 rounded-xl border-l-4 border-sky-500">
                            <h4 className="m-0 mb-2 text-sky-800 text-[0.9rem] uppercase">Naval Record</h4>
                            <p className="my-1"><strong>Specialization:</strong> {v.specialization}</p>
                        </div>
                    </div>
                );
            }
            case 'combat_diver': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-sky-50 p-5 rounded-xl border-l-4 border-sky-500">
                            <h4 className="m-0 mb-2 text-sky-800 text-[0.9rem] uppercase">Combat Diving Record</h4>
                            <p className="my-1"><strong>Max Depth:</strong> {v.divingDepthRating} m</p>
                            <p className="my-1"><strong>Underwater Missions:</strong> {v.underwaterMissions}</p>
                        </div>
                    </div>
                );
            }
            case 'naval_artillery': {
                return (
                    <div className="mt-6">
                        {renderBranchInfo()}
                        <div className="bg-sky-50 p-5 rounded-xl border-l-4 border-sky-500">
                            <h4 className="m-0 mb-2 text-sky-800 text-[0.9rem] uppercase">Naval Artillery Record</h4>
                            <p className="my-1"><strong>Coastal System:</strong> {v.coastalSystem}</p>
                            <p className="my-1"><strong>Sector:</strong> {v.coastalSector}</p>
                        </div>
                    </div>
                );
            }
            case 'special_ops': {
                return (
                    <div className="bg-red-50 p-5 rounded-xl mt-6 border-l-4 border-red-500">
                        <h4 className="m-0 mb-2 text-red-800 text-[0.9rem] uppercase">Special Forces Record</h4>
                        {v.isClassified
                            ? <p className="my-1 italic text-slate-500">Details of service are classified.</p>
                            : <p className="my-1"><strong>Special Unit:</strong> {v.specialUnit}</p>
                        }
                    </div>
                );
            }
            case 'sniper': {
                return (
                    <div className="bg-red-50 p-5 rounded-xl mt-6 border-l-4 border-red-500">
                        <h4 className="m-0 mb-2 text-red-800 text-[0.9rem] uppercase">Sniper Record</h4>
                        {v.isClassified
                            ? <p className="my-1 italic text-slate-500">Details of service are classified.</p>
                            : <>
                                <p className="my-1"><strong>Rifle:</strong> {v.rifleModel}</p>
                                <p className="my-1"><strong>Max Effective Range:</strong> {v.maxEffectiveRange} m</p>
                            </>
                        }
                    </div>
                );
            }
            case 'spec_intel': {
                return (
                    <div className="bg-red-50 p-5 rounded-xl mt-6 border-l-4 border-red-500">
                        <h4 className="m-0 mb-2 text-red-800 text-[0.9rem] uppercase">Intelligence Record</h4>
                        {v.isClassified
                            ? <p className="my-1 italic text-slate-500">Details of service are classified.</p>
                            : <>
                                <p className="my-1"><strong>Specialty:</strong> {v.intelSpecialty}</p>
                                <p className="my-1"><strong>Field Operations:</strong> {v.fieldOperations}</p>
                            </>
                        }
                    </div>
                );
            }
            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-3xl w-full max-w-[850px] max-h-[90vh] flex overflow-hidden shadow-2xl relative"
                style={{ animation: 'modalFadeIn 0.3s ease-out forwards' }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-5 left-5 z-10 bg-white/90 border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-sm text-slate-900 hover:bg-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="absolute top-5 right-5 z-20">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="bg-white/90 border-none w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-sm text-slate-900 hover:bg-white transition-colors"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                            <div className="absolute top-12 right-0 bg-white rounded-xl p-2 shadow-lg border border-slate-200 min-w-[160px] z-20 flex flex-col gap-1">
                                <button
                                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                    className="flex items-center gap-2 px-3 py-2.5 border-none bg-transparent w-full text-left cursor-pointer rounded-lg text-[0.9rem] text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                                >
                                    <Edit2 size={16} /> Edit Profile
                                </button>

                                {isAdmin && (
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 px-3 py-2.5 border-none bg-transparent w-full text-left cursor-pointer rounded-lg text-[0.9rem] text-red-600 font-semibold hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete Profile
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-[42%] shrink-0 bg-slate-800 rounded-l-3xl overflow-hidden">
                    <img
                        src={veteran.photoUrl || '/default-hero.png'}
                        alt={veteran.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/default-hero.png'; }}
                    />
                </div>

                <div className="custom-scroll flex-1 p-12 pr-10 overflow-y-auto">
                    {isEditing ? (
                        <AddVeteranForm
                            veteranToEdit={veteran}
                            onSuccess={handleUpdateSuccess}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <div className="inline-flex items-center gap-2 bg-slate-800 px-3.5 py-1.5 rounded-full text-white font-semibold text-[0.85rem]">
                                    {getBranchIcon()}
                                    {getSubtypeLabel(veteran.$type)}
                                </div>
                            </div>

                            <h2 className="m-0 mb-2 text-[2.5rem] text-slate-900 font-extrabold leading-none">{veteran.fullName}</h2>
                            <p className="m-0 mb-8 text-slate-500 text-[1.1rem] font-medium">
                                {getRankDisplayName(veteran.rank, veteran.branch)} • {veteran.unitName}
                            </p>

                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-[0.9rem] uppercase tracking-[0.5px] text-slate-400 mb-4 font-bold">Combat Story & Legacy</h3>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line text-[1rem] break-all overflow-wrap-anywhere">
                                    {veteran.story}
                                </p>
                            </div>

                            {renderSpecializedDetails()}
                        </>
                    )}
                </div>
            </div>

            <style>
                {`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .custom-scroll::-webkit-scrollbar { 
                    width: 14px; 
                }
                .custom-scroll::-webkit-scrollbar-track { 
                    background: transparent; 
                }
                .custom-scroll::-webkit-scrollbar-thumb { 
                    background-color: #cbd5e1; 
                    border-radius: 20px; 
                    border: 4px solid white;
                }
                `}
            </style>
        </div>
    );
};

export default VeteranDetails;