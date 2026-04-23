import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail({ onCartUpdate }) {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [alternatives, setAlternatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedMsg, setAddedMsg] = useState('');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            productAPI.getById(id),
            productAPI.getAlternatives(id)
        ]).then(([prodRes, altRes]) => {
            setProduct(prodRes.data);
            setAlternatives(altRes.data);
        }).catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) return;
        setAddingToCart(true);
        try {
            await cartAPI.add({ productId: product.id, quantity: 1 });
            setAddedMsg('✅ Added to cart!');
            if (onCartUpdate) onCartUpdate();
            setTimeout(() => setAddedMsg(''), 2500);
        } catch { setAddedMsg('❌ Failed'); }
        finally { setAddingToCart(false); }
    };

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'active' : ''}`}>★</span>
        ));

    const getCarbonClass = (kg) => kg < 2 ? 'carbon-low' : kg < 8 ? 'carbon-medium' : 'carbon-high';
    const getCarbonPercent = (kg) => Math.min((kg / 15) * 100, 100);

    if (loading) return <div className="page"><div className="spinner" style={{ marginTop: '200px' }}></div></div>;
    if (!product) return <div className="page container"><p>Product not found.</p></div>;

    return (
        <div className="page detail-page">
            <div className="container">
                <Link to="/products" className="back-link">← Back to Products</Link>

                <div className="detail-grid animate-in">
                    {/* Image */}
                    <div className="detail-image card">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>

                    {/* Info */}
                    <div className="detail-info">
                        <span className="product-category">{product.category}</span>
                        <h1>{product.name}</h1>

                        <div className="detail-ratings">
                            <div className="eco-stars">{renderStars(product.ecoRating)}</div>
                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                {product.isEcoFriendly && <span className="badge badge-eco">🌿 Eco-Friendly</span>}
                                {product.isCertified && <span className="badge badge-success">🏆 Certified Green</span>}
                            </div>
                        </div>

                        {product.storeName && (
                            <div className="product-seller" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: '0.95rem', color: '#666' }}>
                                <span>Sold by: <strong style={{color: '#333'}}>{product.storeName}</strong></span>
                                {product.isSellerVerified && <span className="badge badge-primary" style={{ marginLeft: '8px', fontSize: '0.75rem' }}>✓ Verified Seller</span>}
                            </div>
                        )}

                        <p className="detail-price">${product.price.toFixed(2)}</p>
                        <p className="detail-desc">{product.description}</p>

                        {/* Carbon Impact */}
                        <div className="carbon-section card">
                            <h3>🏭 Carbon Impact</h3>
                            <div className="carbon-value">
                                <span className="carbon-num">{product.carbonFootprintKg}</span>
                                <span className="carbon-unit">kg CO₂e per unit</span>
                            </div>
                            <div className="carbon-bar-track">
                                <div className={`carbon-bar-fill ${getCarbonClass(product.carbonFootprintKg)}`}
                                    style={{ width: `${getCarbonPercent(product.carbonFootprintKg)}%` }}></div>
                            </div>
                            <div className="carbon-legend">
                                <span className="carbon-low-label">🟢 Low</span>
                                <span className="carbon-med-label">🟡 Medium</span>
                                <span className="carbon-high-label">🔴 High</span>
                            </div>
                        </div>

                        {user ? (
                            user.role !== 'ADMIN' ? (
                                <div className="detail-actions">
                                    <button className="btn btn-primary" onClick={handleAddToCart} disabled={addingToCart}>
                                        {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                                    </button>
                                    {addedMsg && <span className="added-msg">{addedMsg}</span>}
                                </div>
                            ) : null
                        ) : (
                            <Link to="/login" className="btn btn-primary">Login to Purchase</Link>
                        )}

                        <div className="detail-meta">
                            <span>Stock: {product.stock} units</span>
                        </div>
                    </div>
                </div>

                {/* Greener Alternatives */}
                {alternatives.length > 0 && (
                    <div className="alternatives-section">
                        <h2>🌱 Greener Alternatives</h2>
                        <p className="alt-subtitle">Products in the same category with lower carbon footprint</p>
                        <div className="alternatives-grid">
                            {alternatives.map(alt => (
                                <Link to={`/products/${alt.id}`} key={alt.id} className="alt-card card">
                                    <div className="alt-img">
                                        <img src={alt.imageUrl} alt={alt.name} />
                                    </div>
                                    <div className="alt-info">
                                        <h4>{alt.name}</h4>
                                        <div className="alt-meta">
                                            <span className="product-price">${alt.price.toFixed(2)}</span>
                                            <span className="badge badge-carbon">🏭 {alt.carbonFootprintKg} kg</span>
                                        </div>
                                        <div className="carbon-savings">
                                            ↓ {(product.carbonFootprintKg - alt.carbonFootprintKg).toFixed(1)} kg CO₂ less
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
