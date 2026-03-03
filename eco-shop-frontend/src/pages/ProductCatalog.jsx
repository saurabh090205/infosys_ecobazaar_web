import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import './ProductCatalog.css';

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [ecoOnly, setEcoOnly] = useState(false);
    const [category, setCategory] = useState('');

    const categories = ['Clothing', 'Home', 'Personal Care', 'Electronics', 'Food & Drink'];

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        else if (ecoOnly) params.ecoFriendly = true;
        else if (category) params.category = category;

        productAPI.getAll(params)
            .then(res => setProducts(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [search, ecoOnly, category]);

    const renderStars = (rating) =>
        Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`star ${i < rating ? 'active' : ''}`}>★</span>
        ));

    return (
        <div className="page catalog-page">
            <div className="container">
                <div className="page-header">
                    <h1>🛍️ Product Catalog</h1>
                    <p>Browse our collection of sustainable and conventional products</p>
                </div>

                {/* Filters */}
                <div className="catalog-filters card">
                    <div className="filter-search">
                        <input className="form-input" type="text" placeholder="Search products..."
                            value={search} onChange={e => { setSearch(e.target.value); setCategory(''); setEcoOnly(false); }} />
                    </div>
                    <div className="filter-actions">
                        <button className={`btn btn-sm ${ecoOnly ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => { setEcoOnly(!ecoOnly); setSearch(''); setCategory(''); }}>
                            🌿 Eco-Friendly Only
                        </button>
                        <select className="form-input filter-select" value={category}
                            onChange={e => { setCategory(e.target.value); setSearch(''); setEcoOnly(false); }}>
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : products.length === 0 ? (
                    <div className="no-results">
                        <p>🔍 No products found. Try a different search or filter.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((p, i) => (
                            <Link to={`/products/${p.id}`} key={p.id} className="product-card card animate-in"
                                style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="product-img">
                                    <img src={p.imageUrl} alt={p.name} />
                                    {p.isEcoFriendly && <span className="badge badge-eco eco-tag">🌿 Eco</span>}
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{p.category}</span>
                                    <h3 className="product-name">{p.name}</h3>
                                    <div className="eco-stars">{renderStars(p.ecoRating)}</div>
                                    <div className="product-bottom">
                                        <span className="product-price">${p.price.toFixed(2)}</span>
                                        <span className="badge badge-carbon">🏭 {p.carbonFootprintKg} kg CO₂</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
