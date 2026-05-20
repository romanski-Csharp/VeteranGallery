import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Header from '../components/Header';
import VeteranCard from '../components/VeteranCard';
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

    return (
        <div className="app-container">
            <Header onFilterChange={handleFilterChange} />

            <main className="gallery-container" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                        to="/add-veteran"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    >
                        <PlusCircle className="w-5 h-5" /> Add New Profile
                    </Link>
                </div>

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