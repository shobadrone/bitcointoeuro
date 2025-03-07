"use client";

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '4rem 0 2rem',
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--foreground)'
            }}>
              bitcointoeuro.com
            </h3>
            <p style={{
              color: 'var(--muted)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '1rem'
            }}>
              Real-time Bitcoin to Euro conversion with accurate price data, trends, and trusted resources.
            </p>
          </div>
          
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--foreground)'
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <li>
                <Link 
                  href="/" 
                  style={{
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="#calculator" 
                  style={{
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
                >
                  Bitcoin Calculator
                </Link>
              </li>
              <li>
                <Link 
                  href="#about" 
                  style={{
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--foreground)'
            }}>
              Data Sources
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <li>
                <a 
                  href="https://www.coingecko.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
                >
                  CoinGecko API
                </a>
              </li>
              <li>
                <a 
                  href="https://www.livecoinwatch.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s ease',
                    display: 'inline-block'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
                >
                  LiveCoinWatch API
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.5rem',
          marginTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.875rem'
          }}>
            © {currentYear} bitcointoeuro.com. All rights reserved.
          </p>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.875rem'
          }}>
            Cryptocurrency prices are provided for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}