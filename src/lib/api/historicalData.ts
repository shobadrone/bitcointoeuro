import axios from 'axios';
import { BitcoinPriceData } from './pricedata_fetch';
import { getLiveCoinWatchHistorical } from './livecoinwatch';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export type TimeFrame = '7d' | '60d' | '1y' | '5y';

export interface HistoricalPricePoint {
  timestamp: number; // Unix timestamp in milliseconds
  price: number;     // Price in EUR
}

export interface HistoricalPriceData {
  data: HistoricalPricePoint[];
  timeFrame: TimeFrame;
  changePercentage: number; // Price change percentage over the timeframe
}

// Fetch historical price data from CoinGecko
export async function getHistoricalPriceData(
  timeFrame: TimeFrame,
  currentPrice?: BitcoinPriceData
): Promise<HistoricalPriceData> {
  console.log('[DEBUG] getHistoricalPriceData called with timeFrame:', timeFrame);
  console.log('[DEBUG] currentPrice available:', currentPrice ? 'yes' : 'no');
  
  try {
    let days: number;
    let interval: string;
    
    // Set parameters based on timeframe
    switch (timeFrame) {
      case '7d':
        days = 7;
        interval = 'daily';
        break;
      case '60d':
        days = 60;
        interval = 'daily';
        break;
      case '1y':
        days = 365;
        interval = 'weekly';
        break;
      case '5y':
        days = 1825; // 5 years approximately
        interval = 'monthly';
        break;
      default:
        days = 60;
        interval = 'daily';
    }
    
    console.log('[DEBUG] Fetching from CoinGecko:', { days, interval });
    
    const response = await axios.get(
      `${COINGECKO_API_URL}/coins/bitcoin/market_chart`,
      {
        params: {
          vs_currency: 'eur',
          days: days,
          interval: interval
        }
      }
    );
    
    console.log('[DEBUG] CoinGecko API response received:', {
      status: response.status,
      hasData: response.data ? 'yes' : 'no',
      hasPrices: response.data?.prices ? 'yes' : 'no',
      dataPointCount: response.data?.prices?.length || 0
    });

    if (!response.data || !response.data.prices || !Array.isArray(response.data.prices)) {
      throw new Error('Invalid response from CoinGecko API');
    }

    // Process the data - CoinGecko returns [timestamp, price] pairs
    let priceData = response.data.prices.map((point: [number, number]) => ({
      timestamp: point[0],
      price: point[1]
    }));

    // Calculate change percentage (last point compared to first point)
    const firstPrice = priceData[0]?.price || 0;
    let lastPrice: number;

    // If we have current price data, use it for the most recent point
    if (currentPrice && currentPrice.eur) {
      // Replace the last data point with current price
      lastPrice = currentPrice.eur;
      
      if (priceData.length > 0) {
        // Update the last historical point with current data
        const mostRecentHistoricalPoint = priceData[priceData.length - 1];
        priceData[priceData.length - 1] = {
          timestamp: mostRecentHistoricalPoint.timestamp,
          price: currentPrice.eur
        };
      }
    } else {
      lastPrice = priceData[priceData.length - 1]?.price || 0;
    }

    const changePercentage = firstPrice > 0 
      ? ((lastPrice - firstPrice) / firstPrice) * 100 
      : 0;

    return {
      data: priceData,
      timeFrame,
      changePercentage
    };
  } catch (error) {
    console.error('Error fetching historical price data from CoinGecko:', error);
    // Add a small delay to avoid overwhelming the fallback API
    await new Promise(resolve => setTimeout(resolve, 300));
    return await getHistoricalPriceDataFallback(timeFrame, currentPrice);
  }
}

// Fallback function using LiveCoinWatch API in case the main API is down
export async function getHistoricalPriceDataFallback(
  timeFrame: TimeFrame,
  currentPrice?: BitcoinPriceData
): Promise<HistoricalPriceData> {
  console.log('[DEBUG] Fallback function called for timeFrame:', timeFrame);
  console.log('[DEBUG] LCW API KEY present:', process.env.NEXT_PUBLIC_LCW_API_KEY ? 'yes' : 'no');
  
  try {
    // Get historical data from LiveCoinWatch
    console.log('[DEBUG] Attempting to fetch data from LiveCoinWatch...');
    const priceData = await getLiveCoinWatchHistorical(timeFrame);

    // Calculate change percentage
    const firstPrice = priceData[0]?.price || 0;
    let lastPrice: number;

    // If we have current price data, use it for the most recent point
    if (currentPrice && currentPrice.eur) {
      lastPrice = currentPrice.eur;
      
      if (priceData.length > 0) {
        // Update the last historical point with current data
        const mostRecentHistoricalPoint = priceData[priceData.length - 1];
        priceData[priceData.length - 1] = {
          timestamp: mostRecentHistoricalPoint.timestamp,
          price: currentPrice.eur
        };
      }
    } else {
      lastPrice = priceData[priceData.length - 1]?.price || 0;
    }

    const changePercentage = firstPrice > 0 
      ? ((lastPrice - firstPrice) / firstPrice) * 100 
      : 0;

    return {
      data: priceData,
      timeFrame,
      changePercentage
    };
  } catch (error) {
    console.error('Error fetching historical price data from LiveCoinWatch:', error);
    
    // Return empty data in case of complete failure
    return {
      data: [],
      timeFrame,
      changePercentage: 0
    };
  }
}