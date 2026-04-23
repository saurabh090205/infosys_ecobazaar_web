import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI, productAPI } from '../services/api';
import './CartPage.css';

export default function CartPage({ onCartUpdate }) {
    const [cart, setCart] = useState(null);
    const [alternatives, setAlternatives] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const res = await cartAPI.get();
            setCart(res.data);
            // Load alternatives for high-carbon items
            const alts = {};
            for (const item of res.data.items) {
                if (item.carbonFootprintKg > 3) {
                    try {
                        const altRes = await productAPI.getAlternatives(item.productId);
                        if (altRes.data.length > 0) alts[item.productId] = altRes.data[0];
                    } catch { }
                }
            }
            setAlternatives(alts);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchCart(); }, []);

    const updateQty = async (id, qty) => {
        if (qty < 1) return;
        await cartAPI.update(id, qty);
        fetchCart(); if (onCartUpdate) onCartUpdate();
    };

    const removeItem = async (id) => {
        await cartAPI.remove(id);
        fetchCart(); if (onCartUpdate) onCartUpdate();
    };

    const getCarbonClass = (kg) => kg < 5 ? 'carbon-low' : kg < 15 ? 'carbon-medium' : 'carbon-high';

    if (loading) return <div className="page"><div className="spinner" style={{ marginTop: '200px' }}></div></div>;

    return (
        <div className="page cart-page">
            <div className="container">
                <div className="page-header">
                    <h1>🛒 Shopping Cart</h1>
                    <p>{cart?.totalItems || 0} items in your cart</p>
                </div>

                {!cart || cart.items.length === 0 ? (
                    <div className="empty-cart animate-in">
                        <span className="empty-icon">🛒</span>
                        <h2>Your cart is empty</h2>
                        <p>Discover eco-friendly products and start shopping sustainably!</p>
                        <Link to="/products" className="btn btn-primary">Browse Products</Link>
                    </div>
                ) : (
                    <div className="cart-layout animate-in">
                        <div className="cart-items">
                            {cart.items.map(item => (
                                <div key={item.id} className="cart-item card">
                                    <img src={item.productImage} alt={item.productName} className="cart-item-img" />
                                    <div className="cart-item-info">
                                        <Link to={`/products/${item.productId}`} className="cart-item-name">{item.productName}</Link>
                                        <div className="cart-item-meta">
                                            <span className="badge badge-carbon">🏭 {item.carbonFootprintKg} kg CO₂/unit</span>
                                            <div className="eco-stars">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <span key={i} className={`star ${i < item.ecoRating ? 'active' : ''}`}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Greener swap suggestion */}
                                        {alternatives[item.productId] && (
                                            <div className="swap-suggestion">
                                                💡 <Link to={`/products/${alternatives[item.productId].id}`}>
                                                    Swap to {alternatives[item.productId].name}
                                                </Link>
                                                <span className="swap-savings">
                                                    (saves {(item.carbonFootprintKg - alternatives[item.productId].carbonFootprintKg).toFixed(1)} kg CO₂)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="qty-control">
                                            <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <span className="cart-item-price">${item.subtotal.toFixed(2)}</span>
                                        <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="cart-summary card">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal ({cart.totalItems} items)</span>
                                <span className="summary-value">${cart.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="summary-row carbon-summary">
                                <span>🏭 Total Carbon Footprint</span>
                                <span className="summary-value">{cart.totalCarbonFootprint.toFixed(2)} kg CO₂</span>
                            </div>
                            <div className="carbon-bar-track" style={{ margin: '12px 0' }}>
                                <div className={`carbon-bar-fill ${getCarbonClass(cart.totalCarbonFootprint)}`}
                                    style={{ width: `${Math.min((cart.totalCarbonFootprint / 30) * 100, 100)}%` }}></div>
                            </div>
                            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                                Proceed to Checkout →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
