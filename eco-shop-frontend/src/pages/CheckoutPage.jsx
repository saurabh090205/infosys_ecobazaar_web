import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import './CheckoutPage.css';

export default function CheckoutPage({ onCartUpdate }) {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        cartAPI.get()
            .then(res => setCart(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleCheckout = async () => {
        if (!address.trim()) return;
        setPlacing(true);
        try {
            const res = await orderAPI.checkout({ shippingAddress: address });
            setOrder(res.data);
            if (onCartUpdate) onCartUpdate();
        } catch { alert('Checkout failed. Please try again.'); }
        finally { setPlacing(false); }
    };

    if (loading) return <div className="page"><div className="spinner" style={{ marginTop: '200px' }}></div></div>;

    // ── Order Confirmation ──
    if (order) {
        return (
            <div className="page checkout-page">
                <div className="container">
                    <div className="confirmation animate-in">
                        <div className="confirm-icon">🎉</div>
                        <h1>Order Confirmed!</h1>
                        <p className="confirm-id">Order #{order.id}</p>

                        <div className="confirm-summary card">
                            <div className="confirm-row">
                                <span>Total</span><span className="confirm-value">${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="confirm-row">
                                <span>🏭 Carbon Footprint</span>
                                <span className="confirm-value">{order.totalCarbonFootprint.toFixed(2)} kg CO₂</span>
                            </div>
                            <div className="confirm-row">
                                <span>Status</span><span className="badge badge-eco">{order.status}</span>
                            </div>
                            <div className="confirm-row">
                                <span>Shipping To</span><span>{order.shippingAddress}</span>
                            </div>

                            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Items</h4>
                            {order.items.map((item, i) => (
                                <div key={i} className="confirm-item">
                                    <span>{item.productName} × {item.quantity}</span>
                                    <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="confirm-eco-msg">
                            🌍 Your order's carbon footprint: <strong>{order.totalCarbonFootprint.toFixed(2)} kg CO₂e</strong>
                        </div>

                        <div className="confirm-actions">
                            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                            <Link to="/orders" className="btn btn-secondary">View Orders</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Checkout Form ──
    if (!cart || cart.items.length === 0) {
        return (
            <div className="page checkout-page">
                <div className="container" style={{ textAlign: 'center', paddingTop: '120px' }}>
                    <h2>Your cart is empty</h2>
                    <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page checkout-page">
            <div className="container">
                <div className="page-header">
                    <h1>📦 Checkout</h1>
                    <p>Review your order and complete your purchase</p>
                </div>

                <div className="checkout-layout animate-in">
                    <div className="checkout-form">
                        <div className="card" style={{ padding: '24px' }}>
                            <h3>Shipping Address</h3>
                            <div className="form-group" style={{ marginTop: '16px' }}>
                                <textarea className="form-input" rows="3" placeholder="Enter your full shipping address..."
                                    value={address} onChange={e => setAddress(e.target.value)} required />
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px', marginTop: '20px' }}>
                            <h3>Order Items</h3>
                            {cart.items.map(item => (
                                <div key={item.id} className="checkout-item">
                                    <img src={item.productImage} alt={item.productName} />
                                    <div className="checkout-item-info">
                                        <span className="checkout-item-name">{item.productName}</span>
                                        <span className="checkout-item-qty">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="checkout-item-price">${item.subtotal.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="checkout-summary card">
                        <h3>Order Summary</h3>
                        <div className="summary-row"><span>Items</span><span>{cart.totalItems}</span></div>
                        <div className="summary-row"><span>Subtotal</span><span>${cart.totalPrice.toFixed(2)}</span></div>
                        <div className="summary-row"><span>Shipping</span><span className="free-shipping">FREE</span></div>
                        <div className="summary-row total-row">
                            <span>Total</span><span>${cart.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-emissions">
                            <span>🏭 Total Emissions</span>
                            <span>{cart.totalCarbonFootprint.toFixed(2)} kg CO₂</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}
                            onClick={handleCheckout} disabled={placing || !address.trim()}>
                            {placing ? 'Placing Order...' : '✓ Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
