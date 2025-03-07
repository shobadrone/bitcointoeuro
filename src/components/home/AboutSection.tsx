"use client";

export default function AboutSection() {
  return (
    <section id="about" style={{
      padding: '5rem 0',
      backgroundColor: 'var(--background)',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      marginTop: '3rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: 'var(--foreground)',
            textAlign: 'center'
          }}>
            About Bitcoin to Euro Conversion
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            color: 'var(--muted)',
            fontSize: '1.125rem',
            lineHeight: 1.7
          }}>
            <p>
              At bitcointoeuro.com, we provide real-time Bitcoin to Euro conversion rates using reliable data from trusted cryptocurrency APIs. Our mission is to offer a simple, fast, and accurate tool for anyone interested in the current Bitcoin valuation in Euros.
            </p>
            
            <p>
              Whether you're a trader tracking market movements, a Bitcoin holder looking to calculate your portfolio's value, or simply curious about the current exchange rate, our platform delivers the information you need instantly.
            </p>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              marginTop: '2rem',
              marginBottom: '1rem',
              color: 'var(--foreground)'
            }}>
              Features Coming Soon
            </h3>
            
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {[
                'Exchange rate comparisons across major platforms',
                'Educational resources about Bitcoin and cryptocurrency'
              ].map((feature, index) => (
                <li key={index} style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <p style={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--accent)'
            }}>
              Our data is sourced from industry-leading APIs including CoinGecko and Bitfinex, ensuring reliability and accuracy in the information we provide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}