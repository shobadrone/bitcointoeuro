"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useHistoricalPrices from '@/lib/api/useHistoricalPrices';
import { TimeFrame, HistoricalPricePoint } from '@/lib/api/historicalData';

// Simple fallback chart component that uses basic HTML/CSS/SVG when Chart.js fails
const SimpleFallbackChart = ({ data }: { data: HistoricalPricePoint[] }) => {
  if (!data || data.length === 0) return null;
  
  // Find min and max for scaling
  const prices = data.map(point => point.price);
  const minPrice = Math.min(...prices) * 0.99; // Add 1% padding
  const maxPrice = Math.max(...prices) * 1.01; // Add 1% padding
  const range = maxPrice - minPrice;
  
  // Create a simple line path for the SVG
  const svgWidth = 600;
  const svgHeight = 280;
  const padding = 30; // Increased padding for axis labels
  
  // Generate path points
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - ((point.price - minPrice) / range) * (svgHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  // Generate grid lines
  const horizontalGridLines = [];
  const gridLineCount = 5;
  for (let i = 0; i <= gridLineCount; i++) {
    const y = svgHeight - padding - (i / gridLineCount) * (svgHeight - 2 * padding);
    horizontalGridLines.push(
      <line 
        key={`h-grid-${i}`}
        x1={padding} 
        y1={y} 
        x2={svgWidth - padding} 
        y2={y} 
        stroke="rgba(75, 85, 99, 0.1)" 
        strokeWidth="1"
      />
    );
  }
  
  // Format price for axis labels
  const formatEuro = (price: number) => {
    if (price >= 10000) {
      return `€${(price / 1000).toFixed(0)}k`;
    } else {
      return `€${price.toFixed(0)}`;
    }
  };
  
  // Generate price labels for y-axis
  const yAxisLabels = [];
  for (let i = 0; i <= gridLineCount; i++) {
    const price = minPrice + (i / gridLineCount) * range;
    const y = svgHeight - padding - (i / gridLineCount) * (svgHeight - 2 * padding);
    yAxisLabels.push(
      <text 
        key={`y-label-${i}`}
        x={padding - 5} 
        y={y + 4} 
        fontSize="10" 
        textAnchor="end" 
        fill="rgba(156, 163, 175, 0.9)"
      >
        {formatEuro(price)}
      </text>
    );
  }
  
  // Generate date labels for x-axis (simplified to first, middle, last)
  const xAxisLabels = [0, Math.floor(data.length / 2), data.length - 1].map((index) => {
    const date = new Date(data[index].timestamp);
    const formattedDate = date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      ...(data.length > 30 && { year: 'numeric' }) 
    });
    
    const x = padding + (index / (data.length - 1)) * (svgWidth - 2 * padding);
    return (
      <text 
        key={`x-label-${index}`}
        x={x} 
        y={svgHeight - padding + 15} 
        fontSize="10" 
        textAnchor="middle" 
        fill="rgba(156, 163, 175, 0.9)"
      >
        {formattedDate}
      </text>
    );
  });
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
        {/* Grid lines */}
        {horizontalGridLines}
        
        {/* Y-axis labels */}
        {yAxisLabels}
        
        {/* X-axis labels */}
        {xAxisLabels}
        
        {/* Fill area under the line */}
        <polygon
          points={`${padding},${svgHeight - padding} ${points} ${svgWidth - padding},${svgHeight - padding}`}
          fill="rgba(59, 130, 246, 0.1)"
        />
        
        {/* Line chart */}
        <polyline
          points={points}
          fill="none"
          stroke="rgba(59, 130, 246, 0.8)"
          strokeWidth="2"
        />
        
        {/* Axis lines */}
        <line 
          x1={padding} 
          y1={svgHeight - padding} 
          x2={svgWidth - padding} 
          y2={svgHeight - padding} 
          stroke="rgba(75, 85, 99, 0.2)" 
          strokeWidth="1"
        />
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={svgHeight - padding} 
          stroke="rgba(75, 85, 99, 0.2)" 
          strokeWidth="1"
        />
      </svg>
      
      {/* Price change percentage */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '4px 8px',
        borderRadius: '4px',
        color: 'white',
        fontSize: '12px'
      }}>
        Latest: €{data[data.length - 1].price.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('60d');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLoadingState, setShowLoadingState] = useState<boolean>(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { historicalData, isLoading: isDataLoading, isError, mutate } = useHistoricalPrices(selectedTimeFrame);
  
  // Force refresh when timeframe changes
  const handleTimeFrameChange = (newTimeFrame: TimeFrame) => {
    setSelectedTimeFrame(newTimeFrame);
    
    // Set a small timeout to ensure the SWR key has updated before mutating
    setTimeout(() => {
      mutate();
    }, 50);
  };
  
  // Handle loading states with a delay to prevent flickering for fast loads
  useEffect(() => {
    if (isDataLoading) {
      // Only show loading state if it takes more than 300ms
      loadingTimerRef.current = setTimeout(() => {
        setShowLoadingState(true);
      }, 300);
      setIsLoading(true);
    } else {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      setShowLoadingState(false);
      setIsLoading(false);
    }
    
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [isDataLoading]);
  
  // Force initial data fetch when component mounts
  useEffect(() => {
    // Small delay to ensure other hooks have initialized
    const timer = setTimeout(() => {
      console.log('[DEBUG] PriceChart: Triggering initial data fetch');
      console.log('[DEBUG] ENV VAR CHECK:', process.env.NEXT_PUBLIC_LCW_API_KEY ? 'API key is set' : 'API key is NOT set');
      mutate();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [mutate]);
  
  // State to determine if Chart.js is working
  const [chartJsWorks, setChartJsWorks] = useState<boolean | null>(null);
  const chartJsContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if Chart.js is rendering after a short delay
  useEffect(() => {
    if (!historicalData?.data?.length) return;
    
    const timer = setTimeout(() => {
      // If the Chart.js container has a canvas child, it's working
      if (chartJsContainerRef.current) {
        const canvas = chartJsContainerRef.current.querySelector('canvas');
        const hasCanvas = !!canvas;
        const canvasHasSize = canvas && (canvas.width > 0 || canvas.height > 0);
        setChartJsWorks(hasCanvas && canvasHasSize);
        console.log('[DEBUG] Chart.js check:', { 
          hasCanvas, 
          canvasHasSize,
          width: canvas?.width,
          height: canvas?.height
        });
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [historicalData]);
  
  // Add detailed component state logging
  useEffect(() => {
    console.log('[DEBUG] PriceChart state:', {
      selectedTimeFrame,
      isLoading,
      isDataLoading,
      isError,
      hasData: historicalData ? `${historicalData.data?.length || 0} points` : 'No data',
      chartJsWorks,
    });
  }, [selectedTimeFrame, isLoading, isDataLoading, isError, historicalData, chartJsWorks]);

  // Format data for Chart.js
  const formatChartData = () => {
    if (!historicalData || !historicalData.data || historicalData.data.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        }]
      };
    }

    // Format dates based on timeframe
    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      
      switch (selectedTimeFrame) {
        case '7d':
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        case '60d':
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        case '1y':
          // For 1 year, we want to show the first day of the week
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        case '5y':
          // For 5 years, only show month and year
          return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        default:
          return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      }
    };

    const labels = historicalData.data.map(point => formatDate(point.timestamp));
    const prices = historicalData.data.map(point => point.price);

    return {
      labels,
      datasets: [
        {
          label: 'Bitcoin Price (EUR)',
          data: prices,
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: (ctx) => {
            // Show points only at start, end, and if there are few data points
            const count = ctx.chart.data.labels?.length || 0;
            if (count < 15) return 3;
            
            const index = ctx.dataIndex;
            return (index === 0 || index === count - 1) ? 4 : 0;
          },
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            if (!context || context.length === 0) return '';
            
            const date = new Date(historicalData?.data[context[0].dataIndex]?.timestamp || 0);
            
            // Format tooltip date based on timeframe
            switch (selectedTimeFrame) {
              case '7d':
              case '60d':
                return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              case '1y':
                // For year view, show the week number and date
                return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              case '5y':
                // For 5-year view, show month and year only
                return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
              default:
                return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            }
          },
          label: function(context: any) {
            return `${new Intl.NumberFormat('de-DE', { 
              style: 'currency', 
              currency: 'EUR' 
            }).format(context.raw)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.9)',
          font: {
            size: 10,
          },
          maxRotation: 0,
          maxTicksLimit: 12, // Limit the number of X-axis labels
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.9)',
          callback: function(value: any) {
            return new Intl.NumberFormat('de-DE', { 
              style: 'currency', 
              currency: 'EUR',
              notation: 'compact' 
            }).format(value);
          },
          font: {
            size: 10,
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4, // Smoother curves
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  const timeFrameLabels = {
    '7d': '7 Days',
    '60d': '60 Days',
    '1y': '1 Year',
    '5y': '5 Years'
  };

  // Format percentage change with + or - sign
  const formatPercentageChange = (value: number) => {
    const formattedValue = value.toFixed(2);
    return value >= 0 
      ? `+${formattedValue}%` 
      : `${formattedValue}%`;
  };

  return (
    <div id="price-chart" style={{
      backgroundColor: 'var(--card-background)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      padding: '26px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '640px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          color: 'var(--foreground)',
          margin: 0
        }}>
          Bitcoin Price History
        </h2>
        
        {!isLoading && historicalData && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--muted)',
            }}>
              {selectedTimeFrame} change:
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: historicalData.changePercentage >= 0 ? 'var(--success)' : 'var(--error)',
              padding: '4px 8px',
              backgroundColor: historicalData.changePercentage >= 0 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '4px'
            }}>
              {formatPercentageChange(historicalData.changePercentage)}
            </span>
          </div>
        )}
      </div>
      
      <div style={{
        height: '300px', // Fixed height for desktop
        position: 'relative',
        margin: '0 auto'
      }}>
        {showLoadingState ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(59, 130, 246, 0.1)',
              borderTop: '3px solid rgba(59, 130, 246, 0.8)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : isError ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'var(--error)'
          }}>
            <p>Failed to load price history data.</p>
            <button 
              onClick={() => handleTimeFrameChange(selectedTimeFrame)} // This will trigger a refresh
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              Try Again
            </button>
          </div>
        ) : (!historicalData || !historicalData.data || historicalData.data.length === 0) ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
            color: 'var(--error)'
          }}>
            <p>No chart data available.</p>
            <button 
              onClick={() => handleTimeFrameChange(selectedTimeFrame)}
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 999, backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px', fontSize: '10px' }}>
              Debug: {historicalData.data.length} points | {selectedTimeFrame}
            </div>
            
            {/* Chart container */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* First attempt with Chart.js */}
              {(chartJsWorks === null || chartJsWorks === true) && (
                <div 
                  ref={chartJsContainerRef}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    zIndex: chartJsWorks ? 2 : 1 
                  }}
                >
                  <Line data={formatChartData()} options={options} />
                </div>
              )}
              
              {/* SVG Fallback if Chart.js fails or is still loading */}
              {(chartJsWorks === false || chartJsWorks === null) && (
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%',
                  zIndex: chartJsWorks === false ? 2 : 1
                }}>
                  <SimpleFallbackChart data={historicalData.data} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Time frame selection buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1.5rem',
        gap: '0.5rem'
      }}>
        {(['7d', '60d', '1y', '5y'] as TimeFrame[]).map((timeFrame) => (
          <button
            key={timeFrame}
            onClick={() => handleTimeFrameChange(timeFrame)}
            style={{
              backgroundColor: selectedTimeFrame === timeFrame 
                ? 'rgba(59, 130, 246, 0.8)' 
                : 'rgba(59, 130, 246, 0.1)',
              color: selectedTimeFrame === timeFrame 
                ? 'white' 
                : 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (selectedTimeFrame !== timeFrame) {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (selectedTimeFrame !== timeFrame) {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              }
            }}
          >
            {timeFrameLabels[timeFrame]}
          </button>
        ))}
      </div>
    </div>
  );
}