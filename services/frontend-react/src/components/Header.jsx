function Header() {
  return (
    <header className="header" style={{ background: 'linear-gradient(90deg, #fff8f0 0%, #f9a825 100%)', color: '#D64541', borderBottom: '4px solid #D64541', boxShadow: '0 2px 12px rgba(59,130,246,0.08)', padding: '36px 0 24px 0' }}>
      <div className="container">
        <h1 className="brand-title" style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: 2, color: '#D64541', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          AM<sup style={{ fontSize: '1.5rem', verticalAlign: 'super' }}>2</sup>
        </h1>
        <div style={{ fontSize: '1.2rem', color: '#7F8C8D', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>
          India’s most vibrant online restaurant – discover, order, and enjoy a world of flavors!<br/>
          Fast delivery, real-time kitchen tracking, and seamless billing. Experience food, reimagined.
        </div>
      </div>
    </header>
  );
}

export default Header; 