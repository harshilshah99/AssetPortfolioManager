import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Navbar from "react-bootstrap/Navbar";
import "../App.css"; // Ensure this path is correct

export default function TopNavbar({ onSearchSubmit }) {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    onSearchSubmit(searchInput); // Pass the search input to the parent component
  };

  return (
    <Navbar bg="light" expand="lg" className="top-navbar" style={{ width: '97.5vw' }}>
      <Navbar.Brand href="#" className="user-info">
        <box-icon
          name="user-circle"
          type="solid"
          style={{
            verticalAlign: "middle",
            marginRight: "8px",
            marginLeft: "15px",
          }}
        ></box-icon>
        <b> John Doe</b>
      </Navbar.Brand>
      <Form className="d-flex search-bar" onSubmit={handleFormSubmit}>
        <FormControl
          type="search"
          placeholder="Search for stocks & more"
          className="me-2"
          aria-label="Search"
          value={searchInput}
          onChange={handleInputChange}
        />
      </Form>
    </Navbar>
  );
}
