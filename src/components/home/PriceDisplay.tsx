"use client";

import { useEffect, useState } from 'react';
import useBitcoinPrice from '@/lib/api/useBitcoinPrice';

export default function PriceDisplay() {
  const { price, isLoading, isError } = useBitcoinPrice(30000); // Update every 30 seconds
  const [formattedPrice, setFormattedPrice] = useState('Loading...');
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    if (price) {
      // Format price with thousands separator and 2 decimal places
      setFormattedPrice(
        new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(price.eur)
      );

      // Update price change percentage
      setPriceChange(price.eur_24h_change || null);

      // Format last updated time
      const date = new Date(price.last_updated_at * 1000);
      setLastUpdated(
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    }
  }, [price]);

  return (
    <div style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      padding: '26px', // Reduced padding
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '640px', // Reduced width by 20%
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{ 
          fontSize: '1.15rem', 
          fontWeight: 600, 
          color: 'var(--muted)',
          marginBottom: '0.75rem'
        }}>
          Current Bitcoin Price
        </h2>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem'
        }}>
          <span style={{ 
            fontSize: '2rem', // Reduced font size
            fontWeight: 700, 
            color: 'var(--foreground)'
          }}>
            {isLoading ? 'Loading...' : formattedPrice}
          </span>
          
          {priceChange !== null && !isLoading && (
            <span 
              style={{ 
                marginLeft: '1rem',
                fontWeight: 600,
                fontSize: '1rem',
                color: priceChange >= 0 ? 'var(--success)' : 'var(--error)',
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: priceChange >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              }}
            >
              {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          )}
        </div>
        
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            padding: '4px 16px',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '9999px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: 'var(--accent)',
            marginBottom: '0.75rem'
          }}>
            24h Change
          </span>
          <div style={{ 
            fontSize: '0.875rem',
            color: 'var(--muted)'
          }}>
            Updated at: {lastUpdated || 'Loading...'}
          </div>
        </div>
        
        {isError && (
          <div style={{
            marginTop: '1rem',
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>
              Unable to fetch current price. Please try again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}