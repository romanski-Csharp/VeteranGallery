import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, Users, Anchor, Crosshair, HelpCircle, Trash2 } from 'lucide-react';
import { getVeteranById, deleteVeteran } from '../api/apiClient';
import { MilitaryBranch } from '../types/veteran';
import type { Veteran, Pilot, Infantryman, DroneOperator } from '../types/veteran';

const VeteranDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [veteran, setVeteran] = useState<Veteran | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVeteran = async () => {
            if (!id) return;
            try {
                const data = await getVeteranById(id);
                setVeteran(data);
            } catch (err) {
                console.error("Error fetching veteran details:", err);
                setError("Failed to load hero details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchVeteran();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this hero's profile?");
        if (!confirmDelete) return;

        try {
            await deleteVeteran(id);
            navigate('/'); 
        } catch (err) {
            console.error("Failed to delete profile", err);
            alert("Error: Could not delete the profile.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading hero profile...</div>;
    }

    if (error || !veteran) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{error || "Hero profile not found."}</p>
                <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft className="w-4 h-4" /> Back to Gallery
                </Link>
            </div>
        );
    }

    const getBranchIcon = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces: return <Users className="w-6 h-6" />;
            case MilitaryBranch.AirForce: return <Plane className="w-6 h-6" />;
            case MilitaryBranch.AirAssault: return <Crosshair className="w-6 h-6" />;
            case MilitaryBranch.Navy: return <Anchor className="w-6 h-6" />;
            default: return <HelpCircle className="w-6 h-6" />;
        }
    };

    const getBranchName = () => {
        switch (veteran.branch) {
            case MilitaryBranch.LandForces: return "Land Forces";
            case MilitaryBranch.AirForce: return "Air Force";
            case MilitaryBranch.AirAssault: return "Air Assault Forces";
            case MilitaryBranch.Navy: return "Navy";
            default: return "Armed Forces of Ukraine";
        }
    };

    const renderSpecializedDetails = () => {
        if (veteran.$type === 'pilot') {
            const p = veteran as Pilot;
            return (
                <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '8px', marginTop: '1rem', borderLeft: '4px solid #3b82f6' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>Aviation Combat Record</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>Aircraft Model:</strong> {p.vehicleModel}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Total Flight Hours:</strong> {p.experienceValue} hours</p>
                </div>
            );
        }
        if (veteran.$type === 'infantry') {
            const i = veteran as Infantryman;
            return (
                <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginTop: '1rem', borderLeft: '4px solid #22c55e' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>Infantry Specialization</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>Military Role:</strong> {i.specialization}</p>
                </div>
            );
        }
        if (veteran.$type === 'drone_op') {
            const d = veteran as DroneOperator;
            return (
                <div style={{ backgroundColor: '#faf5ff', padding: '1rem', borderRadius: '8px', marginTop: '1rem', borderLeft: '4px solid #a855f7' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b21a8' }}>UAV Operator Record</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>Unmanned System:</strong> {d.vehicleModel}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Combat Sorties:</strong> {d.experienceValue}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#475569', textDecoration: 'none', fontWeight: '500' }}>
                    <ArrowLeft className="w-5 h-5" /> Back to Gallery
                </Link>

                <button
                    onClick={handleDelete}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', background: '#fee2e2', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                    <Trash2 className="w-4 h-4" /> Delete Profile
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '400px', background: '#e2e8f0' }}>
                    <img
                        src={veteran.photoUrl || '/default-hero.png'}
                        alt={veteran.fullName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/default-hero.png'; }}
                    />
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>{veteran.fullName}</h2>
                        <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '50%' }}>
                            {getBranchIcon()}
                        </div>
                    </div>

                    <p style={{ margin: '0.5rem 0 1.5rem 0', color: '#64748b', fontWeight: '500', fontSize: '1.1rem' }}>
                        {veteran.rank} • {veteran.unitName} • <span style={{ color: '#334155' }}>{getBranchName()}</span>
                    </p>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '0.75rem' }}>Combat Story & Legacy</h3>
                        <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{veteran.story}</p>
                    </div>

                    {renderSpecializedDetails()}
                </div>
            </div>
        </div>
    );
};

export default VeteranDetails;