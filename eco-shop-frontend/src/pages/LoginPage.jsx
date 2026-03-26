import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) { navigate('/'); return null; }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await login(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally { setLoading(false); }
    };

    const fillDemo = (u, p) => setForm({ username: u, password: p });

    return (
        <div className="auth-page page">
            <div className="auth-container animate-in">
                <div className="auth-header">
                    <span className="auth-icon">🌿</span>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your sustainable journey</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input className="form-input" type="text" value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input className="form-input" type="password" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="forgot-password-link" style={{ textAlign: 'right', marginTop: '8px' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--green-700)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Forgot Password?
                    </Link>
                </div>

                <div className="demo-accounts">
                    <p className="demo-label">Quick Demo:</p>
                    <div className="demo-buttons">
                        <button className="btn btn-sm btn-secondary" onClick={() => fillDemo('admin', 'admin123')}>Admin</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => fillDemo('seller1', 'admin123')}>Seller</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => fillDemo('demouser', 'demo123')}>User</button>
                    </div>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
