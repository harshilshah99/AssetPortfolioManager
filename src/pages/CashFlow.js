import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import '../App.css';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function CAshFlow() {
    const [tradeFlow,setTradeFlow] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8100/viewbook/cashflow');
                const data = await response.json();
                setTradeFlow(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        fetchData();
    }, []);


    return (
        <>
     
      <TopNavbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div>
          {/* Order Book Component */}
       
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'normal', marginBottom: '1rem' }}>Cashflow</h1>
                    {tradeFlow.map((trade,index) => (

                 
                    <Card style={{
                        width: '75vw',
                        margin: '1rem auto',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        borderRadius: '10px',
                        backgroundColor:'#eafaf1'  // normal green background
                    }}>
                        <Card.Body>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <box-icon type='solid' name='right-down-arrow-circle' style={{ width: '2.5rem', height: '2.5rem', marginRight: '0.5rem', color: '#28a745' }}></box-icon>
                                <div style={{ textAlign: 'left', flex: '1' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: '450' }}>{trade.instrumentName}</span>
                                        <span style={{
                                            backgroundColor:'#d4edda',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '5px',
                                            color:'#155724',
                                            fontWeight: 'normal',
                                            marginLeft: '1rem'
                                        }}>#{38971985 + trade.no}</span>
                                    </div>
                                    <div style={{ fontSize: '1rem', color: '#555' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: '400' }}>Asset Class:</span>
                                                    <span style={{ fontWeight: '300', marginLeft: '0.5rem' }}>{trade.asset_class}</span>
                                                    </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: '400' }}>Qty:</span>
                                                    <span style={{ fontWeight: '300', marginLeft: '0.5rem' }}>{trade.volume}</span>
                                                    
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: '400' }}>Price:</span>
                                                    <span style={{ fontWeight: '300', marginLeft: '0.5rem' }}>${trade.amount}/share</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: '400' }}>Date:</span>
                                                    <span style={{ fontWeight: '300', marginLeft: '0.5rem' }}>{trade.date}</span>
                                                </div>
                                    </div>
                                </div>
                                <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>Total Amount: <strong>${(trade.price * trade.volume).toFixed(2)}</strong></div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>Realized PNL: <strong>${(trade.realizedpnl).toFixed(2)}</strong></div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                       ))}
              
                </div>
            </div>
            </div>

        </>
    )
}
