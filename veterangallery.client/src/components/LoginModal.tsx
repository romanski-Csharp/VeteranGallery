import { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { loginAdmin } from '../api/apiClient';

interface Props {
    onClose: () => void;
}

export const LoginModal = ({ onClose }: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await loginAdmin({ username, password });
            window.location.reload();
        } catch (err) {
            setError('Invalid credentials.');
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X className="w-5 h-5" />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <ShieldAlert className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Commander Access</h2>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {error && <div style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center', background: '#fee2e2', padding: '8px', borderRadius: '8px' }}>{error}</div>}
                    <input required type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                    <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                    <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        {isLoading ? 'Authenticating...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
};