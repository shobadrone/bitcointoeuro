import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const BITFINEX_API_URL = 'https://api-pub.bitfinex.com/v2';

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

// Fallback function using Bitfinex API in case the main API is down
export async function getBitcoinPriceFallback(): Promise<BitcoinPriceData> {
  try {
    // Bitfinex ticker endpoint for BTC/EUR pair (tBTCEUR)
    const response = await axios.get(
      `${BITFINEX_API_URL}/ticker/tBTCEUR`
    );
    
    if (!Array.isArray(response.data) || response.data.length < 7) {
      throw new Error('Invalid response from Bitfinex API');
    }
    
    // Bitfinex ticker format: [BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_RELATIVE, LAST_PRICE]
    const lastPrice = response.data[6];
    const dailyChangePercentage = response.data[5] * 100; // Convert to percentage
    
    return {
      eur: lastPrice,
      eur_24h_change: dailyChangePercentage,
      last_updated_at: Math.floor(Date.now() / 1000)
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price from Bitfinex:', error);
    throw error;
  }
}