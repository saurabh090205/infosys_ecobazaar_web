import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function SignupPage() {
    const { user, register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', role: 'USER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) { navigate('/'); return null; }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await register(form);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page page">
            <div className="auth-container animate-in">
                <div className="auth-header">
                    <span className="auth-icon">🌱</span>
                    <h1>Join EcoShop</h1>
                    <p>Start your sustainable shopping journey today</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input className="form-input" type="text" value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Username *</label>
                        <input className="form-input" type="text" value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input className="form-input" type="email" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Password *</label>
                        <input className="form-input" type="password" value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                    </div>
                    <div className="form-group">
                        <label>Account Type</label>
                        <select className="form-input" value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="USER">Shopper</option>
                            <option value="SELLER">Seller</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
