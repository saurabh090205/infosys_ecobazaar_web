import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import StatCard from '../components/StatCard';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [tab, setTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [usersRes, certsRes, statsRes] = await Promise.all([
                adminAPI.getUsers(),
                adminAPI.getCertifications(),
                adminAPI.getPlatformStats(),
            ]);
            setUsers(usersRes.data);
            setCertifications(certsRes.data);
            setStats(statsRes.data);
        } catch (e) { console.error('Admin load error:', e); }
        finally { setLoading(false); }
    };

    const handleVerify = async (userId) => {
        try {
            await adminAPI.verifyUser(userId);
            loadData();
        } catch (e) { alert('Verification failed'); }
    };

    const handleReview = async (certId, decision) => {
        try {
            await adminAPI.reviewCertification(certId, { decision });
            loadData();
        } catch (e) { alert('Review failed'); }
    };

    const handleDownloadReport = async () => {
        try {
            const res = await adminAPI.getEcoReport();
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'admin_eco_report.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('Failed to download report', e);
            alert('Failed to download eco report');
        }
    };

    if (loading) return <div className="page"><div className="spinner" style={{ marginTop: '200px' }}></div></div>;

    return (
        <div className="page container admin-dashboard animate-in">
            <div className="page-header">
                <h1>🛡️ Admin Dashboard</h1>
                <p>Manage users, certifications, and platform sustainability</p>
                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handleDownloadReport}>
                        📥 Download Eco Report
                    </button>
                </div>
            </div>

            {/* Platform Stats */}
            {stats && (
                <div className="dashboard-cards">
                    <StatCard icon="🛍️" value={stats.totalBuyers} label="Total Buyers" color="#457b9d" />
                    <StatCard icon="🏪" value={stats.totalSellers} label="Total Sellers" color="#1d3557" />
                    <StatCard icon="📦" value={stats.totalProducts} label="Total Products" color="#2d6a4f" />
                    <StatCard icon="🛒" value={stats.totalOrders} label="Total Orders" color="#f4a261" />
                    <StatCard icon="🏭" value={`${stats.totalCarbonFootprint} kg`} label="Platform CO₂" color="#e76f51" />
                    <StatCard icon="📋" value={stats.pendingCertifications} label="Pending Certs" color="#264653" />
                </div>
            )}

            {/* Tabs */}
            <div className="admin-tabs">
                <button className={`admin-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
                    👥 Users
                </button>
                <button className={`admin-tab ${tab === 'certs' ? 'active' : ''}`} onClick={() => setTab('certs')}>
                    📋 Certifications
                </button>
            </div>

            {/* Users Tab */}
            {tab === 'users' && (
                <div className="admin-section card animate-in">
                    <h3>User Management</h3>
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Store Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Verified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td><strong>{u.username}</strong></td>
                                        <td>{u.role === 'SELLER' ? u.storeName : '—'}</td>
                                        <td>{u.email}</td>
                                        <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                                        <td>{u.isVerified ? '✅' : '❌'}</td>
                                        <td>
                                            {u.role === 'SELLER' && (
                                                <button className="btn btn-sm btn-primary" onClick={() => handleVerify(u.id)}>
                                                    {u.isVerified ? 'Unverify' : 'Verify'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Certifications Tab */}
            {tab === 'certs' && (
                <div className="admin-section card animate-in">
                    <h3>Green Certification Requests</h3>
                    {certifications.length === 0 ? (
                        <p className="empty-message">No certification requests yet.</p>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Product ID</th>
                                        <th>Seller ID</th>
                                        <th>Status</th>
                                        <th>Requested</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {certifications.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.id}</td>
                                            <td>{c.productId}</td>
                                            <td>{c.sellerId}</td>
                                            <td>
                                                <span className={`cert-status cert-${c.status.toLowerCase()}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td>{new Date(c.requestedAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="cert-actions">
                                                    <Link to={`/products/${c.productId}`} className="btn btn-sm btn-secondary" style={{ marginRight: '5px' }}>
                                                        View Product
                                                    </Link>
                                                    {c.status === 'PENDING' && (
                                                        <>
                                                            <button className="btn btn-sm btn-primary" onClick={() => handleReview(c.id, 'APPROVED')}>
                                                                ✅ Approve
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleReview(c.id, 'REJECTED')}>
                                                                ❌ Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
