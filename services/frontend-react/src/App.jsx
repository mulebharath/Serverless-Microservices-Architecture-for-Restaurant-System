import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import OrderMenu from './components/OrderMenu';
import OrderList from './components/OrderList';
import BillModal from './components/BillModal';
import InvoiceList from './components/InvoiceList';
import './App.css';

function KitchenPage() {
  const [orderRefreshKey, setOrderRefreshKey] = useState(0);
  return <OrderList refreshKey={orderRefreshKey} />;
}

function BillingPage() {
  const [billRefreshKey, setBillRefreshKey] = useState(0);
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBillCreated = () => {
    setBillRefreshKey(k => k + 1);
    setShowInvoices(true);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', background: 'var(--background)' }}>
      <div style={{ maxWidth: 480, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px rgba(59,130,246,0.10)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0 24px 0' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: '1.5rem', color: '#3b82f6', marginBottom: 18 }}>
          <span role="img" aria-label="card">💳</span> Billing Hub
        </h2>
        <button className="btn primary" style={{ fontSize: '1.1rem', padding: '12px 32px', margin: '12px 0 0 0' }} onClick={() => setBillModalOpen(true)}>
          <span role="img" aria-label="generate">🧾</span> Generate Bill
        </button>
        {success && <div style={{ color: '#10b981', marginTop: 16, fontWeight: 700 }}>Bill created successfully!</div>}
      </div>
      <InvoiceList refreshKey={billRefreshKey} show={showInvoices} />
      <BillModal
        isOpen={billModalOpen}
        onClose={() => setBillModalOpen(false)}
        onBillCreated={handleBillCreated}
      />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero" style={{ background: '#fff', padding: '64px 0 32px 0', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#D64541', letterSpacing: 2, marginBottom: 12 }}>
            AM<sup>2</sup>
          </div>
          <div style={{ fontSize: '1.5rem', color: '#333', fontWeight: 600, marginBottom: 18 }}>
            Where Every Meal is an Experience
          </div>
          <div className="hero-desc" style={{ fontSize: '1.15rem', color: '#555', margin: '0 auto', maxWidth: 700, lineHeight: 1.7 }}>
            Welcome to <b>AM<sup>2</sup></b> – your destination for a world of flavors! Enjoy sizzling street food, gourmet classics, and real-time kitchen tracking. Seamless billing, lightning-fast delivery, and a menu that celebrates Indian, Chinese, Italian, and American cuisine. Hungry for something extraordinary? Dive in and delight your senses!
          </div>
        </div>
      </section>
      <div className="feature-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, margin: '0 auto', maxWidth: 1100, padding: '32px 0' }}>
        <div className="feature-card" style={{ flex: '1 1 220px', minWidth: 220, background: '#FFF8F0', borderRadius: 18, boxShadow: '0 2px 12px rgba(246, 71, 65, 0.07)', padding: 28, textAlign: 'center' }}>
          <div className="feature-title" style={{ fontSize: 28, fontWeight: 700, color: '#D64541', marginBottom: 10 }}><span className="feature-icon">🍕</span> Wide Menu</div>
          <div className="feature-desc" style={{ color: '#555' }}>From classic pizzas to exotic biryanis, enjoy a variety of dishes for every taste. Indian, Chinese, Italian, and American favorites all in one place.</div>
        </div>
        <div className="feature-card" style={{ flex: '1 1 220px', minWidth: 220, background: '#FFF8F0', borderRadius: 18, boxShadow: '0 2px 12px rgba(246, 71, 65, 0.07)', padding: 28, textAlign: 'center' }}>
          <div className="feature-title" style={{ fontSize: 28, fontWeight: 700, color: '#D64541', marginBottom: 10 }}><span className="feature-icon">⏱️</span> Real-Time Tracking</div>
          <div className="feature-desc" style={{ color: '#555' }}>Track your order from kitchen to table with live updates. No more guessing when your food will arrive!</div>
        </div>
        <div className="feature-card" style={{ flex: '1 1 220px', minWidth: 220, background: '#FFF8F0', borderRadius: 18, boxShadow: '0 2px 12px rgba(246, 71, 65, 0.07)', padding: 28, textAlign: 'center' }}>
          <div className="feature-title" style={{ fontSize: 28, fontWeight: 700, color: '#D64541', marginBottom: 10 }}><span className="feature-icon">💳</span> Easy Billing</div>
          <div className="feature-desc" style={{ color: '#555' }}>Simple, transparent billing and invoice management for a hassle-free experience. Pay securely and keep track of your orders.</div>
        </div>
        <div className="feature-card" style={{ flex: '1 1 220px', minWidth: 220, background: '#FFF8F0', borderRadius: 18, boxShadow: '0 2px 12px rgba(246, 71, 65, 0.07)', padding: 28, textAlign: 'center' }}>
          <div className="feature-title" style={{ fontSize: 28, fontWeight: 700, color: '#D64541', marginBottom: 10 }}><span className="feature-icon">🚀</span> Lightning Fast Delivery</div>
          <div className="feature-desc" style={{ color: '#555' }}>Enjoy hot, fresh food delivered to your doorstep in record time. Our delivery partners are always on the move!</div>
        </div>
        <div className="feature-card" style={{ flex: '1 1 220px', minWidth: 220, background: '#FFF8F0', borderRadius: 18, boxShadow: '0 2px 12px rgba(246, 71, 65, 0.07)', padding: 28, textAlign: 'center' }}>
          <div className="feature-title" style={{ fontSize: 28, fontWeight: 700, color: '#D64541', marginBottom: 10 }}><span className="feature-icon">🌱</span> Fresh & Hygienic</div>
          <div className="feature-desc" style={{ color: '#555' }}>We partner with the best kitchens to ensure every meal is prepared with the highest standards of hygiene and quality.</div>
      </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <nav style={{ textAlign: 'center', margin: '20px 0' }}>
        <Link to="/" className="btn secondary" style={{ marginRight: 8 }}>Home</Link>
        <Link to="/order" className="btn secondary" style={{ marginRight: 8 }}>Order</Link>
        <Link to="/kitchen" className="btn secondary" style={{ marginRight: 8 }}>Kitchen</Link>
        <Link to="/billing" className="btn secondary">Billing</Link>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderMenu />} />
          <Route path="/kitchen" element={<section className='full-width-card'><KitchenPage /></section>} />
          <Route path="/billing" element={<BillingPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
