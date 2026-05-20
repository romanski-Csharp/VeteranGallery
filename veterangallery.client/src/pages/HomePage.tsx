import { useEffect, useState } from 'react';
import Header from '../components/Header';
import VeteranCard from '../components/VeteranCard';
import AddVeteranForm from '../components/AddVeteranForm';
import { getVeterans } from '../api/apiClient';
import type { Veteran } from '../types/veteran';

const HomePage = () => {
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
                console.error("Loading error:", error);
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
            <Header onFilterChange={handleFilterChange} />

            <main className="gallery-container" style={{ padding: '2rem' }}>
                <AddVeteranForm onSuccess={refreshList} />
                {loading ? (
                    <div className="loading" style={{ textAlign: 'center', marginTop: '2rem' }}>Loading heroes...</div>
                ) : (
                    <div className="veteran-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {filteredVeterans.map(v => (
                            <VeteranCard key={v.id} veteran={v} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;