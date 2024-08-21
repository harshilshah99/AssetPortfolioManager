import { LineChart } from "@mui/x-charts";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import bondMap from "./bondMap";
import "./css/bonds.css";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Bonds() {
  const [selectedBond, setSelectedBond] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const containerRef = useRef(null);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8100/assets/bonds")
      .then((response) => response.json())
      .then((data) => {
        const stocksData = data.filter(
          (asset) => asset.assetClass.toLowerCase() === "bonds"
        );
        setStocks(stocksData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchSubmit = async (searchQuery) => {
    console.log("Search Query:", searchQuery);
    setSelectedBond(searchQuery);
    try {
      const timeSeriesResponse = await fetch(
        `http://localhost:8100/bondprices`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      const overviewResponse = await fetch(
        `http://localhost:8100/bonds`
      );
      const overviewData = await overviewResponse.json();
      const transactionsResponse = await fetch(
        `http://localhost:8100/viewbook/orderbook?bond=${searchQuery}`
      );
      const transactionsData = await transactionsResponse.json();

      // Process the time series data to fit the LineChart format
      const filteredData = timeSeriesData.filter(item => item.tickerSymbol === searchQuery);
      const transformedData = filteredData.map(item => ({
        date: item.onDate,
        close: parseFloat(item.price)
      }));

      setStockData(transformedData);
      setStockInfo(overviewData.find(bond => bond.tickerSymbol === searchQuery));
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth;
      const clientWidth = containerRef.current.clientWidth;
      containerRef.current.scrollBy({
        left: clientWidth,
        behavior: "smooth",
      });
      if (containerRef.current.scrollLeft + clientWidth >= scrollWidth) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  };

  const handleCardClick = async (name) => {
    console.log("Clicked " + name);
    setSelectedBond(name);
    
    try {
      // Fetch and set stock data for the selected bond
      const timeSeriesResponse = await fetch(
        `http://localhost:8100/bondprices`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      const filteredData = timeSeriesData.filter(item => item.tickerSymbol === name);
      const transformedData = filteredData.map(item => ({
        date: item.onDate,
        close: parseFloat(item.price)
      }));
console.log(filteredData);
      setStockData(transformedData);
      setStockInfo(bondMap[name]);

      // Fetch transactions
      const transactionsResponse = await fetch(
        `http://localhost:8100/viewbook/orderbook?bond=${name}`
      );
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions data:", error);
    }
  };

  return (
    <>
      <TopNavbar onSearchSubmit={handleSearchSubmit} />
      <div className="stocks-page">
        <Sidebar />
        <div className="main-content">
          <Container fluid className="scrollable-cards" ref={containerRef}>
            {stocks.map((stock, index) => (
              <Card
                style={{ width: "16rem" }}
                key={index}
                className="stock-overview-card"
                onClick={() => handleCardClick(stock.instrumentName)}
              >
                <Card.Body>
                  <Card.Title>{stock.instrumentName}</Card.Title>
                  <Card.Text>
                    <b>Current price: </b>
                    {stock.currentPrice}
                  </Card.Text>
                  <Card.Text>
                    <b>Bought Price:</b> {stock.boughtPrice}
                  </Card.Text>
                  <Card.Text>
                    <b>Date Purchased:</b> {stock.datePurchased}
                  </Card.Text>
                  <Card.Text>
                    <b>Volume: </b>
                    {stock.volume}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Container>
          <Button className="scroll-button" onClick={scrollRight}>
            <box-icon name="chevron-right" size="md"></box-icon>
          </Button>
          <hr />
          <div className="stock-details">
            {stockData.length > 0 && (
              <LineChart
                dataset={stockData}
                xAxis={[
                  {
                    scaleType: "band",
                    dataKey: "date",
                    label: "Date",
                    tickFormat: (value) =>
                      new Date(value).toLocaleDateString(), // Format date labels
                  },
                ]}
                series={[
                  {
                    dataKey: "close",
                    label: "Price",
                    color: "#3f51b5",
                  },
                ]}
                height={330}
                width={750}
                margin={{ left: 50, right: 30, top: 50, bottom: 50 }}
                grid={{ vertical: true, horizontal: true }}
              />
            )}
            <Card className="stock-overview-card">
              <Card.Body>
                <Card.Title>{selectedBond}</Card.Title>
                {stockInfo && (
                  <>
                    <Card.Text>
                      <b>Issuer:</b> {stockInfo.issuer}
                    </Card.Text>
                    <Card.Text>
                      <b>Bond Price:</b> {stockInfo.bondPrice}
                    </Card.Text>
                    <Card.Text>
                      <b>Coupon Rate:</b> {stockInfo.couponRate}
                    </Card.Text>
                    <Card.Text>
                      <b>Face Value:</b> {stockInfo.faceValue}
                    </Card.Text>
                    <Card.Text>
                      <b>Maturity Date:</b> {stockInfo.maturityDate}
                    </Card.Text>
                    <Card.Text>
                      <b>Credit Rating:</b> {stockInfo.creditRating}
                    </Card.Text>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
