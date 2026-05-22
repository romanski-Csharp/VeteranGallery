import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, RefreshCw, SearchX } from 'lucide-react';
import Header from '../components/Header';
import VeteranCard from '../components/VeteranCard';
import { getVeterans } from '../api/apiClient';
import type { Veteran, Pilot, Infantryman, DroneOperator } from '../types/veteran';

const HomePage = () => {
    const [allVeterans, setAllVeterans] = useState<Veteran[]>([]);
    const [filteredVeterans, setFilteredVeterans] = useState<Veteran[]>([]);

    const [activeBranch, setActiveBranch] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVeterans();
            setAllVeterans(data);
        } catch (error) {
            console.error("Loading error:", error);
            setError("Cannot connect to server. The backend might still be starting...");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let result = allVeterans;

        if (activeBranch !== null) {
            result = result.filter(v => v.branch === activeBranch);
        }

        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            result = result.filter(v => {
                const matchName = v.fullName.toLowerCase().includes(q);
                const matchUnit = v.unitName.toLowerCase().includes(q);
                const matchRank = v.rank.toLowerCase().includes(q);

                let matchSpecial = false;
                if (v.$type === 'pilot') {
                    matchSpecial = (v as Pilot).vehicleModel.toLowerCase().includes(q);
                } else if (v.$type === 'infantry') {
                    matchSpecial = (v as Infantryman).specialization.toLowerCase().includes(q);
                } else if (v.$type === 'drone_op') {
                    matchSpecial = (v as DroneOperator).vehicleModel.toLowerCase().includes(q);
                }

                return matchName || matchUnit || matchRank || matchSpecial;
            });
        }

        setFilteredVeterans(result);
    }, [allVeterans, activeBranch, searchQuery]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            <Header
                onFilterChange={setActiveBranch}
                onSearchChange={setSearchQuery}
            />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link
                        to="/add-veteran"
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            backgroundColor: '#0f172a', color: 'white', padding: '0.75rem 1.5rem',
                            borderRadius: '9999px', textDecoration: 'none', fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.2)', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <PlusCircle className="w-5 h-5" /> Add New Profile
                    </Link>
                </div>

                {error ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', border: '1px solid #fee2e2' }}>
                        <p style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
                        <button onClick={loadData} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b', fontWeight: '600', fontSize: '1.1rem' }}>
                        <div style={{ animation: 'fadeInUp 1s infinite alternate' }}>Loading heroes...</div>
                    </div>
                ) : filteredVeterans.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem 1rem', color: '#64748b', animation: 'fadeInUp 0.4s ease-out' }}>
                        <SearchX className="w-16 h-16" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                        <h3 style={{ fontSize: '1.25rem', color: '#334155', margin: '0 0 0.5rem 0' }}>No heroes found</h3>
                        <p style={{ margin: 0 }}>Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                        {filteredVeterans.map((v, index) => (
                            <div
                                key={v.id}
                                style={{
                                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                                    animationDelay: `${index * 0.05}s`,
                                    opacity: 0
                                }}
                            >
                                <VeteranCard veteran={v} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;