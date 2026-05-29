import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Box, Lock, User } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-neutral">
            <div className="bg-bg-card p-10 rounded-card shadow-floating w-full max-w-md transform transition-all border border-border-main">
                <div className="text-center mb-8 flex flex-col items-center">
                    <div className="bg-accent-mint p-3 rounded-xl mb-4 text-primary">
                        <Box size={32} />
                    </div>
                    <h1 className="text-[28px] font-bold text-text-primary">SmartStock <span className="text-primary">Pro</span></h1>
                    <p className="text-text-secondary mt-2 text-[14px]">Enterprise Inventory Management</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-status-danger p-3 rounded-md mb-6 text-[13px] text-center font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="input-label flex items-center gap-2"><User size={16} className="text-text-muted" /> Username</label>
                        <input 
                            type="text" 
                            className="input-premium"
                            placeholder="e.g. admin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="input-label flex items-center gap-2"><Lock size={16} className="text-text-muted" /> Password</label>
                        <input 
                            type="password" 
                            className="input-premium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full mt-2"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-[12px] text-text-muted">
                    &copy; 2026 SmartStock Pro - Uji Kompetensi BNSP
                </div>
            </div>
        </div>
    );
}
