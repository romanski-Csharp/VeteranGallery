import { useEffect, useState } from 'react';
import Header from './components/Header';
import VeteranCard from './components/VeteranCard';
import { getVeterans } from './api/apiClient';
import { MilitaryBranch } from './types/veteran';
import type { Veteran } from './types/veteran';
import AddVeteranForm from './components/AddVeteranForm';

function App() {
    const [allVeterans, setAllVeterans] = useState<Veteran[]>([]); 
    const [filteredVeterans, setFilteredVeterans] = useState<Veteran[]>([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getVeterans();
                setAllVeterans(data);
                setFilteredVeterans(data);
            } catch (error) {
                console.error("Помилка завантаження:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleFilterChange = (branch: number | null) => {
        if (branch === null) {
            setFilteredVeterans(allVeterans);
        } else {
            setFilteredVeterans(allVeterans.filter(v => v.branch === branch));
        }
    };

    const refreshList = async () => {
        const data = await getVeterans();
        setAllVeterans(data);
        setFilteredVeterans(data);
    };

    return (
        <div className="app-container">
            {}
            <Header onFilterChange={handleFilterChange} />

            <main className="gallery-container">
                <AddVeteranForm onSuccess={refreshList} />
                {loading ? (
                    <div className="loading">Завантаження героїв...</div>
                ) : (
                    <div className="veteran-grid">
                        {filteredVeterans.map(v => (
                            <VeteranCard key={v.id} veteran={v} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;