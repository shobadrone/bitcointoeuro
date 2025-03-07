import useSWR from 'swr';
import { getBitcoinPrice, getBitcoinPriceFallback, BitcoinPriceData } from './pricedata_fetch';

// Create a fetcher function that includes fallback logic
const fetcher = async (): Promise<BitcoinPriceData> => {
  try {
    return await getBitcoinPrice();
  } catch (_error) {
    // If primary source fails, try the fallback
    return await getBitcoinPriceFallback();
  }
};

export default function useBitcoinPrice(refreshInterval = 60000) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    'bitcoin-price',
    fetcher,
    {
      refreshInterval, // Refresh every minute by default
      revalidateOnFocus: false, // Don't revalidate on focus to reduce API calls
      dedupingInterval: 30000, // Deduplicate requests within 30 seconds
      focusThrottleInterval: 60000, // Throttle focus revalidation to once per minute
      errorRetryCount: 3, // Only retry 3 times on error
      
      // Persist cache in localStorage to maintain price data between page loads
      provider: () => {
        // Define storage provider to persist cache in localStorage
        const map = new Map(
          JSON.parse(localStorage.getItem('bitcoin-price-cache') || '[]')
        );
        
        // Before unloading the page, save the cache to localStorage
        window.addEventListener('beforeunload', () => {
          const appCache = JSON.stringify(Array.from(map.entries()));
          localStorage.setItem('bitcoin-price-cache', appCache);
        });
        
        return map;
      }
    }
  );

  return {
    price: data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate
  };
}