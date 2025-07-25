import { useEffect, useState } from 'react';

function BillModal({ isOpen, onClose, onBillCreated }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/order-api/orders')
        .then(res => res.json())
        .then(setOrders)
        .catch(() => setOrders([]));
      setSelectedOrders([]);
      setAmount('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  // Get the price for each selected order (from the menu)
  const getOrderPrice = (orderId) => {
    // This is a demo; in a real app, you would fetch the price from the backend or menu
    // For now, just use a static price map for demo
    const priceMap = {};
    orders.forEach(o => { priceMap[o.id] = o.price || 100; });
    return priceMap[orderId] || 100;
  };

  const handleOrderToggle = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Calculate the sum of selected order prices
  const selectedOrderPrices = selectedOrders.map(id => getOrderPrice(id));
  const suggestedAmount = selectedOrderPrices.reduce((sum, p) => sum + (Number(p) || 0), 0);

  // Always update the amount to the price of the selected order
  useEffect(() => {
    if (selectedOrders.length === 1) {
      setAmount(getOrderPrice(selectedOrders[0]));
    } else if (selectedOrders.length === 0) {
      setAmount('');
    }
  }, [selectedOrders.length === 1 ? selectedOrders[0] : null]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!selectedOrders.length || !amount || Number(amount) <= 0) {
      setError('Please select at least one order and enter a valid amount.');
      return;
    }
    if (selectedOrders.length > 1) {
      setError('Only one order can be billed at a time. Please select a single order.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/billing-api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: selectedOrders[0], amount: Number(amount) })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create bill');
      }
      setAmount('');
      setSelectedOrders([]);
      setSuccess(true);
      if (onBillCreated) onBillCreated();
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(214,69,65,0.18)', padding: 40, minWidth: 380, maxWidth: 480, width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button style={{ position: 'absolute', top: 18, right: 18, background: '#fff', color: '#D64541', border: 'none', borderRadius: 8, fontSize: 22, width: 38, height: 38, cursor: 'pointer', boxShadow: '0 2px 8px rgba(214,69,65,0.10)' }} aria-label="Close Billing Modal" onClick={onClose}>×</button>
        <h3 style={{ fontWeight: 700, fontSize: '1.4rem', color: '#3b82f6', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" aria-label="invoice">🧾</span> Generate Invoice
        </h3>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: '#222', marginBottom: 4 }}>Select Order(s):</label>
          <div style={{ width: '100%', maxHeight: 120, overflowY: 'auto', border: '1.5px solid #F9A825', borderRadius: 10, background: '#f9fafb', padding: 8, marginBottom: 4 }}>
            {orders.length === 0 && <div style={{ color: '#888', fontSize: 15 }}>No orders available.</div>}
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => handleOrderToggle(order.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer',
                  background: selectedOrders.includes(order.id) ? '#F9A82522' : 'transparent',
                  borderRadius: 6,
                  fontWeight: selectedOrders.includes(order.id) ? 700 : 500,
                  color: selectedOrders.includes(order.id) ? '#D64541' : '#333',
                  transition: 'background 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  readOnly
                  style={{ accentColor: '#D64541', marginRight: 6 }}
                />
                <span>#{order.id} – {order.item}</span>
              </div>
            ))}
          </div>
          <div style={{ color: '#888', fontSize: 13, marginTop: -8, marginBottom: 8, alignSelf: 'flex-start' }}>
            <span role="img" aria-label="info">ℹ️</span> Click to select/deselect. Multiple selection supported.
          </div>
          <label htmlFor="bill-amount" style={{ fontWeight: 600, color: '#222', marginBottom: 4 }}>Total Amount (₹):</label>
          <input
            id="bill-amount"
            type="number"
            className="input"
            placeholder={selectedOrders.length > 0 ? `Suggested: ₹${suggestedAmount}` : "Enter Amount"}
            min="1"
            step="1"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: '100%', borderRadius: 10, fontSize: 16, background: '#f9fafb', border: '1.5px solid #d1d5db', color: '#222', padding: 10, boxShadow: '0 2px 8px rgba(59,130,246,0.06)' }}
            required
          />
          <button className="btn primary" type="submit" disabled={loading} style={{ width: '100%', fontSize: '1.1rem', padding: '14px 0', borderRadius: 999 }}>
            {loading ? 'Submitting...' : '💰 Submit Bill'}
          </button>
        </form>
        {error && <div style={{ color: '#D64541', marginTop: 12 }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginTop: 12, fontWeight: 700 }}>Bill created successfully!</div>}
      </div>
    </div>
  );
}

export default BillModal; 