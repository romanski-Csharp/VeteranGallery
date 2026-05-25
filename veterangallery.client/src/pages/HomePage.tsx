import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, SearchX, Activity } from 'lucide-react';
import Header from '../components/Header';
import VeteranCard from '../components/VeteranCard';
import { getVeterans } from '../api/apiClient';
import type { Veteran } from '../types/veteran';

const HomePage = () => {
    const [veterans, setVeterans] = useState<Veteran[]>([]);

    const [activeBranch, setActiveBranch] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');

    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('System Online');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setStatusMessage('Fetching data from server...');
            try {
                const data = await getVeterans(searchQuery, activeBranch, sortBy);
                setVeterans(data);
                setStatusMessage('Data synchronized');
            } catch (error) {
                console.error("Loading error:", error);
                setStatusMessage('Error: Cannot connect to server');
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(() => { loadData(); }, 300);
        return () => clearTimeout(delay);

    }, [activeBranch, searchQuery, sortBy]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', paddingBottom: '40px' }}>
            <Header
                onFilterChange={setActiveBranch}
                onSearchChange={setSearchQuery}
                onSortChange={setSortBy}
            />

            <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/add-veteran" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '9999px', textDecoration: 'none', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <PlusCircle className="w-5 h-5" /> Add New Profile
                    </Link>
                </div>

                {loading && veterans.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b', fontWeight: '600' }}>Loading heroes...</div>
                ) : veterans.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b' }}>
                        <SearchX className="w-16 h-16" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                        <h3>No records found</h3>
                    </div>
                ) : (
                    <div
                        key={`${activeBranch}-${searchQuery}-${sortBy}`}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '2rem',
                            opacity: loading ? 0.4 : 1,
                            transition: 'opacity 0.2s ease-in-out'
                        }}
                    >
                        {veterans.map((v, index) => (
                            <div key={v.id} style={{ animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`, animationDelay: `${index * 0.05}s`, opacity: 0 }}>
                                <VeteranCard veteran={v} />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#0f172a', color: '#cbd5e1', padding: '8px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', zIndex: 100, boxShadow: '0 -4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity className="w-4 h-4" style={{ color: '#22c55e' }} />
                    <span style={{ fontWeight: '500', color: 'white' }}>Status:</span> {statusMessage}
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '500' }}>
                    <span>Total Profiles: <strong style={{ color: 'white' }}>{veterans.length}</strong></span>
                    <span style={{ borderLeft: '1px solid #334155', paddingLeft: '1.5rem' }}>Infantry: <strong style={{ color: 'white' }}>{veterans.filter(v => v.$type === 'infantry').length}</strong></span>
                    <span style={{ borderLeft: '1px solid #334155', paddingLeft: '1.5rem' }}>Aviation: <strong style={{ color: 'white' }}>{veterans.filter(v => v.$type === 'pilot').length}</strong></span>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;