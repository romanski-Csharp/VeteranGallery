import { useState } from 'react';
import { ShieldAlert, X, Eye, EyeOff } from 'lucide-react';
import { loginAdmin } from '../api/apiClient';

interface Props {
    onClose: () => void;
}

export const LoginModal = ({ onClose }: Props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="fixed inset-0 z-[1000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
            <div className="bg-white p-10 rounded-2xl w-full max-w-[400px] relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-slate-500 hover:text-slate-700 transition-colors">
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <ShieldAlert size={48} className="block mx-auto mb-4 text-slate-800" />
                    <h2 className="text-2xl font-extrabold text-slate-900 m-0">Commander Access</h2>
                </div>

                <form onSubmit={handleLogin}>
                    {error && <div className="text-red-600 text-[0.85rem] text-center bg-red-100 p-2 rounded-lg mb-4">{error}</div>}

                    <input required type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none box-border mb-4 focus:border-slate-500 transition-colors"
                    />

                    <div className="relative mb-6">
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg outline-none box-border focus:border-slate-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full py-3 bg-slate-900 text-white border-none rounded-lg font-semibold cursor-pointer box-border hover:bg-slate-800 disabled:bg-slate-400 transition-colors">
                        {isLoading ? 'Authenticating...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
};