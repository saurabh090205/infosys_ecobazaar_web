import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrdersPage.css';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchOrders = () => {
        orderAPI.getHistory()
            .then(res => setOrders(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleCancel = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        setCancellingId(orderId);
        try {
            await orderAPI.cancel(orderId);
            fetchOrders();
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'CONFIRMED': return 'badge-eco';
            case 'CANCELLED': return 'badge-cancelled';
            case 'DELIVERED': return 'badge-delivered';
            default: return 'badge-eco';
        }
    };

    if (loading) return <div className="page"><div className="spinner" style={{ marginTop: '200px' }}></div></div>;

    return (
        <div className="page orders-page">
            <div className="container">
                <div className="page-header">
                    <h1>📋 Order History</h1>
                    <p>Track your purchases and their environmental impact</p>
                </div>

                {orders.length === 0 ? (
                    <div className="no-orders animate-in">
                        <span style={{ fontSize: '3rem' }}>📦</span>
                        <h2>No orders yet</h2>
                        <p>Your order history will appear here after your first purchase.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, i) => (
                            <div key={order.id} className="order-card card animate-in" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="order-header">
                                    <div>
                                        <span className="order-id">Order #{order.id}</span>
                                        <span className="order-date">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span>
                                </div>
                                <div className="order-items">
                                    {order.items.map((item, j) => (
                                        <div key={j} className="order-item">
                                            <span>{item.productName} × {item.quantity}</span>
                                            <span>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <div className="order-footer-left">
                                        <span className="order-total">Total: ${order.totalPrice.toFixed(2)}</span>
                                        <span className="badge badge-carbon">🏭 {order.totalCarbonFootprint.toFixed(2)} kg CO₂</span>
                                    </div>
                                    {order.status === 'CONFIRMED' && (
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancellingId === order.id}
                                        >
                                            {cancellingId === order.id ? 'Cancelling...' : '✕ Cancel Order'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
