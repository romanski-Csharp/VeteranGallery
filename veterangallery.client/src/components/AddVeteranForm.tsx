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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let newVeteran: any = {
            fullName, rank, unitName, story, branch, photoUrl
        };

        if (branch === MilitaryBranch.AirForce) {
            newVeteran = { ...newVeteran, $type: 'pilot', vehicleModel, experienceValue: experience };
        } else if (branch === MilitaryBranch.LandForces) {
            newVeteran = { ...newVeteran, $type: 'infantry', specialization };
        } else {
            newVeteran = { ...newVeteran, $type: 'infantry', specialization: 'Загальна' };
        }

        try {
            await apiClient.post('/veterans', newVeteran);
            onSuccess(); 
            alert('Героя успішно додано!');
        } catch (error) {
            console.error('Помилка при додаванні', error);
            alert('Не вдалося додати ветерана.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Додати нового героя</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input required placeholder="ПІБ (напр. Іван Франко)" className="border p-2 rounded" value={fullName} onChange={e => setFullName(e.target.value)} />
                <input required placeholder="Звання (напр. Сержант)" className="border p-2 rounded" value={rank} onChange={e => setRank(e.target.value)} />
                <input required placeholder="Підрозділ (напр. 93-тя ОМБр)" className="border p-2 rounded" value={unitName} onChange={e => setUnitName(e.target.value)} />
                <input placeholder="URL фотографії (з інтернету)" className="border p-2 rounded" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} />

                <select className="border p-2 rounded" value={branch} onChange={e => setBranch(Number(e.target.value))}>
                    <option value={MilitaryBranch.LandForces}>Сухопутні війська</option>
                    <option value={MilitaryBranch.AirForce}>Повітряні сили</option>
                </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mb-4 border border-blue-100">
                <h3 className="font-semibold text-gray-700 mb-2">Специфічні дані:</h3>
                {branch === MilitaryBranch.AirForce ? (
                    <div className="flex gap-4">
                        <input required placeholder="Модель літака (напр. F-16)" className="border p-2 rounded w-full" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
                        <input required type="number" placeholder="Години нальоту" className="border p-2 rounded w-full" value={experience} onChange={e => setExperience(Number(e.target.value))} />
                    </div>
                ) : (
                    <div>
                        <input required placeholder="Спеціалізація (напр. Снайпер)" className="border p-2 rounded w-full" value={specialization} onChange={e => setSpecialization(e.target.value)} />
                    </div>
                )}
            </div>

            <textarea required placeholder="Коротка історія..." className="border p-2 rounded w-full h-24 mb-4" value={story} onChange={e => setStory(e.target.value)} />

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Зберегти в базу
            </button>
        </form>
    );
};

export default AddVeteranForm;