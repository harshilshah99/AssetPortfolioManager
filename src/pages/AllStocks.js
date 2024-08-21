import { LineChart } from '@mui/x-charts';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Container, Spinner } from 'react-bootstrap';
import './css/allstocks.css'; // Import the custom CSS file
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AllStocks() {
  const [selectedStock, setSelectedStock] = useState(null); // State to store selected stock name
  const [stockData, setStockData] = useState([]); // State to store fetched stock data
  const [stockInfo, setStockInfo] = useState(null); // State to store stock overview data
  const [filteredStockData, setFilteredStockData] = useState([]); // State to store filtered stock data
  const [timeFrame, setTimeFrame] = useState(5); // State for selected time frame
  const containerRef = useRef(null);
  const [allStocks, setAllStocks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8100/stocks');
        const data = await response.json();
        setAllStocks(data);
        setLoading(false); // Data is loaded, set loading to false
      } catch (error) {
        console.error('Error:', error);
        setLoading(false); // Ensure loading is stopped even if there's an error
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = async (searchQuery) => {
    setSelectedStock(searchQuery);
    await fetchStockData(searchQuery);
  };

  const handleCardClick = async (name) => {
    setSelectedStock(name);
    await fetchStockData(name);
  };

  const fetchStockData = async (symbol) => {
    try {
      const timeSeriesResponse = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${symbol}&apikey=5ZAGZACTOBA80S1T`);
      const timeSeriesData = await timeSeriesResponse.json();
      const overviewResponse = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=5ZAGZACTOBA80S1T`);
      const overviewData = await overviewResponse.json();

      if (timeSeriesData['Time Series (Daily)']) {
        const dailyData = timeSeriesData['Time Series (Daily)'];
        const transformedData = Object.entries(dailyData).map(([date, values]) => ({
          date,
          close: parseFloat(values['4. close'])
        }));
        const latestData = transformedData.slice(0, 100);
        if (latestData.some(item => isNaN(item.close))) {
          console.error('Invalid data detected:', latestData);
          return;
        }
        setStockData(latestData);
        filterDataByTimeFrame(latestData, timeFrame);
      }
      setStockInfo(overviewData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const filterDataByTimeFrame = (data, days) => {
    const filteredData = data.slice(0, days);
    setFilteredStockData(filteredData);
  };

  const handleTimeFrameChange = (days) => {
    setTimeFrame(days);
    filterDataByTimeFrame(stockData, days);
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: clientWidth,
        behavior: 'smooth'
      });
      if (containerRef.current.scrollLeft + clientWidth >= scrollWidth) {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <TopNavbar onSearchSubmit={handleSearchSubmit} />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Order Book Component */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Container
                fluid
                className="scrollable-cards"
                ref={containerRef}
              >
                {allStocks.map((stock, index) => (
                  <Card
                    key={index}
                    style={{ width: '10rem', margin: '0.5rem' }}
                    onClick={() => handleCardClick(stock.tickerSymbol)} // Handle card click
                  >
                    <Card.Body>
                      <Card.Title>{stock.tickerSymbol}</Card.Title>
                      <Card.Text>
                        {stock.currentPrice}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Container>
              <Button
                style={{ backgroundColor: '#00000029', borderRadius: '50%', border: 'none',top:60 }}
                className="scroll-button"
                onClick={scrollRight}
              >
                <box-icon name='chevron-right' size='md'></box-icon>
              </Button>
            <div style={{marginLeft: '10px', fontStyle:'italic'}}>All prices in USD ($)</div>
              {selectedStock && filteredStockData.length > 0 && (
                <div style={{ display: 'flex', margin: '1rem 0' }}>
                  <LineChart
                    dataset={filteredStockData}
                    xAxis={[
                      {
                        scaleType: 'band',
                        dataKey: 'date',
                        label: 'Date',
                        tickFormat: (value) => new Date(value).toLocaleDateString(), // Format date labels
                      },
                    ]}
                    series={[
                      {
                        dataKey: 'close',
                        label: 'Price',
                        color: '#3f51b5',
                      },
                    ]}
                    height={330}
                    width={750}
                    margin={{ left: 50, right: 30, top: 50, bottom: 50 }}
                    grid={{ vertical: true, horizontal: true }}
                  />
                    <div className="d-flex flex-row align-items-center" style={{ marginRight: '1rem' }}>
                    <ButtonGroup vertical>
                      <Button variant="outline-primary" onClick={() => handleTimeFrameChange(5)}>5days</Button>
                      <Button variant="outline-primary" onClick={() => handleTimeFrameChange(30)}>1month</Button>
                      <Button variant="outline-primary" onClick={() => handleTimeFrameChange(90)}>3month</Button>
                    </ButtonGroup>
                  </div>
            
                  <Card style={{ width: '20%', marginRight: '1rem' }}>
                    <Card.Body>
                      <Card.Title>{selectedStock}</Card.Title>
                      {stockInfo && (
                        <>
                          <Card.Text>Name: {stockInfo.Name}</Card.Text>
                          <Card.Text>Exchange: {stockInfo.Exchange}</Card.Text>
                          <Card.Text>EPS: {stockInfo.EPS}</Card.Text>
                          <Card.Text>ProfitMargin: {stockInfo.ProfitMargin}</Card.Text>
                          <Card.Text>52WeekHigh: {stockInfo['52WeekHigh']}</Card.Text>
                          <Card.Text>52WeekLow: {stockInfo['52WeekLow']}</Card.Text>
                          {/* Add other stock info fields as needed */}
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}