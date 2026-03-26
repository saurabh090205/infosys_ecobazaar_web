import { useState, useEffect } from 'react';
import { sellerAPI, productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import './SellerDashboard.css';

export default function SellerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [certifications, setCertifications] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [statsRes, certsRes, prodsRes] = await Promise.all([
                sellerAPI.getStats(),
                sellerAPI.getCertifications(),
                productAPI.getBySeller(user.userId),
            ]);
            setStats(statsRes.data);
            setCertifications(certsRes.data);
            setProducts(prodsRes.data);
        } catch (e) { console.error('Seller data load error:', e); }
        finally { setLoading(false); }
    };

    const handleRequestCert = async () => {
        if (!selectedProduct) return;
        setRequesting(true);
        try {
            await sellerAPI.requestCertification(Number(selectedProduct));
            setSelectedProduct('');
            loadData();
        } catch (e) {
            alert(e.response?.data?.message || 'Request failed. May already exist.');
        }
        finally { setRequesting(false); }
    };

    const handleDownloadReport = async () => {
        try {
            const res = await sellerAPI.getEcoReport();
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'seller_eco_report.csv');
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
        <div className="page container seller-dashboard animate-in">
            <div className="page-header">
                <h1>📊 Seller Analytics Dashboard</h1>
                <p>Track your products, sales, and green certifications</p>
                <div style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary" onClick={handleDownloadReport}>
                        📥 Download Eco Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="dashboard-cards">
                    <StatCard icon="📦" value={stats.totalProducts} label="Total Products" color="#2d6a4f" />
                    <StatCard icon="🌿" value={stats.ecoProducts} label="Eco Products" color="#52b788" />
                    <StatCard icon="🛒" value={stats.totalUnitsSold} label="Units Sold" color="#457b9d" />
                    <StatCard icon="🏭" value={`${stats.totalCarbonSold} kg`} label="Carbon Footprint Sold" color="#e76f51" />
                    <StatCard icon="⭐" value={stats.avgEcoRating?.toFixed(1) || '0'} label="Avg Eco Rating" color="#f4a261" />
                </div>
            )}

            {/* Request Certification */}
            <div className="seller-section card animate-in">
                <h3>🏅 Request Green Certification</h3>
                <p className="section-desc">Select a product to submit for green certification review by an admin.</p>
                <div className="cert-request-form">
                    <select
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.target.value)}
                        className="form-input cert-select"
                    >
                        <option value="">-- Select a product --</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (Eco: {p.ecoRating}/5)</option>
                        ))}
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={handleRequestCert}
                        disabled={!selectedProduct || requesting}
                    >
                        {requesting ? 'Submitting...' : '📋 Submit Request'}
                    </button>
                </div>
            </div>

            {/* Certification Status */}
            <div className="seller-section card animate-in">
                <h3>📋 My Certification Requests</h3>
                {certifications.length === 0 ? (
                    <p className="empty-message">No certification requests yet. Submit one above!</p>
                ) : (
                    <div className="seller-table-wrap">
                        <table className="seller-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product ID</th>
                                    <th>Status</th>
                                    <th>Requested</th>
                                    <th>Reviewed</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certifications.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.productId}</td>
                                        <td>
                                            <span className={`cert-status cert-${c.status.toLowerCase()}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td>{new Date(c.requestedAt).toLocaleDateString()}</td>
                                        <td>{c.reviewedAt ? new Date(c.reviewedAt).toLocaleDateString() : '—'}</td>
                                        <td>{c.notes || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
