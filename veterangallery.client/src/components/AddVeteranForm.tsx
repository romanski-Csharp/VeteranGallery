import { useState } from 'react';
import { MilitaryBranch } from '../types/veteran';
import { apiClient } from '../api/apiClient';

interface Props {
    onSuccess: () => void;
}

const AddVeteranForm = ({ onSuccess }: Props) => {
    const [fullName, setFullName] = useState('');
    const [rank, setRank] = useState('');
    const [unitName, setUnitName] = useState('');
    const [story, setStory] = useState('');
    const [branch, setBranch] = useState<number>(MilitaryBranch.LandForces);
    const [photoUrl, setPhotoUrl] = useState('');

    const [specialization, setSpecialization] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [experience, setExperience] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let newVeteran: any;
        if (branch === MilitaryBranch.AirForce) {
            newVeteran = {
                $type: 'pilot',
                fullName, rank, unitName, story, branch, photoUrl,
                vehicleModel, experienceValue: experience
            };
        } else {
            newVeteran = {
                $type: 'infantry',
                fullName, rank, unitName, story, branch, photoUrl,
                specialization
            };
        }

        try {
            await apiClient.post('/veterans', newVeteran);
            onSuccess();
            alert('Hero profile successfully created!');
        } catch (error) {
            console.error('Error adding veteran:', error);
            alert('Failed to save the profile. Please check connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        fontSize: '0.95rem',
        color: '#0f172a',
        backgroundColor: '#fff',
        outline: 'none',
        boxSizing: 'border-box' as const,
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.target.style.borderColor = '#2563eb';
        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.target.style.borderColor = '#cbd5e1';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                    Create Hero Profile
                </h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                    Fill out the form below to add a new veteran record to the public gallery.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        1. Personal Profile
                    </h3>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input required placeholder="e.g. Dmytro Kotsiubailo" style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                </div>
                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        2. Military Service
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Military Rank</label>
                            <input required placeholder="e.g. Lieutenant" style={inputStyle} value={rank} onChange={e => setRank(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                        <div>
                            <label style={labelStyle}>Military Unit</label>
                            <input required placeholder="e.g. 1st Separate Assault Battalion" style={inputStyle} value={unitName} onChange={e => setUnitName(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        3. Classification & Media
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Military Branch</label>
                            <select style={inputStyle} value={branch} onChange={e => setBranch(Number(e.target.value))} onFocus={handleFocus} onBlur={handleBlur}>
                                <option value={MilitaryBranch.LandForces}>Land Forces</option>
                                <option value={MilitaryBranch.AirForce}>Air Force</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Image URL</label>
                            <input placeholder="Direct link to image (optional)" style={inputStyle} value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
                        Specialized Deployment Metrics
                    </h4>

                    {branch === MilitaryBranch.AirForce ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Aircraft Model</label>
                                <input required placeholder="e.g. MiG-29 / F-16" style={inputStyle} value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Logged Flight Hours</label>
                                <input required type="number" min="0" style={inputStyle} value={experience} onChange={e => setExperience(Number(e.target.value))} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label style={labelStyle}>Infantry Specialization</label>
                            <input required placeholder="e.g. Reconnaissance Scout / Sniper" style={inputStyle} value={specialization} onChange={e => setSpecialization(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    )}
                </div>
                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                        4. Combat Story & Biography
                    </h3>
                    <div>
                        <label style={labelStyle}>Service Narrative</label>
                        <textarea required placeholder="Describe combat legacy, heroics, and historical impact..." style={{ ...inputStyle, height: '120px', resize: 'vertical' }} value={story} onChange={e => setStory(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <button type="submit" disabled={isSubmitting} style={{
                        width: '100%',
                        backgroundColor: isSubmitting ? '#94a3b8' : '#0f172a',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.15)',
                        transition: 'background-color 0.2s'
                    }}
                        onMouseOver={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#1e293b'; }}
                        onMouseOut={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#0f172a'; }}
                    >
                        {isSubmitting ? 'Saving Profile...' : 'Publish Hero Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVeteranForm;