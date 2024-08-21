import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import "../App.css"; // Ensure this path is correct
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const tickerSymbols = [
  "AAPL",
  "AMZN",
  "BABA",
  "BRK-B",
  "CVX",
  "GOOG",
  "IBM",
  "JNJ",
  "JPM",
  "MSFT",
  "NVDA",
  "PG",
  "PYPL",
  "TSLA",
  "UNH",
  "V",
  "XOM",
  "AAPL_25",
  "AMZN_27",
  "BAC_24",
  "GOOGL_25",
  "JPM_29",
  "KO_27",
  "MSFT_24",
  "PEP_25",
  "TSLA_23"
];

export default function OrderBook() {
  const [formData, setFormData] = useState({
    stockName: "",
    date: "",
    units: "",
    assetClass: "", // Removed price from formData
  });

  const [orders, setOrders] = useState([]);
  const [price, setPrice] = useState(""); // This will store the fetched price
  const [suggestions, setSuggestions] = useState([]); // For storing suggestions
  const [error, setError] = useState(""); // For storing error messages
  const [showModal, setShowModal] = useState(false); // For managing modal visibility

  useEffect(() => {
    const fetchPrice = async () => {
      if (formData.stockName && formData.date) {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${formData.stockName}&apikey=5ZAGZACTOBA80S1T`
          );
          const data = await response.json();
          const timeSeries = data["Time Series (Daily)"];
          if (timeSeries && timeSeries[formData.date]) {
            const closingPrice = timeSeries[formData.date]["4. close"];
            setPrice(closingPrice);
          } else {
            setPrice("Price not available for the selected date");
          }
        } catch (error) {
          console.error("Error fetching the stock price:", error);
          setPrice("Error fetching price");
        }
      }
    };

    fetchPrice();
  }, [formData.stockName, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Suggest ticker symbols based on user input
    if (name === 'stockName') {
      const filteredSuggestions = tickerSymbols.filter(ticker =>
        ticker.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSubmit = async (type) => {
    const orderPrice = price === "Price not available for the selected date" ? formData.price : price; // Use formData.price if API price is unavailable

    const orderData = {
      action: type, // Buy or Sell
      amount: parseFloat(orderPrice) || 0, // Calculate total amount
      asset_class: formData.assetClass, // Added assetClass
      datePurchased: formData.date,
      ticker: formData.stockName,
      volume: parseInt(formData.units, 10), // Ensure units is an integer
    };
 

    try {
      // Send POST request using fetch
      const response = await fetch("http://localhost:8100/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        // Check for specific error responses
        const errorData = await response.json();
        setError(errorData.error);
        setShowModal(true); // Show modal when there's an error
        return;
      }

      // Update local state
      setOrders([...orders, { ...orderData, price: orderPrice }]);
      setFormData({ stockName: "", date: "", units: "", assetClass: "" }); // Removed price from formData reset
      setPrice("");
      setSuggestions([]); // Clear suggestions after submission
      setError(""); // Clear any previous error
    } catch (error) {
      console.error("Error submitting the order:", error);
      setError("Error submitting order: " + error.message);
      setShowModal(true); // Show modal when there's an error
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, stockName: suggestion });
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleCloseModal = () => setShowModal(false); // Close the modal

  return (
    <>
      <TopNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div>
          {/* Order Book Component */}

          <div className="order-book-container">
            <h2>Order Book</h2>
            <Form className="order-form">
              <Form.Group controlId="formStockName">
                <Form.Label>Ticker</Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type="text"
                    placeholder="Enter ticker symbol"
                    name="stockName"
                    value={formData.stockName}
                    onChange={handleChange}
                  />
                  {suggestions.length > 0 && (
                    <ul style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      maxHeight: '150px',
                      overflowY: 'auto',
                      zIndex: 1000
                    }}>
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #ddd'
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Form.Group>

              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formUnits">
                <Form.Label>Units</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter units"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formAssetClass">
                <Form.Label>Asset Class</Form.Label>
                <Form.Control
                  as="select"
                  name="assetClass"
                  value={formData.assetClass}
                  onChange={handleChange}
                >
                  <option value="">Select asset class</option>
                  <option value="Stocks">Stock</option>
                  <option value="Bonds">Bond</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formPrice">
                <Form.Label>Price per Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={price === "Price not available for the selected date" ? "Please enter price" : price}
                  name="price"
                  required
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="button-group">
                <Button variant="success" onClick={() => handleSubmit("BUY")}>
                  BUY
                </Button>
                <Button variant="danger" onClick={() => handleSubmit("SELL")}>
                  SELL
                </Button>
              </div>
            </Form>

            <Table striped bordered hover className="order-book-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order Type</th>
                  <th>Stock Name</th>
                  <th>Date</th>
                  <th>Units</th>
                  <th>Total Amount in USD</th>
                  <th>Price</th>
                  <th>Asset Class</th> {/* Added column for Asset Class */}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{order.action}</td>
                    <td>{order.ticker}</td>
                    <td>{order.datePurchased}</td>
                    <td>{order.volume}</td>
                    <td>{(order.volume * order.price).toFixed(2)}</td>
                    <td>{order.price}</td>
                    <td>{order.asset_class}</td> {/* Added asset_class */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
