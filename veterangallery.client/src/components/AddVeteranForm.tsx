import { useState } from 'react';
import { submitProposal, addVeteranDirect, updateVeteran } from '../api/apiClient';
import { MilitaryBranch, MilitaryRank, getRankDisplayName } from '../types/veteran';
import { CustomSelect } from './CustomSelect';

interface Props {
    onSuccess: () => void;
    veteranToEdit?: any;
    onCancel?: () => void;
}

const AddVeteranForm = ({ onSuccess, veteranToEdit, onCancel }: Props) => {
    const isEditMode = !!veteranToEdit;
    const isAdmin = !!localStorage.getItem('adminToken');

    const [fullName, setFullName] = useState(veteranToEdit?.fullName || '');
    const [rank, setRank] = useState<MilitaryRank>(veteranToEdit?.rank ?? MilitaryRank.SoldierOrSailor);
    const [unitName, setUnitName] = useState(veteranToEdit?.unitName || '');
    const [story, setStory] = useState(veteranToEdit?.story || '');
    const [branch, setBranch] = useState<MilitaryBranch>(veteranToEdit?.branch ?? MilitaryBranch.LandForces);
    const [photoUrl, setPhotoUrl] = useState(veteranToEdit?.photoUrl || '');
    const [specialization, setSpecialization] = useState(veteranToEdit?.specialization || '');
    const [vehicleModel, setVehicleModel] = useState(veteranToEdit?.vehicleModel || '');
    const [experience, setExperience] = useState<number>(veteranToEdit?.experienceValue || 0);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasUnsavedChanges = () => {
        if (!isEditMode) {
            return fullName || rank !== MilitaryRank.SoldierOrSailor || unitName || story || photoUrl || specialization || vehicleModel || experience > 0;
        }
        const basicChanged = fullName !== veteranToEdit.fullName ||
            rank !== veteranToEdit.rank || unitName !== veteranToEdit.unitName ||
            story !== veteranToEdit.story || branch !== veteranToEdit.branch || photoUrl !== veteranToEdit.photoUrl;

        if (basicChanged) return true;

        if (branch === MilitaryBranch.AirForce || branch === MilitaryBranch.AirAssault) {
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

        if (photoUrl) {
            const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
            if (!urlRegex.test(photoUrl)) {
                alert('Invalid Image URL! Please enter a valid web address starting with http:// or https://');
                return;
            }
        }

        setIsSubmitting(true);

        let payload: any = {
            id: veteranToEdit?.id,
            fullName, rank, unitName, story, branch, photoUrl
        };

        if (branch === MilitaryBranch.AirForce) {
            payload = { ...payload, $type: 'pilot', vehicleModel, experienceValue: experience };
        } else if (branch === MilitaryBranch.AirAssault) {
            payload = { ...payload, $type: 'drone_op', vehicleModel, experienceValue: experience };
        } else if (branch === MilitaryBranch.Navy) {
            payload = { ...payload, $type: 'navy', specialization };
        } else {
            payload = { ...payload, $type: 'infantry', specialization };
        }

        try {
            if (isAdmin) {
                if (isEditMode) {
                    await updateVeteran(payload.id, payload);
                } else {
                    await addVeteranDirect(payload);
                }
                alert(isEditMode ? 'Profile updated instantly!' : 'Profile published instantly!');
            } else {
                await submitProposal(payload, isEditMode);
                alert(isEditMode
                    ? 'Thank you! Your proposed edits have been submitted for moderation.'
                    : 'Thank you! The hero profile has been submitted for moderation.'
                );
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to process the request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const rankOptions = (Object.values(MilitaryRank) as MilitaryRank[]).map(val => ({
        label: getRankDisplayName(val, branch),
        value: val
    }));

    const branchOptions = [
        { label: 'Land Forces', value: MilitaryBranch.LandForces },
        { label: 'Air Force', value: MilitaryBranch.AirForce },
        { label: 'Air Assault Forces', value: MilitaryBranch.AirAssault },
        { label: 'Navy', value: MilitaryBranch.Navy }
    ];

    return (
        <div className={`bg-white rounded-2xl ${isEditMode ? 'p-0' : 'p-10'}`}>
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="m-0 mb-1.5 text-[1.75rem] font-extrabold text-slate-900 tracking-[-0.5px]">
                        {isEditMode ? 'Edit Hero Profile' : 'Create Hero Profile'}
                    </h2>
                    <p className="m-0 text-[0.9rem] text-slate-500">
                        {isAdmin ? 'You are in Admin mode. Changes will be saved instantly.' : 'Fill out the form below. It will be reviewed by a moderator.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <h3 className="m-0 mb-4 text-[0.9rem] font-bold text-slate-800 uppercase border-b border-slate-100 pb-1.5">1. Identity</h3>
                    <div>
                        <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Full Name</label>
                        <input required className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                </div>

                <div>
                    <h3 className="m-0 mb-4 text-[0.9rem] font-bold text-slate-800 uppercase border-b border-slate-100 pb-1.5">2. Deployment</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                        <div>
                            <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Military Rank</label>
                            <CustomSelect value={rank} onChange={(val) => setRank(val)} options={rankOptions} />
                        </div>
                        <div>
                            <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Military Unit</label>
                            <input required className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={unitName} onChange={e => setUnitName(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="m-0 mb-4 text-[0.9rem] font-bold text-slate-800 uppercase border-b border-slate-100 pb-1.5">3. Media & Logistics</h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                        <div>
                            <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Military Branch</label>
                            <CustomSelect value={branch} onChange={(val) => setBranch(val)} options={branchOptions} disabled={isEditMode} />
                        </div>
                        <div>
                            <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Image URL</label>
                            <input className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-slate-200">
                    <h4 className="m-0 mb-3 text-[0.85rem] font-bold text-slate-600">Specialized Profile Metrics</h4>
                    {(branch === MilitaryBranch.AirForce || branch === MilitaryBranch.AirAssault) ? (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                            <div>
                                <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">
                                    {branch === MilitaryBranch.AirForce ? 'Aircraft Model' : 'Drone Model'}
                                </label>
                                <input required className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">
                                    {branch === MilitaryBranch.AirForce ? 'Flight Hours' : 'Sorties'}
                                </label>
                                <input required type="number" min="0" className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={experience} onChange={e => setExperience(Number(e.target.value))} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">
                                {branch === MilitaryBranch.Navy ? 'Naval Specialization' : 'Infantry Specialization'}
                            </label>
                            <input required className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={specialization} onChange={e => setSpecialization(e.target.value)} />
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="m-0 mb-4 text-[0.9rem] font-bold text-slate-800 uppercase border-b border-slate-100 pb-1.5">4. Historical Narrative</h3>
                    <div>
                        <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Service Narrative</label>
                        <textarea required className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200 h-[100px] resize-y" value={story} onChange={e => setStory(e.target.value)} />
                    </div>
                </div>

                <div className="flex gap-4 mt-4">
                    {isEditMode && (
                        <button type="button" onClick={handleCancelClick} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-colors">
                            Cancel
                        </button>
                    )}
                    <button type="submit" disabled={isSubmitting} className="flex-[2] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-3 border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-colors">
                        {isSubmitting ? 'Processing...' : (isAdmin ? (isEditMode ? 'Update Instantly' : 'Publish Instantly') : 'Submit for Review')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddVeteranForm;