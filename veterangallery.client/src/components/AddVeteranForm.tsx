import { useState } from 'react';
import { MilitaryBranch } from '../types/veteran';
import { apiClient, updateVeteran } from '../api/apiClient';

interface Props {
    onSuccess: () => void;
    veteranToEdit?: any;
    onCancel?: () => void;
}

const AddVeteranForm = ({ onSuccess, veteranToEdit, onCancel }: Props) => {
    const isEditMode = !!veteranToEdit;

    const [fullName, setFullName] = useState(veteranToEdit?.fullName || '');
    const [rank, setRank] = useState(veteranToEdit?.rank || '');
    const [unitName, setUnitName] = useState(veteranToEdit?.unitName || '');
    const [story, setStory] = useState(veteranToEdit?.story || '');
    const [branch, setBranch] = useState<number>(veteranToEdit?.branch ?? MilitaryBranch.LandForces);
    const [photoUrl, setPhotoUrl] = useState(veteranToEdit?.photoUrl || '');

    const [specialization, setSpecialization] = useState(veteranToEdit?.$type === 'infantry' ? veteranToEdit.specialization : '');
    const [vehicleModel, setVehicleModel] = useState(veteranToEdit?.$type === 'pilot' ? veteranToEdit.vehicleModel : '');
    const [experience, setExperience] = useState<number>(veteranToEdit?.$type === 'pilot' ? veteranToEdit.experienceValue : 0);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasUnsavedChanges = () => {
        if (!isEditMode) {
            return fullName || rank || unitName || story || photoUrl || specialization || vehicleModel || experience > 0;
        }
        const basicChanged = fullName !== veteranToEdit.fullName ||
            rank !== veteranToEdit.rank ||
            unitName !== veteranToEdit.unitName ||
            story !== veteranToEdit.story ||
            branch !== veteranToEdit.branch ||
            photoUrl !== veteranToEdit.photoUrl;

        if (basicChanged) return true;

        if (branch === MilitaryBranch.AirForce) {
            return vehicleModel !== veteranToEdit.vehicleModel || experience !== veteranToEdit.experienceValue;
        } else {
            return specialization !== veteranToEdit.specialization;
        }
    };

    const handleCancelClick = () => {
        if (hasUnsavedChanges()) {
            const confirmExit = window.confirm("You have unsaved changes. Do you want to discard them?");
            if (!confirmExit) return;
        }
        if (onCancel) onCancel();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let payload: any = {
            id: veteranToEdit?.id,
            fullName, rank, unitName, story, branch, photoUrl
        };

        if (branch === MilitaryBranch.AirForce) {
            payload = { ...payload, $type: 'pilot', vehicleModel, experienceValue: experience };
        } else {
            payload = { ...payload, $type: 'infantry', specialization };
        }

        try {
            if (isEditMode) {
                await updateVeteran(veteranToEdit.id, payload);
                alert('Hero profile successfully updated!');
            } else {
                await apiClient.post('/veterans', payload);
                alert('Hero profile successfully created!');
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving veteran:', error);
            alert('Failed to save the profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' };
    const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.95rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box' as const, transition: 'all 0.2s' };

    const handleFocus = (e: any) => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)'; };
    const handleBlur = (e: any) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ background: 'white', padding: isEditMode ? '0' : '2.5rem', borderRadius: '16px' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
                        {isEditMode ? 'Edit Hero Profile' : 'Create Hero Profile'}
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                        {isEditMode ? 'Modify the existing metrics and narrative for this record.' : 'Fill out the form below to add a new veteran record.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>1. Identity</h3>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input required style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                </div>

                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>2. Deployment</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Military Rank</label>
                            <input required style={inputStyle} value={rank} onChange={e => setRank(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                        <div>
                            <label style={labelStyle}>Military Unit</label>
                            <input required style={inputStyle} value={unitName} onChange={e => setUnitName(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>3. Media & Logistics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Military Branch</label>
                            <select disabled={isEditMode} style={inputStyle} value={branch} onChange={e => setBranch(Number(e.target.value))} onFocus={handleFocus} onBlur={handleBlur}>
                                <option value={MilitaryBranch.LandForces}>Land Forces</option>
                                <option value={MilitaryBranch.AirForce}>Air Force</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Image URL</label>
                            <input style={inputStyle} value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Specialized Profile Metrics</h4>
                    {branch === MilitaryBranch.AirForce ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Aircraft Model</label>
                                <input required style={inputStyle} value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                                <label style={labelStyle}>Flight Hours</label>
                                <input required type="number" min="0" style={inputStyle} value={experience} onChange={e => setExperience(Number(e.target.value))} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label style={labelStyle}>Infantry Specialization</label>
                            <input required style={inputStyle} value={specialization} onChange={e => setSpecialization(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    )}
                </div>

                <div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>4. Historical Narrative</h3>
                    <div>
                        <label style={labelStyle}>Service Narrative</label>
                        <textarea required style={{ ...inputStyle, height: '100px', resize: 'vertical' }} value={story} onChange={e => setStory(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    {isEditMode && (
                        <button type="button" onClick={handleCancelClick} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#334155', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    )}
                    <button type="submit" disabled={isSubmitting} style={{ flex: 2, backgroundColor: '#0f172a', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}>
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Publish Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVeteranForm;