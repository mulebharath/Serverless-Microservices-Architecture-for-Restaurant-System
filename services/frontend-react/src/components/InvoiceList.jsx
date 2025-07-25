import { useEffect, useState } from 'react';

function InvoiceList({ refreshKey, show }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBills = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/billing-api/billing');
      if (!response.ok) throw new Error('Failed to fetch bills');
      const data = await response.json();
      setBills(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchBills();
    // eslint-disable-next-line
  }, [refreshKey, show]);

  if (!show) return null;

  return (
    <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(59,130,246,0.10)', padding: 32, margin: '32px 0 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: '1.2rem', color: '#f59e42', marginBottom: 18 }}>
        <span role="img" aria-label="invoice">🧾</span> Invoice Records
      </h3>
      {loading ? (
        <div>Loading bills...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : bills.length === 0 ? (
        <div style={{ color: '#888', fontSize: 16 }}>No invoices found.</div>
      ) : (
        <div style={{ width: '100%' }}>
          {bills.map(bill => (
            <div key={bill.id} style={{
              background: '#f9fafb',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(59,130,246,0.06)',
              padding: '16px 18px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 16,
              fontWeight: 500,
              color: '#222',
            }}>
              <span style={{ fontSize: 20, marginRight: 8, color: '#3b82f6' }}>🧾</span>
              <span style={{ fontWeight: 700, color: '#3b82f6' }}>Bill #{bill.id}</span>
              <span style={{ marginLeft: 8 }}>→ Order #{bill.order_id} <span style={{ color: '#10b981', fontWeight: 700 }}>₹{bill.amount}</span></span>
            </div>
          ))}
        </div>
      )}
      <button className="btn secondary" style={{ marginTop: 18 }} onClick={fetchBills} disabled={loading}>
        Refresh
      </button>
    </div>
  );
}

export default InvoiceList; 