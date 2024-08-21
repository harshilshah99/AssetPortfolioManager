import { LineChart } from '@mui/x-charts';
import React, { useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Card, Container } from 'react-bootstrap';
import './css/allstocks.css'; // Import the custom CSS file
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function AllBonds() {
  const [selectedBond, setSelectedBond] = useState(null); // State to store selected bond name
  const [bondData, setBondData] = useState([]); // State to store fetched bond data
  const [bondInfo, setBondInfo] = useState(null); // State to store bond overview data
  const [filteredBondData, setFilteredBondData] = useState([]); // State to store filtered bond data
  const [timeFrame, setTimeFrame] = useState(5); // State for selected time frame
  const [pinnedBonds, setPinnedBonds] = useState([]); // State for pinned bonds
  const containerRef = useRef(null);
  const [allBonds, setAllBonds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8100/bonds');
        const data = await response.json();
        setAllBonds(data);
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

 const scrollRight = () => {
    console.log("clicked");
  
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const currentScrollLeft = container.scrollLeft;
  
      // Calculate the distance needed to scroll to reach the end
      const distanceToScroll = scrollWidth - currentScrollLeft - clientWidth;
  
      // Smoothly scroll right by the distance required to reach the end
      container.scrollBy({
        left: distanceToScroll,
        behavior: 'smooth'
      });
  
      // Ensure wrapping to the left after scrolling
      const onScrollEnd = () => {
        // Check if we've scrolled to the end
        if (container.scrollLeft + clientWidth >= scrollWidth) {
          // Remove the scroll event listener to avoid multiple triggers
          container.removeEventListener('scroll', onScrollEnd);
          // Smoothly scroll to the start
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }
      };
  
      // Add a scroll event listener to trigger the wrapping logic
      container.addEventListener('scroll', onScrollEnd, { once: true });
    }
  };

  const handleCardClick = async (name) => {
    setSelectedBond(name);
    try {
      // Fetch time series data
      const timeSeriesResponse = await fetch(`http://localhost:8100/bondprices`);
      const timeSeriesData = await timeSeriesResponse.json();
      const filteredData = timeSeriesData.filter(item => item.tickerSymbol === name);
      console.log(filteredData);

      // Fetch bond overview data
      const overviewResponse = await fetch(`http://localhost:8100/bonds`);
      const overviewData = await overviewResponse.json();
      const filteredOverview = overviewData.filter(item => item.tickerSymbol === name);
      console.log(filteredOverview);
      setBondInfo(filteredOverview[0]);

      if (filteredData.length > 0) {
        // Transform the data for the chart
        const transformedData = filteredData.map(item => ({
          date: item.onDate,
          price: parseFloat(item.price)
        }));

        setBondData(transformedData);
        filterDataByTimeFrame(transformedData, timeFrame);
      }
    } catch (error) {
      console.error('Error fetching bond data:', error);
    }
  };

  const filterDataByTimeFrame = (data, days) => {
    const filteredData = data.slice(0, days);
    setFilteredBondData(filteredData);
  };

  const handleTimeFrameChange = (days) => {
    setTimeFrame(days);
    filterDataByTimeFrame(bondData, days);
  };

  const pinBond = (tickerSymbol) => {
    setPinnedBonds((prevPinnedBonds) => [...prevPinnedBonds, tickerSymbol]);
  };

  const unpinBond = (tickerSymbol) => {
    setPinnedBonds((prevPinnedBonds) => prevPinnedBonds.filter((bond) => bond !== tickerSymbol));
  };

  // Sort the bonds: Pinned bonds first, then the rest
  const sortedBonds = [
    ...allBonds.filter((bond) => pinnedBonds.includes(bond.tickerSymbol)),
    ...allBonds.filter((bond) => !pinnedBonds.includes(bond.tickerSymbol))
  ];

  return (
    <>
      <TopNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Order Book Component */}
          <Container
            fluid
            className="scrollable-cards"
            ref={containerRef}
          >
            {sortedBonds.map((bond, index) => (
              <Card
                key={index}
                style={{ width: '10rem', margin: '0.5rem' }}
                onClick={() => handleCardClick(bond.tickerSymbol)} // Handle card click
              >
                <Card.Body>
                  <Card.Title>{bond.tickerSymbol}</Card.Title>
                  <Card.Text>
                    {bond.bondPrice}
                  </Card.Text>
                  {pinnedBonds.includes(bond.tickerSymbol) ? (
                    <Button variant="danger" onClick={(e) => { e.stopPropagation(); unpinBond(bond.tickerSymbol); }}>
                      Unpin
                    </Button>
                  ) : (
                    <Button variant="success" onClick={(e) => { e.stopPropagation(); pinBond(bond.tickerSymbol); }}>
                      Pin
                    </Button>
                  )}
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
          {selectedBond && filteredBondData.length > 0 && (
            <div style={{ display: 'flex', margin: '1rem 0' }}>
              <LineChart
                dataset={filteredBondData}
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
                    dataKey: 'price',
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
                  <Card.Title>{selectedBond}</Card.Title>
                  {bondInfo && (
                    <>
                      <Card.Text>Ticker: {bondInfo.tickerSymbol}</Card.Text>
                      <Card.Text>Issuer: {bondInfo.issuer}</Card.Text>
                      <Card.Text>Face Value: {bondInfo.faceValue}</Card.Text>
                      <Card.Text>Maturity Date: {bondInfo.maturityDate}</Card.Text>
                      <Card.Text>Price: {bondInfo.bondPrice}</Card.Text>
                      <Card.Text>Credit Rating: {bondInfo.creditRating}</Card.Text>
                    </>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
