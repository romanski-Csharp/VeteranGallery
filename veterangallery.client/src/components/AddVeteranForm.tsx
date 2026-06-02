import { useState } from 'react';
import { submitProposal, addVeteranDirect, updateVeteran } from '../api/apiClient';
import { MilitaryBranch, MilitaryRank, getRankDisplayName } from '../types/veteran';
import { CustomSelect } from './CustomSelect';

interface Props {
    onSuccess: () => void;
    veteranToEdit?: any;
    onCancel?: () => void;
}

// ── Subtype options per branch ─────────────────────────────────────────────────
const subtypesByBranch: Record<number, { label: string; value: string }[]> = {
    [MilitaryBranch.LandForces]: [
        { label: 'Infantryman', value: 'infantry' },
        { label: 'Artillery Specialist', value: 'artillery' },
        { label: 'Tank Crewman', value: 'tank_crew' },
    ],
    [MilitaryBranch.AirForce]: [
        { label: 'Pilot', value: 'pilot' },
        { label: 'Air Defense Operator', value: 'air_defense' },
        { label: 'Flight Navigator', value: 'navigator' },
    ],
    [MilitaryBranch.AirAssault]: [
        { label: 'Drone Operator', value: 'drone_op' },
        { label: 'Paratrooper', value: 'paratrooper' },
        { label: 'Air Assault Sapper', value: 'assault_sapper' },
    ],
    [MilitaryBranch.Navy]: [
        { label: 'Navy Sailor', value: 'navy' },
        { label: 'Combat Diver', value: 'combat_diver' },
        { label: 'Naval Artillerist', value: 'naval_artillery' },
    ],
    [MilitaryBranch.SpecialOps]: [
        { label: 'Special Forces Soldier', value: 'special_ops' },
        { label: 'Sniper', value: 'sniper' },
        { label: 'Intelligence Officer', value: 'spec_intel' },
    ],
};

const defaultSubtype = (branch: number): string =>
    subtypesByBranch[branch]?.[0]?.value ?? 'infantry';

