"use client";

export default function Hero() {
  return (
    <div style={{
      padding: '4rem 0 4.2rem', // Reduced padding bottom by 30%
      background: 'var(--background)',
      position: 'relative'
    }}>
      <div className="container">
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
            fontWeight: 700,
            color: 'var(--foreground)',
            margin: '0 0 1.5rem',
            lineHeight: 1.2
          }}>
            <span>Bitcoin to Euro </span>
            <span style={{ color: 'var(--accent)' }}>Information</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--muted)',
            margin: '0 0 2.5rem',
            lineHeight: 1.6
          }}>
            Current BTC to EUR rates, simple conversion tools, and trusted exchange information.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <a href="#calculator" 
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s ease',
                border: 'none',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Use Calculator
            </a>
            <a href="#price-chart" 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--foreground)',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.2s ease',
                border: 'none',
                fontSize: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Price Chart
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}