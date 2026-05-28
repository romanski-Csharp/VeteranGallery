import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Users, Anchor, Crosshair, HelpCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { getVeteranById, deleteVeteran } from '../api/apiClient';
import { MilitaryBranch, getRankDisplayName } from '../types/veteran';
import AddVeteranForm from '../components/AddVeteranForm';
import type { Veteran, Pilot, Infantryman, Navy } from '../types/veteran';

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
            case MilitaryBranch.LandForces: return <Users size={20} />;
            case MilitaryBranch.AirForce: return <Plane size={20} />;
            case MilitaryBranch.AirAssault: return <Crosshair size={20} />;
            case MilitaryBranch.Navy: return <Anchor size={20} />;
            default: return <HelpCircle size={20} />;
        }
    };

    const getBranchName = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces: return "Land Forces";
            case MilitaryBranch.AirForce: return "Air Force";
            case MilitaryBranch.AirAssault: return "Air Assault Forces";
            case MilitaryBranch.Navy: return "Navy";
            default: return "Armed Forces";
        }
    };

    const renderSpecializedDetails = () => {
        if (veteran.$type === 'pilot') {
            const p = veteran as Pilot;
            return (
                <div className="bg-blue-50 p-5 rounded-xl mt-6 border-l-4 border-blue-500">
                    <h4 className="m-0 mb-2 text-blue-800 text-[0.9rem] uppercase">Aviation Record</h4>
                    <p className="my-1"><strong>Aircraft:</strong> {p.vehicleModel}</p>
                    <p className="my-1"><strong>Flight Hours:</strong> {p.experienceValue} hrs</p>
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div className="bg-green-50 p-5 rounded-xl mt-6 border-l-4 border-green-500">
                    <h4 className="m-0 mb-2 text-green-800 text-[0.9rem] uppercase">Infantry/Naval Specialization</h4>
                    <p className="my-1"><strong>Military Role:</strong> {i.specialization}</p>
                </div>
            );
        }
        if (veteran.$type === 'navy') {
            const n = veteran as Navy;
            return (
                <div className="bg-blue-50 p-5 rounded-xl mt-6 border-l-4 border-blue-500">
                    <h4 className="m-0 mb-2 text-blue-800 text-[0.9rem] uppercase">Naval Specialization</h4>
                    <p className="my-1"><strong>Military Role:</strong> {n.specialization}</p>
                </div>
            );
        }
        return null;
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
                            <div className="inline-flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full text-slate-600 font-semibold text-[0.85rem] mb-4">
                                {getBranchIcon()}
                                {getBranchName()}
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