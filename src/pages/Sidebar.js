import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons";
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../App.css"; // Ensure this path is correct

export default function Sidebar({fund}) {
  return (
    <div>
    <Navbar className="sidebar bg-body-tertiary" expand="xxl">
        <Container fluid className="d-flex flex-column h-100">
            {/* User Info at the Top */}
            {/* <Navbar.Brand href="#" className="user-info mb-3">
                <box-icon name='user-circle' type='solid' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon>
                John Doe
            </Navbar.Brand> */}
            {/* <Button style={{width:'95%'}}>Funds: {fund}</Button> */}
            <br></br>

            {/* Main Menu */}
            <div className="main-menu flex-grow-1 mb-3">
                {/* <h5>Main Menu</h5> */}
                <Nav className="flex-column">
                    <Nav.Link href="/">
                        <box-icon name='dashboard' type='solid' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Dashboard
                    </Nav.Link>
                    <Nav.Link href="/orderbook">
                        <box-icon name='book-open' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Order Booking
                    </Nav.Link>
                    <NavDropdown title={<><box-icon name='candles' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon>My Assets</>} id="offcanvasNavbarDropdown">
                        <NavDropdown.Item href="/stocks">Stocks</NavDropdown.Item>
                        <NavDropdown.Item href="/bonds">Bonds</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={<><box-icon name='candles' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Assets</>} id="offcanvasNavbarDropdown">
                        <NavDropdown.Item href="/allstocks">Stocks</NavDropdown.Item>
                        <NavDropdown.Item href="/allbonds">Bonds</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/tradeflowbook">
                        <box-icon name='transfer-alt' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Tradeflow Book
                    </Nav.Link>
                    <Nav.Link href="/cashflow">
                        <box-icon type='solid' name='wallet-alt' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Cashflow
                    </Nav.Link>
                </Nav>
            </div>

            {/* Support Section at the Bottom */}
            <div className="support-section">
                {/* <h5>Support</h5> */}
                <Nav className="flex-column">
                    <Nav.Link href="#support">
                        <box-icon name='group' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Community
                    </Nav.Link>
                    <Nav.Link href="#contact">
                        <box-icon name='support' style={{ verticalAlign: 'middle', marginRight: '8px' }}></box-icon> Help & Support
                    </Nav.Link>
                </Nav>
            </div>
        </Container>
    </Navbar>
</div>
  );
}
