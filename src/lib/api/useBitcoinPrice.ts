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
      revalidateOnFocus: true,
      dedupingInterval: 15000, // Deduplicate requests within 15 seconds
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