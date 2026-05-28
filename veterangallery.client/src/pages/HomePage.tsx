import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, SearchX, Activity, CheckCircle, XCircle, Eye, X } from 'lucide-react';
import Header from '../components/Header';
import VeteranCard from '../components/VeteranCard';
import { getVeterans, getProposals, approveProposal, rejectProposal, getComparison } from '../api/apiClient';
import type { Veteran } from '../types/veteran';
import { getRankDisplayName } from '../types/veteran';

const HomePage = () => {
    const [veterans, setVeterans] = useState<Veteran[]>([]);
    const [gridKey, setGridKey] = useState(0);
    const [activeBranch, setActiveBranch] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('System Online');
    const isAdmin = !!localStorage.getItem('adminToken');
    const [activeTab, setActiveTab] = useState<'gallery' | 'pending'>('gallery');
    const [proposals, setProposals] = useState<any[]>([]);
    const [proposalsLoading, setProposalsLoading] = useState(false);
    const [viewingProposal, setViewingProposal] = useState<any>(null);

    useEffect(() => {
        if (activeTab === 'gallery') {
            const loadData = async () => {
                setLoading(true);
                setStatusMessage('Fetching data from server...');
                try {
                    const data = await getVeterans(searchQuery, activeBranch, sortBy);
                    setVeterans(data);
                    setGridKey(prev => prev + 1);
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
        }
    }, [activeBranch, searchQuery, sortBy, activeTab]);

    useEffect(() => {
        if (isAdmin && activeTab === 'pending') {
            fetchProposalsData();
        }
    }, [isAdmin, activeTab]);

    const fetchProposalsData = async () => {
        setProposalsLoading(true);
        try {
            const data = await getProposals(1);
            setProposals(data);
        } catch (err) {
            console.error(err);
        } finally {
            setProposalsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!window.confirm("Publish this to public gallery?")) return;
        await approveProposal(id);
        setViewingProposal(null);
        fetchProposalsData();
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Reject this proposal?")) return;
        await rejectProposal(id);
        setViewingProposal(null);
        fetchProposalsData();
    };

    const handleViewComparison = async (p: any) => {
        if (p.type === 2) { 
            const compData = await getComparison(p.id);
            setViewingProposal({ ...p, current: compData.current });
        } else {
            setViewingProposal(p);
        }
    };

    const getFieldStyle = (propVal: any, currVal: any, baseStyle: React.CSSProperties = {}) => {
        if (currVal !== undefined && propVal !== currVal) {
            return { ...baseStyle, backgroundColor: '#fef08a', padding: '2px 4px', borderRadius: '4px' };
        }
        return baseStyle;
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', paddingBottom: '40px' }}>
            <Header onFilterChange={setActiveBranch} onSearchChange={setSearchQuery} onSortChange={setSortBy} />

            <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem' }}>
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
                        <button onClick={() => setActiveTab('gallery')} style={{ background: 'none', border: 'none', padding: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', color: activeTab === 'gallery' ? '#0f172a' : '#94a3b8', borderBottom: activeTab === 'gallery' ? '3px solid #3b82f6' : '3px solid transparent' }}>
                            Public Gallery
                        </button>
                        <button onClick={() => setActiveTab('pending')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', padding: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', color: activeTab === 'pending' ? '#d97706' : '#94a3b8', borderBottom: activeTab === 'pending' ? '3px solid #d97706' : '3px solid transparent' }}>
                            Moderation Queue
                            <span style={{ background: activeTab === 'pending' ? '#fef3c7' : '#f1f5f9', color: activeTab === 'pending' ? '#b45309' : '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{proposals.length}</span>
                        </button>
                    </div>
                )}
                <div style={{ display: activeTab === 'gallery' ? 'block' : 'none' }}>
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
                        <div key={gridKey} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem', opacity: loading ? 0.4 : 1, transition: 'opacity 0.2s ease-in-out' }}>
                            {veterans.map((v, index) => (
                                <div key={v.id} style={{ animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`, animationDelay: `${index * 0.05}s`, opacity: 0 }}>
                                    <VeteranCard veteran={v} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ display: activeTab === 'pending' ? 'block' : 'none' }}>
                    {proposalsLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading queue...</div>
                    ) : proposals.length === 0 ? (
                        <div style={{ textAlign: 'center', background: 'white', padding: '4rem', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 style={{ color: '#475569', margin: 0 }}>Queue is empty</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>All profiles are up to date.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {proposals.map(p => (
                                <div key={p.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1e293b', flexShrink: 0 }}>
                                        <img src={p.proposedData.photoUrl || '/default-hero.png'} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.currentTarget.src = '/default-hero.png'} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', backgroundColor: p.type === 1 ? '#dcfce7' : '#e0e7ff', color: p.type === 1 ? '#166534' : '#3730a3', display: 'inline-block', marginBottom: '8px' }}>
                                            {p.type === 1 ? 'New Profile' : 'Profile Edit'}
                                        </span>
                                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#0f172a' }}>{p.proposedData.fullName}</h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{getRankDisplayName(p.proposedData.rank, p.proposedData.branch)} • {p.proposedData.unitName}</p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                                        <button onClick={() => handleViewComparison(p)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            <Eye className="w-4 h-4" /> View / Compare
                                        </button>
                                        <button onClick={() => handleApprove(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            <CheckCircle className="w-4 h-4" /> Approve
                                        </button>
                                        <button onClick={() => handleReject(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
            {viewingProposal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setViewingProposal(null)}>
                    <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '1050px', maxHeight: '90vh', display: 'flex', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }} onClick={e => e.stopPropagation()}>

                        <button onClick={() => setViewingProposal(null)} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#0f172a' }}>
                            <X className="w-5 h-5" />
                        </button>

                        <div style={{ width: '38%', flexShrink: 0, backgroundColor: '#1e293b' }}>
                            <img src={viewingProposal.proposedData.photoUrl || '/default-hero.png'} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/default-hero.png'; }} />
                        </div>

                        <div className="custom-scroll" style={{ flex: '1', padding: '3rem 2.5rem', overflowY: 'auto' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: viewingProposal.type === 1 ? '#dcfce7' : '#fef08a', padding: '6px 14px', borderRadius: '20px', color: viewingProposal.type === 1 ? '#166534' : '#854d0e', fontWeight: '600', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                {viewingProposal.type === 1 ? 'New Profile Preview' : 'Proposed Edits Comparison'}
                            </div>

                            {viewingProposal.type === 1 || !viewingProposal.current ? (
                                <>
                                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem', color: '#0f172a', lineHeight: '1.1' }}>{viewingProposal.proposedData.fullName}</h2>
                                    <p style={{ margin: '0 0 2rem 0', color: '#64748b', fontSize: '1.1rem', fontWeight: '500' }}>
                                        {getRankDisplayName(viewingProposal.proposedData.rank, viewingProposal.proposedData.branch)} • {viewingProposal.proposedData.unitName}
                                    </p>
                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '1rem', fontWeight: '700' }}>Combat Story & Legacy</h3>
                                        <p style={{ color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-line', fontSize: '1rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {viewingProposal.proposedData.story}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '1.5rem' }}>
                                        <h4 style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px', marginBottom: '1rem' }}>Current Database State</h4>
                                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#64748b' }}>{viewingProposal.current.fullName}</h2>
                                        <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                                            {getRankDisplayName(viewingProposal.current.rank, viewingProposal.current.branch)} • {viewingProposal.current.unitName}
                                        </p>
                                        <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '1rem' }}>
                                            <p style={{ color: '#64748b', lineHeight: '1.6', whiteSpace: 'pre-line', fontSize: '0.9rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                                {viewingProposal.current.story}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ color: '#ca8a04', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px', marginBottom: '1rem' }}>Proposed Changes</h4>
                                        <h2 style={getFieldStyle(viewingProposal.proposedData.fullName, viewingProposal.current.fullName, { margin: '0 0 0.5rem 0', fontSize: '1.5rem', color: '#0f172a' })}>
                                            {viewingProposal.proposedData.fullName}
                                        </h2>
                                        <p style={getFieldStyle(
                                            `${viewingProposal.proposedData.rank}-${viewingProposal.proposedData.unitName}`,
                                            `${viewingProposal.current.rank}-${viewingProposal.current.unitName}`,
                                            { margin: '0 0 1rem 0', color: '#0f172a', fontSize: '0.9rem', fontWeight: '600' }
                                        )}>
                                            {getRankDisplayName(viewingProposal.proposedData.rank, viewingProposal.proposedData.branch)} • {viewingProposal.proposedData.unitName}
                                        </p>
                                        <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '1rem' }}>
                                            <p style={getFieldStyle(viewingProposal.proposedData.story, viewingProposal.current.story, { color: '#0f172a', lineHeight: '1.6', whiteSpace: 'pre-line', fontSize: '0.9rem', wordBreak: 'break-word', overflowWrap: 'break-word' })}>
                                                {viewingProposal.proposedData.story}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                                <button onClick={() => handleApprove(viewingProposal.id)} style={{ padding: '12px 24px', background: '#22c55e', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle className="w-5 h-5" /> Approve & Publish
                                </button>
                                <button onClick={() => handleReject(viewingProposal.id)} style={{ padding: '12px 24px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <XCircle className="w-5 h-5" /> Reject Proposal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;