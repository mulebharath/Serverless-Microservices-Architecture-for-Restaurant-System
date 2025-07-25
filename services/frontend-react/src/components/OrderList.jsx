import { useEffect, useState } from 'react';

function OrderList({ refreshKey }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/order-api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [refreshKey]);

  return (
    <div style={{ width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400, marginTop: 32, background: 'transparent' }}>
      <div style={{
        width: 420,
        minHeight: 420,
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(59,130,246,0.10)',
        padding: 36,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: '1.5rem', color: '#f59e42', marginBottom: 18 }}>
          <span role="img" aria-label="kitchen">🔥</span> Kitchen Pipeline
        </h2>
        {loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : orders.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16 }}>No orders currently.</div>
        ) : (
          <div style={{ width: '100%' }}>
            {orders.map(order => (
              <div key={order.id} style={{
                background: '#f9fafb',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(59,130,246,0.06)',
                padding: '18px 20px',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontSize: 17,
                fontWeight: 500,
                color: '#222',
                position: 'relative',
              }}>
                <span style={{ fontSize: 22, marginRight: 8, color: '#3b82f6' }}>🍽️</span>
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>#{order.id}</span>
                <span style={{ marginLeft: 8 }}>{order.item} <span style={{ color: '#10b981', fontWeight: 700 }}>× {order.quantity}</span></span>
                <span style={{
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '2px 12px',
                  fontSize: 13,
                  fontWeight: 600,
                  marginLeft: 'auto',
                }}>In Kitchen</span>
              </div>
            ))}
          </div>
        )}
        <button className="btn secondary" style={{ marginTop: 18 }} onClick={fetchOrders} disabled={loading}>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default OrderList;