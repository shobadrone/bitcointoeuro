import axios from 'axios';
import { getLiveCoinWatchPrice } from './livecoinwatch';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export interface BitcoinPriceData {
  eur: number;
  eur_24h_change?: number;
  last_updated_at: number;
}

export async function getBitcoinPrice(): Promise<BitcoinPriceData> {
  try {
    const response = await axios.get(
      `${COINGECKO_API_URL}/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true&include_last_updated_at=true`
    );
    
    if (!response.data || !response.data.bitcoin) {
      throw new Error('Invalid response from CoinGecko API');
    }
    
    return response.data.bitcoin as BitcoinPriceData;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
}

// Fallback function using LiveCoinWatch API in case the main API is down
export async function getBitcoinPriceFallback(): Promise<BitcoinPriceData> {
  try {
    // Use LiveCoinWatch as fallback
    return await getLiveCoinWatchPrice();
  } catch (error) {
    console.error('Error fetching Bitcoin price from LiveCoinWatch:', error);
    throw error;
  }
}