"use client";

import { useEffect, useState } from 'react';
import useBitcoinPrice from '@/lib/api/useBitcoinPrice';

export default function Calculator() {
  const { price, isLoading } = useBitcoinPrice(30000); // Update every 30 seconds
  const [btcAmount, setBtcAmount] = useState<string>("0.5"); // Default value 0.5 BTC
  const [eurAmount, setEurAmount] = useState<string>("");
  const [isConvertingToEur, setIsConvertingToEur] = useState<boolean>(true); // BTC to EUR by default
  
  // Format BTC with up to 8 decimal places (satoshi level)
  const formatBTC = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8
    });
  };
  
  // Format EUR with 2 decimal places
  const formatEUR = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Handle BTC input change
  const handleBtcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or valid number with up to 8 decimal places
    if (value === '' || /^\d*\.?\d{0,8}$/.test(value)) {
      setBtcAmount(value);
      if (price && value !== '') {
        const btcValue = parseFloat(value);
        setEurAmount(formatEUR(btcValue * price.eur));
      } else {
        setEurAmount('');
      }
    }
  };
  
  // Handle EUR input change
  const handleEurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty or valid number with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setEurAmount(value);
      if (price && value !== '') {
        const eurValue = parseFloat(value);
        setBtcAmount(formatBTC(eurValue / price.eur));
      } else {
        setBtcAmount('');
      }
    }
  };
  
  // Toggle conversion direction
  const toggleConversion = () => {
    // Just flip the direction flag without changing the current values
    setIsConvertingToEur(!isConvertingToEur);
    
    // No need to recalculate values since we'll maintain the existing amounts
  };
  
  // Update calculations only when price changes, not when direction changes
  useEffect(() => {
    if (price) {
      // Only update if we have a primary value to calculate from
      if (isConvertingToEur && btcAmount) {
        const btcValue = parseFloat(btcAmount);
        if (!isNaN(btcValue)) {
          setEurAmount(formatEUR(btcValue * price.eur));
        }
      } else if (!isConvertingToEur && eurAmount) {
        const eurValue = parseFloat(eurAmount);
        if (!isNaN(eurValue)) {
          setBtcAmount(formatBTC(eurValue / price.eur));
        }
      }
    }
  }, [price]); // Only depend on price changes, not direction changes
  
  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      padding: '26px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '640px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 600, 
        color: 'var(--foreground)',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Bitcoin / Euro Calculator
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Calculator inputs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Conditionally render inputs based on conversion direction */}
          {isConvertingToEur ? (
            <>
              {/* BTC Input (From) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label 
                  htmlFor="btc-input" 
                  style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--muted)'
                  }}
                >
                  Bitcoin (BTC)
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <input
                    id="btc-input"
                    type="text"
                    value={btcAmount}
                    onChange={handleBtcChange}
                    disabled={false}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--card-background)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter BTC amount"
                  />
                </div>
              </div>
              
              {/* Toggle Switch */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0.5rem 0'
              }}>
                <button
                  onClick={toggleConversion}
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" 
                    height="20" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ margin: '0 4px' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, marginLeft: '4px' }}>
                    BTC → EUR
                  </span>
                </button>
              </div>
              
              {/* EUR Input (To) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label
                  htmlFor="eur-input"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--muted)'
                  }}
                >
                  Euro (EUR)
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <input
                    id="eur-input"
                    type="text"
                    value={eurAmount}
                    onChange={handleEurChange}
                    disabled={true}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter EUR amount"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* EUR Input (From) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label
                  htmlFor="eur-input"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--muted)'
                  }}
                >
                  Euro (EUR)
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <input
                    id="eur-input"
                    type="text"
                    value={eurAmount}
                    onChange={handleEurChange}
                    disabled={false}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--card-background)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter EUR amount"
                  />
                </div>
              </div>
              
              {/* Toggle Switch */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '0.5rem 0'
              }}>
                <button
                  onClick={toggleConversion}
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" 
                    height="20" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ margin: '0 4px' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, marginLeft: '4px' }}>
                    EUR → BTC
                  </span>
                </button>
              </div>
              
              {/* BTC Input (To) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <label 
                  htmlFor="btc-input" 
                  style={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--muted)'
                  }}
                >
                  Bitcoin (BTC)
                </label>
                <div style={{
                  position: 'relative'
                }}>
                  <input
                    id="btc-input"
                    type="text"
                    value={btcAmount}
                    onChange={handleBtcChange}
                    disabled={true}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter BTC amount"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Exchange CTA */}
        <div style={{
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <a
            href="https://www.binance.com/en/trade/BTC_EUR"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white',
              padding: '12px 24px',
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
            Exchange BTC ⇄ EUR now
          </a>
        </div>
        
        {/* Rate information */}
        <div style={{
          marginTop: '0.5rem',
          textAlign: 'center',
          color: 'var(--muted)',
          fontSize: '0.875rem'
        }}>
          <p>
            {isLoading ? 'Loading current rate...' : 
            isConvertingToEur ?
              `Current rate: 1 BTC = ${price ? 
                new Intl.NumberFormat('de-DE', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(price.eur) : 'Loading...'}` :
              `Current rate: 1 EUR = ${price ? 
                formatBTC(1 / price.eur) + ' BTC' : 'Loading...'}`
            }
          </p>
        </div>
      </div>
    </div>
  );
}