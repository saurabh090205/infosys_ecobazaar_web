import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import './LandingPage.css';

export default function LandingPage() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        productAPI.getAll({ ecoFriendly: true })
            .then(res => setFeatured(res.data.slice(0, 4)))
            .catch(() => { });
    }, []);

    return (
        <div className="landing">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container hero-content">
                    <div className="hero-badge animate-in">🌱 Sustainable Shopping</div>
                    <h1 className="hero-title animate-in" style={{ animationDelay: '0.1s' }}>
                        Shop <span className="highlight">Green</span>.
                        <br />Live <span className="highlight">Clean</span>.
                    </h1>
                    <p className="hero-subtitle animate-in" style={{ animationDelay: '0.2s' }}>
                        Every product shows its carbon footprint. Make informed choices
                        and discover eco-friendly alternatives that help protect our planet.
                    </p>
                    <div className="hero-actions animate-in" style={{ animationDelay: '0.3s' }}>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Browse Products →
                        </Link>
                        <Link to="/signup" className="btn btn-secondary btn-lg">
                            Join the Movement
                        </Link>
                    </div>
                    <div className="hero-stats animate-in" style={{ animationDelay: '0.4s' }}>
                        <div className="stat"><span className="stat-num">12+</span><span className="stat-label">Eco Products</span></div>
                        <div className="stat"><span className="stat-num">CO₂</span><span className="stat-label">Tracked</span></div>
                        <div className="stat"><span className="stat-num">5★</span><span className="stat-label">Eco Ratings</span></div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why EcoShop?</h2>
                    <div className="features-grid">
                        <div className="feature-card card">
                            <div className="feature-icon">🌍</div>
                            <h3>Carbon Tracking</h3>
                            <p>See the CO₂ footprint of every product before you buy. Knowledge is power.</p>
                        </div>
                        <div className="feature-card card">
                            <div className="feature-icon">🔄</div>
                            <h3>Greener Alternatives</h3>
                            <p>Get recommendations for lower-impact alternatives in the same category.</p>
                        </div>
                        <div className="feature-card card">
                            <div className="feature-icon">⭐</div>
                            <h3>Eco Ratings</h3>
                            <p>1-5 star sustainability ratings so you can compare products at a glance.</p>
                        </div>
                        <div className="feature-card card">
                            <div className="feature-icon">📊</div>
                            <h3>Impact Dashboard</h3>
                            <p>Your cart shows total emissions in real time. See the impact of your choices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {featured.length > 0 && (
                <section className="featured-section">
                    <div className="container">
                        <h2 className="section-title">Featured Eco Products</h2>
                        <div className="featured-grid">
                            {featured.map(p => (
                                <Link to={`/products/${p.id}`} key={p.id} className="featured-card card">
                                    <div className="featured-img">
                                        <img src={p.imageUrl} alt={p.name} />
                                        <span className="badge badge-eco">🌿 Eco</span>
                                    </div>
                                    <div className="featured-info">
                                        <h3>{p.name}</h3>
                                        <div className="featured-meta">
                                            <span className="price">${p.price.toFixed(2)}</span>
                                            <span className="badge badge-carbon">🏭 {p.carbonFootprintKg} kg CO₂</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '32px' }}>
                            <Link to="/products" className="btn btn-primary">View All Products →</Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-inner">
                    <span>🌿 EcoShop © 2026 – Shopping sustainably, one product at a time.</span>
                </div>
            </footer>
        </div>
    );
}
