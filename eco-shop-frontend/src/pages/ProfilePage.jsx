import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
    const [message, setMessage] = useState('');
    const [pwMessage, setPwMessage] = useState('');

    useEffect(() => {
        userAPI.getProfile().then(res => {
            setProfile(res.data);
            setForm(res.data);
        }).catch(() => { });
    }, []);

    const handleSave = async () => {
        try {
            await userAPI.updateProfile(form);
            setProfile({ ...profile, ...form });
            setEditing(false);
            setMessage('✅ Profile updated!');
            setTimeout(() => setMessage(''), 3000);
        } catch { setMessage('❌ Update failed'); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await authAPI.changePassword(pwForm);
            setPwMessage('✅ Password changed!');
            setPwForm({ currentPassword: '', newPassword: '' });
            setTimeout(() => setPwMessage(''), 3000);
        } catch (err) {
            setPwMessage('❌ ' + (err.response?.data?.error || 'Failed'));
        }
    };

    if (!profile) return <div className="page"><div className="spinner" style={{ marginTop: '200px' }}></div></div>;

    return (
        <div className="page profile-page">
            <div className="container">
                <div className="page-header">
                    <h1>👤 My Profile</h1>
                </div>

                <div className="profile-grid animate-in">
                    <div className="profile-card card">
                        <div className="profile-avatar">{profile.username[0].toUpperCase()}</div>
                        <h2>{profile.fullName || profile.username}</h2>
                        <span className="badge badge-eco">{profile.role}</span>
                        <p className="profile-email">{profile.email}</p>
                    </div>

                    <div className="profile-details card">
                        <div className="profile-section-header">
                            <h3>Profile Details</h3>
                            {!editing && <button className="btn btn-sm btn-secondary" onClick={() => setEditing(true)}>Edit</button>}
                        </div>
                        {message && <div className="alert alert-success">{message}</div>}

                        <div className="form-group">
                            <label>Full Name</label>
                            <input className="form-input" value={form.fullName || ''} disabled={!editing}
                                onChange={e => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-input" value={form.email || ''} disabled={!editing}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input className="form-input" value={form.address || ''} disabled={!editing}
                                onChange={e => setForm({ ...form, address: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input className="form-input" value={form.phone || ''} disabled={!editing}
                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        {editing && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                                <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</button>
                            </div>
                        )}
                    </div>

                    <div className="profile-password card">
                        <h3>Change Password</h3>
                        {pwMessage && <div className={`alert ${pwMessage.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{pwMessage}</div>}
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input className="form-input" type="password" value={pwForm.currentPassword}
                                    onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input className="form-input" type="password" value={pwForm.newPassword}
                                    onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
