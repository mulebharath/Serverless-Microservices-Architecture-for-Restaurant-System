import { useState } from 'react';

function OrderForm({ onOrderPlaced }) {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!item.trim() || quantity <= 0) {
      setError('Please enter a valid item and quantity.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/order-api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, quantity: Number(quantity) })
      });
      if (!response.ok) throw new Error('Order failed.');
      setItem('');
      setQuantity(1);
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>📝 Submit New Order</h2>
      <form onSubmit={handleSubmit} className="form-row">
        <input
          type="text"
          placeholder="Dish Name"
          className="input"
          value={item}
          onChange={e => setItem(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          className="input"
          min="1"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
        />
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? 'Placing...' : '➕ Add to Kitchen'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </section>
  );
}

export default OrderForm; 