const AddVeteranForm = ({ onSuccess, veteranToEdit, onCancel }: Props) => {
    const isEditMode = !!veteranToEdit;
    const isAdmin = !!localStorage.getItem('adminToken');

    const [fullName, setFullName] = useState(veteranToEdit?.fullName || '');
    const [rank, setRank] = useState<MilitaryRank>(veteranToEdit?.rank ?? MilitaryRank.SoldierOrSailor);
    const [unitName, setUnitName] = useState(veteranToEdit?.unitName || '');
    const [story, setStory] = useState(veteranToEdit?.story || '');
    const [branch, setBranch] = useState<MilitaryBranch>(veteranToEdit?.branch ?? MilitaryBranch.LandForces);
    const [photoUrl, setPhotoUrl] = useState(veteranToEdit?.photoUrl || '');

    // Subtype within the branch (replaces old "branch => type" implicit mapping)
    const [subtype, setSubtype] = useState<string>(
        veteranToEdit?.$type ?? defaultSubtype(veteranToEdit?.branch ?? MilitaryBranch.LandForces)
    );

    // ── Branch-level fields ───────────────────────────────────────────────────
    // Air Force branch
    const [totalFlightHours, setTotalFlightHours] = useState<number>(veteranToEdit?.totalFlightHours || 0);
    const [airBase, setAirBase] = useState(veteranToEdit?.airBase || '');
    const [hasCombatMissions, setHasCombatMissions] = useState<boolean>(veteranToEdit?.hasCombatMissions ?? false);

    // Land Forces branch
    const [primaryWeapon, setPrimaryWeapon] = useState(veteranToEdit?.primaryWeapon || '');
    const [combatDeployments, setCombatDeployments] = useState<number>(veteranToEdit?.combatDeployments || 0);
    const [areaOfOperations, setAreaOfOperations] = useState(veteranToEdit?.areaOfOperations || '');

    // Navy branch
    const [vesselName, setVesselName] = useState(veteranToEdit?.vesselName || '');
    const [vesselType, setVesselType] = useState(veteranToEdit?.vesselType || '');
    const [totalSeaDays, setTotalSeaDays] = useState<number>(veteranToEdit?.totalSeaDays || 0);

    // Air Assault branch
    const [totalOperationHours, setTotalOperationHours] = useState<number>(veteranToEdit?.totalOperationHours || 0);
    const [primaryTheatre, setPrimaryTheatre] = useState(veteranToEdit?.primaryTheatre || '');

    // ── Specialized fields (subtype-level) ───────────────────────────────────
    const [specialization, setSpecialization] = useState(veteranToEdit?.specialization || '');
    const [vehicleModel, setVehicleModel] = useState(veteranToEdit?.vehicleModel || '');
    const [experience, setExperience] = useState<number>(veteranToEdit?.experienceValue || 0);

    // Land Forces subtype extras
    const [weaponSystem, setWeaponSystem] = useState(veteranToEdit?.weaponSystem || '');
    const [maxRangeKm, setMaxRangeKm] = useState<number>(veteranToEdit?.maxRangeKm || 0);
    const [crewPosition, setCrewPosition] = useState(veteranToEdit?.crewPosition || '');

    // Air Force subtype extras
    const [systemType, setSystemType] = useState(veteranToEdit?.systemType || '');
    const [confirmedInterceptions, setConfirmedInterceptions] = useState<number>(veteranToEdit?.confirmedInterceptions || 0);
    const [navigationSystem, setNavigationSystem] = useState(veteranToEdit?.navigationSystem || '');
    const [sortieCount, setSortieCount] = useState<number>(veteranToEdit?.sortieCount || 0);

    // Air Assault subtype extras
    const [totalJumps, setTotalJumps] = useState<number>(veteranToEdit?.totalJumps || 0);
    const [parachuteType, setParachuteType] = useState(veteranToEdit?.parachuteType || '');
    const [minesCleared, setMinesCleared] = useState<number>(veteranToEdit?.minesCleared || 0);
    const [sapperQualification, setSapperQualification] = useState(veteranToEdit?.sapperQualification || '');

    // Navy subtype extras
    const [coastalSystem, setCoastalSystem] = useState(veteranToEdit?.coastalSystem || '');
    const [coastalSector, setCoastalSector] = useState(veteranToEdit?.coastalSector || '');
    const [divingDepthRating, setDivingDepthRating] = useState<number>(veteranToEdit?.divingDepthRating || 0);
    const [underwaterMissions, setUnderwaterMissions] = useState<number>(veteranToEdit?.underwaterMissions || 0);

    // Special Ops subtype extras
    const [specialUnit, setSpecialUnit] = useState(veteranToEdit?.specialUnit || '');
    const [missionType, setMissionType] = useState(veteranToEdit?.missionType || '');
    const [isClassified, setIsClassified] = useState<boolean>(veteranToEdit?.isClassified ?? false);
    const [maxEffectiveRange, setMaxEffectiveRange] = useState<number>(veteranToEdit?.maxEffectiveRange || 0);
    const [rifleModel, setRifleModel] = useState(veteranToEdit?.rifleModel || '');
    const [intelSpecialty, setIntelSpecialty] = useState(veteranToEdit?.intelSpecialty || '');
    const [fieldOperations, setFieldOperations] = useState<number>(veteranToEdit?.fieldOperations || 0);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBranchChange = (val: MilitaryBranch) => {
        setBranch(val);
        setSubtype(defaultSubtype(val));
    };

    const hasUnsavedChanges = () => {
        if (!isEditMode) return true;
        return (
            fullName !== veteranToEdit.fullName ||
            rank !== veteranToEdit.rank ||
            unitName !== veteranToEdit.unitName ||
            story !== veteranToEdit.story ||
            branch !== veteranToEdit.branch ||
            photoUrl !== veteranToEdit.photoUrl ||
            subtype !== veteranToEdit.$type
        );
    };

    const handleCancelClick = () => {
        if (hasUnsavedChanges()) {
            const confirmExit = window.confirm('You have unsaved changes. Do you want to discard them?');
            if (!confirmExit) return;
        }
        if (onCancel) onCancel();
    };

    const buildPayload = () => {
        const base: Record<string, any> = {
            id: veteranToEdit?.id,
            fullName, rank, unitName, story, branch, photoUrl,
            $type: subtype,
        };

        // Include branch-level fields
        const branchFields: Record<number, Record<string, any>> = {
            [MilitaryBranch.AirForce]: { totalFlightHours, airBase, hasCombatMissions },
            [MilitaryBranch.LandForces]: { primaryWeapon, combatDeployments, areaOfOperations },
            [MilitaryBranch.Navy]: { vesselName, vesselType, totalSeaDays },
            [MilitaryBranch.AirAssault]: { totalOperationHours, primaryTheatre },
            [MilitaryBranch.SpecialOps]: { missionType, isClassified },
        };

        const withBranch = { ...base, ...branchFields[branch] };

        switch (subtype) {
            case 'infantry':  return { ...withBranch, specialization };
            case 'artillery': return { ...withBranch, weaponSystem, maxRangeKm };
            case 'tank_crew': return { ...withBranch, vehicleModel, crewPosition };
            case 'pilot':       return { ...withBranch, vehicleModel, experienceValue: experience };
            case 'air_defense': return { ...withBranch, systemType, confirmedInterceptions };
            case 'navigator':   return { ...withBranch, navigationSystem, sortieCount };
            case 'drone_op':       return { ...withBranch, vehicleModel, experienceValue: experience };
            case 'paratrooper':    return { ...withBranch, totalJumps, parachuteType };
            case 'assault_sapper': return { ...withBranch, minesCleared, sapperQualification };
            case 'navy':            return { ...withBranch, specialization };
            case 'combat_diver':    return { ...withBranch, divingDepthRating, underwaterMissions };
            case 'naval_artillery': return { ...withBranch, coastalSystem, coastalSector };
            case 'special_ops': return { ...withBranch, specialUnit };
            case 'sniper':      return { ...withBranch, rifleModel, maxEffectiveRange };
            case 'spec_intel':  return { ...withBranch, intelSpecialty, fieldOperations };
            default:            return withBranch;
        }
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
        const payload = buildPayload();

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
        value: val,
    }));

    const branchOptions = [
        { label: 'Land Forces', value: MilitaryBranch.LandForces },
        { label: 'Air Force', value: MilitaryBranch.AirForce },
        { label: 'Air Assault Forces', value: MilitaryBranch.AirAssault },
        { label: 'Navy', value: MilitaryBranch.Navy },
        { label: 'Special Operations Forces', value: MilitaryBranch.SpecialOps },
    ];

    const renderBranchFields = () => {
        const inputCls = 'w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200';
        const labelCls = 'block text-[0.85rem] font-semibold text-slate-600 mb-1.5';

        switch (branch) {
            case MilitaryBranch.AirForce:
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Air Base</label>
                            <input required className={inputCls} value={airBase} onChange={e => setAirBase(e.target.value)} placeholder="e.g. Vasylkiv, Starokostiantyniv" />
                        </div>
                        <div>
                            <label className={labelCls}>Total Flight Hours</label>
                            <input required type="number" min="0" className={inputCls} value={totalFlightHours} onChange={e => setTotalFlightHours(Number(e.target.value))} />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="checkbox" id="hasCombatMissions" checked={hasCombatMissions} onChange={e => setHasCombatMissions(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                            <label htmlFor="hasCombatMissions" className={labelCls + ' mb-0 cursor-pointer'}>Has Combat Missions</label>
                        </div>
                    </div>
                );
            case MilitaryBranch.LandForces:
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Primary Weapon</label>
                            <input required className={inputCls} value={primaryWeapon} onChange={e => setPrimaryWeapon(e.target.value)} placeholder="e.g. AK-74, M4A1" />
                        </div>
                        <div>
                            <label className={labelCls}>Area of Operations</label>
                            <input required className={inputCls} value={areaOfOperations} onChange={e => setAreaOfOperations(e.target.value)} placeholder="e.g. Bakhmut, Zaporizhzhia" />
                        </div>
                        <div>
                            <label className={labelCls}>Combat Deployments</label>
                            <input required type="number" min="0" className={inputCls} value={combatDeployments} onChange={e => setCombatDeployments(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case MilitaryBranch.Navy:
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Vessel Name</label>
                            <input required className={inputCls} value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="e.g. Hetman Ivan Mazepa" />
                        </div>
                        <div>
                            <label className={labelCls}>Vessel Type</label>
                            <input required className={inputCls} value={vesselType} onChange={e => setVesselType(e.target.value)} placeholder="e.g. Corvette, Patrol Boat" />
                        </div>
                        <div>
                            <label className={labelCls}>Total Sea Days</label>
                            <input required type="number" min="0" className={inputCls} value={totalSeaDays} onChange={e => setTotalSeaDays(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case MilitaryBranch.AirAssault:
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Primary Theatre</label>
                            <input required className={inputCls} value={primaryTheatre} onChange={e => setPrimaryTheatre(e.target.value)} placeholder="e.g. East, South" />
                        </div>
                        <div>
                            <label className={labelCls}>Total Operation Hours</label>
                            <input required type="number" min="0" className={inputCls} value={totalOperationHours} onChange={e => setTotalOperationHours(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case MilitaryBranch.SpecialOps:
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                        <div>
                            <label className={labelCls}>Mission Type</label>
                            <input required={!isClassified} className={inputCls} value={missionType} onChange={e => setMissionType(e.target.value)} disabled={isClassified} placeholder="e.g. Reconnaissance, VBSS" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="checkbox" id="isClassifiedBranch" checked={isClassified} onChange={e => setIsClassified(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                            <label htmlFor="isClassifiedBranch" className={labelCls + ' mb-0 cursor-pointer'}>Service details classified</label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderSpecializedFields = () => {
        const inputCls = 'w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200';
        const labelCls = 'block text-[0.85rem] font-semibold text-slate-600 mb-1.5';

        switch (subtype) {
            case 'infantry':
                return (
                    <div>
                        <label className={labelCls}>Infantry Specialization</label>
                        <input required className={inputCls} value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Assault, Mortar, Anti-tank" />
                    </div>
                );
            case 'artillery':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Weapon System</label>
                            <input required className={inputCls} value={weaponSystem} onChange={e => setWeaponSystem(e.target.value)} placeholder="e.g. M777, 2S1 Gvozdika, Caesar" />
                        </div>
                        <div>
                            <label className={labelCls}>Max Range (km)</label>
                            <input required type="number" min="0" className={inputCls} value={maxRangeKm} onChange={e => setMaxRangeKm(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'tank_crew':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Tank Model</label>
                            <input required className={inputCls} value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="e.g. T-64BV, Leopard 2A4" />
                        </div>
                        <div>
                            <label className={labelCls}>Crew Position</label>
                            <input required className={inputCls} value={crewPosition} onChange={e => setCrewPosition(e.target.value)} placeholder="e.g. Commander, Gunner, Driver" />
                        </div>
                    </div>
                );
            case 'pilot':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Aircraft Model</label>
                            <input required className={inputCls} value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="e.g. MiG-29, Su-25, F-16" />
                        </div>
                        <div>
                            <label className={labelCls}>Flight Hours</label>
                            <input required type="number" min="0" className={inputCls} value={experience} onChange={e => setExperience(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'air_defense':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Air Defense System</label>
                            <input required className={inputCls} value={systemType} onChange={e => setSystemType(e.target.value)} placeholder="e.g. NASAMS, IRIS-T, Patriot" />
                        </div>
                        <div>
                            <label className={labelCls}>Confirmed Interceptions</label>
                            <input required type="number" min="0" className={inputCls} value={confirmedInterceptions} onChange={e => setConfirmedInterceptions(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'navigator':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Navigation System</label>
                            <input required className={inputCls} value={navigationSystem} onChange={e => setNavigationSystem(e.target.value)} placeholder="e.g. INS/GPS, Terrain-following" />
                        </div>
                        <div>
                            <label className={labelCls}>Combat Sorties</label>
                            <input required type="number" min="0" className={inputCls} value={sortieCount} onChange={e => setSortieCount(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'drone_op':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Drone Model</label>
                            <input required className={inputCls} value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} placeholder="e.g. Mavic 3T, Leleka-100" />
                        </div>
                        <div>
                            <label className={labelCls}>Sorties</label>
                            <input required type="number" min="0" className={inputCls} value={experience} onChange={e => setExperience(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'paratrooper':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Total Jumps</label>
                            <input required type="number" min="0" className={inputCls} value={totalJumps} onChange={e => setTotalJumps(Number(e.target.value))} />
                        </div>
                        <div>
                            <label className={labelCls}>Parachute System</label>
                            <input required className={inputCls} value={parachuteType} onChange={e => setParachuteType(e.target.value)} placeholder="e.g. D-10, MC-4 RAM Air" />
                        </div>
                    </div>
                );
            case 'assault_sapper':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Sapper Qualification</label>
                            <input required className={inputCls} value={sapperQualification} onChange={e => setSapperQualification(e.target.value)} placeholder="e.g. EOD Specialist, Mine Clearance" />
                        </div>
                        <div>
                            <label className={labelCls}>Objects Demined</label>
                            <input required type="number" min="0" className={inputCls} value={minesCleared} onChange={e => setMinesCleared(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'navy':
                return (
                    <div>
                        <label className={labelCls}>Naval Specialization</label>
                        <input required className={inputCls} value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="e.g. Deck Officer, Engineering, Torpedo" />
                    </div>
                );
            case 'combat_diver':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Max Diving Depth (m)</label>
                            <input required type="number" min="0" className={inputCls} value={divingDepthRating} onChange={e => setDivingDepthRating(Number(e.target.value))} />
                        </div>
                        <div>
                            <label className={labelCls}>Underwater Missions</label>
                            <input required type="number" min="0" className={inputCls} value={underwaterMissions} onChange={e => setUnderwaterMissions(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'naval_artillery':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Coastal System</label>
                            <input required className={inputCls} value={coastalSystem} onChange={e => setCoastalSystem(e.target.value)} placeholder="e.g. Neptune, Harpoon" />
                        </div>
                        <div>
                            <label className={labelCls}>Coastal Sector</label>
                            <input required className={inputCls} value={coastalSector} onChange={e => setCoastalSector(e.target.value)} placeholder="e.g. Black Sea, Azov" />
                        </div>
                    </div>
                );
            case 'special_ops':
                return (
                    <div>
                        <label className={labelCls}>Special Unit</label>
                        <input required className={inputCls} value={specialUnit} onChange={e => setSpecialUnit(e.target.value)} placeholder="e.g. 3rd Special Purpose Rgt" />
                    </div>
                );
            case 'sniper':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Rifle Model</label>
                            <input required className={inputCls} value={rifleModel} onChange={e => setRifleModel(e.target.value)} placeholder="e.g. UAR-10, Barrett M82" />
                        </div>
                        <div>
                            <label className={labelCls}>Max Effective Range (m)</label>
                            <input required type="number" min="0" className={inputCls} value={maxEffectiveRange} onChange={e => setMaxEffectiveRange(Number(e.target.value))} />
                        </div>
                    </div>
                );
            case 'spec_intel':
                return (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
                        <div>
                            <label className={labelCls}>Intelligence Specialty</label>
                            <input required={!isClassified} className={inputCls} value={intelSpecialty} onChange={e => setIntelSpecialty(e.target.value)} disabled={isClassified} placeholder="e.g. HUMINT, SIGINT, OSINT, Cyber" />
                        </div>
                        <div>
                            <label className={labelCls}>Field Operations</label>
                            <input required type="number" min="0" className={inputCls} value={fieldOperations} onChange={e => setFieldOperations(Number(e.target.value))} />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

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
                            <CustomSelect value={branch} onChange={(val) => handleBranchChange(val)} options={branchOptions} disabled={isEditMode} />
                        </div>
                        <div>
                            <label className="block text-[0.85rem] font-semibold text-slate-600 mb-1.5">Image URL</label>
                            <input className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-[0.95rem] text-slate-900 bg-white outline-none box-border focus:border-blue-600 focus:ring-3 focus:ring-blue-600/15 transition-all duration-200" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="m-0 text-[0.85rem] font-bold text-slate-600">Specialized Profile Metrics</h4>
                        <div className="min-w-[220px]">
                            <CustomSelect
                                value={subtype}
                                onChange={(val) => setSubtype(val)}
                                options={subtypesByBranch[branch] ?? []}
                                disabled={isEditMode}
                            />
                        </div>
                    </div>
                    {renderBranchFields()}
                    {renderSpecializedFields()}
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