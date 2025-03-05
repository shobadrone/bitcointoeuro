"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '1rem 0',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-bebas-neue)', 
              fontSize: '2rem', 
              letterSpacing: '1px',
              color: 'var(--foreground)',
              margin: 0
            }}>
              BITCOINTOEURO.COM
            </h1>
          </Link>
        </div>
        
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <Link 
            href="/" 
            style={{
              color: 'var(--foreground)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              background: 'rgba(255, 255, 255, 0.05)',
              position: 'relative',
              zIndex: 10
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            Home
          </Link>
          
          <Link 
            href="#calculator" 
            style={{
              color: 'var(--foreground)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              background: 'rgba(255, 255, 255, 0.05)',
              position: 'relative',
              zIndex: 10
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            Calculator
          </Link>
          
          <Link 
            href="#about" 
            style={{
              color: 'var(--foreground)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              background: 'rgba(255, 255, 255, 0.05)',
              position: 'relative',
              zIndex: 10
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            About
          </Link>
        </nav>
        
        <div style={{ display: 'none' }}>
          <button className="text-[var(--foreground)] p-2" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}