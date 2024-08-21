import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons";
import React, { useEffect, useState } from "react";
import "../App.css"; // Ensure this path is correct
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [asset, setAsset] = useState([]);
  const [realizedpnl, setRealizedpnl] = useState();
  let counter = 0;

  const fetchData = async () => {
    console.log("called")
    try {
      // Define the API endpoints
      const urls = [
        'http://localhost:8100/assets/stocks',
        'http://localhost:8100/assets/bonds',
        'http://localhost:8100/viewbook/cashflow',
        'http://localhost:8100/assets',
      ];

      // Fetch all URLs in parallel
      const responses = await Promise.all(urls.map(url => fetch(url)));

      // Check if all responses are successful
      const data = await Promise.all(responses.map(response => {
        if (!response.ok) {
          console.log(counter++)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }));

      // Set state with the fetched data
      setStocks(data[0]); // Assuming the first URL corresponds to tradeFlow
      setBonds(data[1]); // Assuming the second URL corresponds to stockData
      setRealizedpnl(data[2]);
      setAsset(data[3]); // Assuming the second URL corresponds to stockData
      // Handle additional data from more URLs as needed
      console.log(asset);

    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  useEffect(() => {
    fetchData();

  }, []);



  const stockData = stocks.map((stock, index) => ({
    id: stock.instrumentName,  // Unique identifier for each item
    value: stock.currentPrice * stock.volume,
    label: stock.instrumentName

  }));
  const bondData = bonds.map((bond, index) => ({
    id: bond.instrumentName,  // Unique identifier for each item
    value: bond.currentPrice * bond.volume,

    label: `${bond.instrumentName}`
  }));

  console.log(stockData);
  console.log(bondData);


  const sinvest = asset.filter(asset => asset.assetClass === 'Stocks').reduce((acc, asset) => acc + (asset.boughtPrice * asset.volume), 0).toFixed(2);
  const spnl = asset.filter(asset => asset.assetClass === 'Stocks').reduce((acc, asset) => acc + (asset.pnl * asset.volume), 0).toFixed(2);

  const binvest = asset.filter(asset => asset.assetClass === 'Bonds').reduce((acc, asset) => acc + (asset.boughtPrice * asset.volume), 0).toFixed(2);
  const bpnl = asset.filter(asset => asset.assetClass === 'Bonds').reduce((acc, asset) => acc + (asset.pnl * asset.volume), 0).toFixed(2);

  const pnl = asset.reduce((acc, asset) => acc + (asset.currentPrice * asset.volume), 0).toFixed(2);

  console.log(sinvest);
  return (
    <>
      <TopNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar fund={pnl}/>
        <div style={{ width: "100%", padding: "20px" }}>
          <div style={{fontWeight: 'bold'}}><h3>Investments</h3></div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: stockData,
                    label: 'Stocks',
                  },
                ]}
                width={300}
                height={150}
                slotProps={{
                  legend: {
                    direction: 'column',
                    position: { vertical: 'top', horizontal: 'right' },
                    padding: 0,
                  },
                }}
              />
            </div>
            
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart
                series={[
                  {
                    data: bondData,
                    label: 'Bonds',
                  },
                ]}
                width={350}
                height={150}
                slotProps={{
                  legend: {
                    direction: 'column',
                    position: { vertical: 'top', horizontal: 'right' },
                    padding: 0,
                  },
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  maxWidth: "350px",
                  width: "100%",
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                  padding: "5px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <h5 style={{ marginBottom: "10px" }}>Statistics</h5>
                <h6 style={{ margin: "10px 0" }}>Total Investments: ${asset.reduce((acc, asset) => acc + (asset.boughtPrice * asset.volume), 0).toFixed(2)}</h6>
                <h6 style={{ margin: "10px 0" }}>Total PNL: ${asset.reduce((acc, asset) => acc + (asset.pnl * asset.volume), 0).toFixed(2)}</h6>
                <h6 style={{ margin: "10px 0" }}>Total Portfolio:${asset.reduce((acc, asset) => acc + (asset.currentPrice * asset.volume), 0).toFixed(2)}</h6>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <h3>Assets</h3>
              <div
                style={{
                  maxHeight: "250px", // Adjust as needed
                  overflowY: "auto",
                }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Assetclass</th>
                      <th>Volume</th>
                      <th>Bought Price</th>
                      <th>PNL</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asset.map((asset, index) => (
                      <tr key={index}>
                        <td>{asset.instrumentName}</td>
                        <td>{asset.assetClass}</td>
                        <td>{asset.volume}</td>
                        <td>{asset.boughtPrice}</td>
                        <td>{(asset.pnl * asset.volume).toFixed(2)}</td>
                        <td>{(asset.currentPrice * asset.volume).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{marginLeft: '10px', fontStyle:'italic'}}>All prices in USD ($)</div>
              </div>
            </div>

            <div>
              <BarChart
              xAxis={[{ scaleType: 'band', data: ['Stocks', 'Bonds'] }]}
                series={[
                  { data: [sinvest, binvest], stack: 'A', label: 'Invested' },
                  { data: [spnl, bpnl], stack: 'A', label: 'Profit' },

                ]}
            
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
