import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Users, Anchor, Crosshair, HelpCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { getVeteranById, deleteVeteran } from '../api/apiClient';
import { MilitaryBranch } from '../types/veteran';
import AddVeteranForm from '../components/AddVeteranForm'; 
import type { Veteran, Pilot, Infantryman } from '../types/veteran';

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

    const getBranchIcon = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces: return <Users className="w-5 h-5" />;
            case MilitaryBranch.AirForce: return <Plane className="w-5 h-5" />;
            case MilitaryBranch.AirAssault: return <Crosshair className="w-5 h-5" />;
            case MilitaryBranch.Navy: return <Anchor className="w-5 h-5" />;
            default: return <HelpCircle className="w-5 h-5" />;
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
                <div style={{ backgroundColor: '#eff6ff', padding: '1.25rem', borderRadius: '12px', marginTop: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '0.9rem', textTransform: 'uppercase' }}>Aviation Record</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>Aircraft:</strong> {p.vehicleModel}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Flight Hours:</strong> {p.experienceValue} hrs</p>
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div style={{ backgroundColor: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', marginTop: '1.5rem', borderLeft: '4px solid #22c55e' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '0.9rem', textTransform: 'uppercase' }}>Infantry Specialization</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>Military Role:</strong> {i.specialization}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
            onClick={handleClose}
        >
            <div
                style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '850px', maxHeight: '90vh', display: 'flex', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative', animation: 'modalFadeIn 0.3s ease-out forwards' }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#0f172a' }}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{ background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#0f172a' }}
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <>
                            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setShowMenu(false)} />
                            <div style={{ position: 'absolute', top: '48px', right: 0, background: 'white', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', minWidth: '160px', zIndex: 20, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button
                                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                                >
                                    <Edit2 className="w-4 h-4" /> Edit Profile
                                </button>
                                <button
                                    onClick={handleDelete}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem', color: '#dc2626', fontWeight: '600' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fee2e2'}
                                    onMouseOut={e => e.currentTarget.style.background = 'none'}
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Profile
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div style={{ width: '42%', flexShrink: 0, backgroundColor: '#1e293b' }}>
                    <img
                        src={veteran.photoUrl || '/default-hero.png'}
                        alt={veteran.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/default-hero.png'; }}
                    />
                </div>

                <div style={{ flex: '1', padding: '3rem 2.5rem', overflowY: 'auto' }}>
                    {isEditing ? (
                        <AddVeteranForm
                            veteranToEdit={veteran}
                            onSuccess={handleUpdateSuccess}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', color: '#475569', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                {getBranchIcon()}
                                {getBranchName()}
                            </div>

                            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: '#0f172a', lineHeight: '1.1' }}>{veteran.fullName}</h2>
                            <p style={{ margin: '0 0 2rem 0', color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
                                {veteran.rank} • {veteran.unitName}
                            </p>

                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '1rem', fontWeight: '700' }}>Combat Story & Legacy</h3>
                                <p style={{ color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '1rem' }}>{veteran.story}</p>
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
                `}
            </style>
        </div>
    );
};

export default VeteranDetails;