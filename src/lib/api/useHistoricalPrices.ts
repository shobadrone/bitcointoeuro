import useSWR from 'swr';
import { useEffect } from 'react';
import { getHistoricalPriceData, TimeFrame, HistoricalPriceData } from './historicalData';
import useBitcoinPrice from './useBitcoinPrice';

// Create a fetcher function that includes current price data and uses the timeframe
const createFetcher = (currentPrice: any, timeFrameParam: TimeFrame) => {
  return async (): Promise<HistoricalPriceData> => {
    // Pass the specific timeframe to ensure we get the right data
    return await getHistoricalPriceData(timeFrameParam, currentPrice);
  };
};

export default function useHistoricalPrices(timeFrame: TimeFrame = '60d') {
  // Get current price data to use for the most recent point
  const { price: currentPrice } = useBitcoinPrice();
  
  // Debug logging for hook initialization
  useEffect(() => {
    console.log('[DEBUG] useHistoricalPrices hook initialized:', { 
      timeFrame,
      currentPriceAvailable: currentPrice ? 'yes' : 'no',
      env: typeof window !== 'undefined' ? 'client' : 'server'
    });
  }, [timeFrame, currentPrice]);
  
  // Fetch historical data with very aggressive caching (much longer than real-time price)
  // Use timeFrame in the key to ensure different caching per timeframe
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `historical-prices-${timeFrame}`,
    // Still try to fetch data even if currentPrice is not available
    async () => {
      console.log('[DEBUG] SWR fetcher function called for timeFrame:', timeFrame);
      try {
        const result = await getHistoricalPriceData(timeFrame, currentPrice);
        console.log('[DEBUG] SWR fetcher got result:', {
          hasData: result ? 'yes' : 'no',
          points: result?.data?.length || 0
        });
        return result;
      } catch (err) {
        console.error('[DEBUG] SWR fetcher error:', err instanceof Error ? err.message : 'Unknown error');
        throw err;
      }
    },
    {
      refreshInterval: 3600000, // Refresh every hour (much less frequent than current price)
      revalidateOnFocus: false, // Don't revalidate on focus for historical data
      dedupingInterval: 300000, // 5 minutes deduplication time for switching timeframes
      focusThrottleInterval: 3600000, // Throttle focus revalidation to once per hour
      revalidateIfStale: false, // Don't revalidate stale data automatically
      revalidateOnReconnect: false, // Don't revalidate on reconnect
      
      // Local storage cache provider to persist data between sessions
      provider: () => {
        // Define storage provider to persist cache in localStorage
        const map = new Map(
          JSON.parse(localStorage.getItem('historical-price-cache') || '[]')
        );
        
        // Before unloading the page, save the cache to localStorage
        window.addEventListener('beforeunload', () => {
          const appCache = JSON.stringify(Array.from(map.entries()));
          localStorage.setItem('historical-price-cache', appCache);
        });
        
        return map;
      }
    }
  );

  return {
    historicalData: data,
    isLoading,
    isError: !!error,
    isValidating,
    mutate
  };
}