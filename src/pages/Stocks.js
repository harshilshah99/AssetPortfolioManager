import { LineChart } from "@mui/x-charts";
import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Card, Container } from "react-bootstrap";
import "./css/stocks.css";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Stocks() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [date, setDate] = useState([]);
  const [price, setPrice] = useState([]);
  const containerRef = useRef(null);
  const [stocks, setStocks] = useState([]);
  const [filteredStockData, setFilteredStockData] = useState([]); // State to store filtered stock data
  const [timeFrame, setTimeFrame] = useState(5); // State for selected time frame
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetch("http://localhost:8100/assets/stocks")
      .then((response) => response.json())
      .then((data) => {
        const stocksData = data.filter(
          (asset) => asset.assetClass.toLowerCase() === "stocks"
        );
        setStocks(stocksData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearchSubmit = async (searchQuery) => {
    console.log("Search Query:", searchQuery);
    setSelectedStock(searchQuery);
    try {
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${searchQuery}&apikey=5ZAGZACTOBA80S1T`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${searchQuery}&apikey=5ZAGZACTOBA80S1T`
      );
      const overviewData = await overviewResponse.json();

      if (timeSeriesData["Time Series (Daily)"]) {
        const dailyData = timeSeriesData["Time Series (Daily)"];
        const transformedData = Object.entries(dailyData).map(
          ([date, values]) => ({
            date,
            close: parseFloat(values["4. close"]),
          })
        );

        const latestData = transformedData.slice(0, 100);
        if (latestData.some((item) => isNaN(item.close))) {
          console.error("Invalid data detected:", latestData);
          return;
        }

        setStockData(latestData);
        setDate(latestData.map((item) => item.date));
        setPrice(latestData.map((item) => item.close));
      }

      setStockInfo(overviewData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
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
        behavior: "smooth",
      });
      if (containerRef.current.scrollLeft + clientWidth >= scrollWidth) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  };

  const handleCardClick = async (name) => {
    console.log("Clicked " + name);
    setSelectedStock(name);
    try {
      const timeSeriesResponse = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=${name}&apikey=5ZAGZACTOBA80S1T`
      );
      const timeSeriesData = await timeSeriesResponse.json();
      const overviewResponse = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${name}&apikey=5ZAGZACTOBA80S1T`
      );
      const overviewData = await overviewResponse.json();

      if (timeSeriesData["Time Series (Daily)"]) {
        const dailyData = timeSeriesData["Time Series (Daily)"];
        const transformedData = Object.entries(dailyData).map(
          ([date, values]) => ({
            date,
            close: parseFloat(values["4. close"]),
          })
        );

        const latestData = transformedData.slice(0, 100);
        if (latestData.some((item) => isNaN(item.close))) {
          console.error("Invalid data detected:", latestData);
          return;
        }

        setStockData(latestData);
        filterDataByTimeFrame(latestData, timeFrame); // Update filtered data based on the selected timeframe
        setDate(latestData.map((item) => item.date));
        setPrice(latestData.map((item) => item.close));
      }

      setStockInfo(overviewData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
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
            <LineChart
              dataset={filteredStockData}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "date",
                  label: "Date",
                  tickFormat: (value) => new Date(value).toLocaleDateString(), // Format date labels
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
            <div
              className="d-flex flex-row align-items-center"
              style={{ marginRight: "1rem" }}
            >
              <ButtonGroup vertical>
                <Button
                  variant="outline-primary"
                  onClick={() => handleTimeFrameChange(5)}
                >
                  5days
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => handleTimeFrameChange(30)}
                >
                  1month
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => handleTimeFrameChange(90)}
                >
                  3month
                </Button>
              </ButtonGroup>
            </div>
            {selectedStock && stockInfo && (
              <Card className="stock-overview-card">
                <Card.Body>
                  <Card.Title>{selectedStock}</Card.Title>
                  <Card.Text>
                    <b>Name: </b>
                    {stockInfo.Name ?? "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <b>Exchange: </b>
                    {stockInfo.Exchange ?? "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <b>Current Price:</b> {stockInfo["CurrentPrice"] ?? "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <b>Average Volume: </b>
                    {stockInfo["AverageDailyVolume"] ?? "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <b>52WeekHigh:</b> {stockInfo["52WeekHigh"] ?? "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <b>52WeekLow: </b>
                    {stockInfo["52WeekLow"] ?? "N/A"}
                  </Card.Text>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
