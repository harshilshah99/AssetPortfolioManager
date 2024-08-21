import 'bootstrap/dist/css/bootstrap.min.css';
import 'boxicons';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap'; // Import Button from react-bootstrap
import * as XLSX from 'xlsx'; // Import SheetJS (xlsx)
import '../App.css';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function TradeFlowBook() {
    const [tradeFlow, setTradeFlow] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8100/viewbook/orderbook');
                const data = await response.json();
                setTradeFlow(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(tradeFlow);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "TradeFlow");
        XLSX.writeFile(workbook, "TradeFlowData.xlsx");
    };

    return (
        <>
            <TopNavbar />
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ padding: '1rem', textAlign: 'center', width: '100%' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'normal', marginBottom: '1rem' }}>Tradeflow Book</h1>
                    <div style={{ maxHeight: '75vh', overflowY: 'auto', paddingRight: '1rem' }}>
                        {tradeFlow.map((trade, index) => (
                            <Card
                                key={index}
                                style={{
                                    width: '73vw',
                                    margin: '1rem auto',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    borderRadius: '10px',
                                    backgroundColor: trade.action === 'SELL' ? '#eafaf1' : '#f8d7da'
                                }}
                            >
                                <Card.Body>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <box-icon
                                            type='solid'
                                            name={trade.action === 'BUY' ? 'right-top-arrow-circle' : 'right-down-arrow-circle'}
                                            style={{ width: '2.5rem', height: '2.5rem', marginRight: '0.5rem', color: '#28a745' }}
                                        ></box-icon>
                                        <div style={{ textAlign: 'left', flex: '1' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: '450' }}>{trade.ticker}</span>
                                                <span
                                                    style={{
                                                        backgroundColor: trade.action === 'SELL' ? '#d4edda' : 'rgb(235 154 162 / 34%)',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '5px',
                                                        color: trade.action === 'SELL' ? '#155724' : '#721c24',
                                                        fontWeight: 'normal',
                                                        marginLeft: '1rem'
                                                    }}
                                                >
                                                    #{38971985 + trade.no}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '1rem', color: '#555' }}>
                                                {/* Asset Class: {trade.asset_class}
                                                Qty: {trade.volume} Price: ${trade.amount}/share Date: {trade.datePurchased}
                                                */}
                                                 {/* <div style={{ fontWeight: '400' }}>Asset Class: </div> {trade.asset_class}
                                                 <div style={{ fontWeight: '400' }}>Qty: </div>{trade.volume}
                                                 <div style={{ fontWeight: '400' }}> Price: </div> ${trade.amount}/share
                                                 <div style={{ fontWeight: '400' }}>Date: </div>{trade.datePurchased} */}
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
                                                    <span style={{ fontWeight: '300', marginLeft: '0.5rem' }}>{trade.datePurchased}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>
                                            {trade.action}: <strong>${(trade.amount * trade.volume).toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                    <Button 
                        variant="secondary"
                        onClick={downloadExcel}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#6c757d', // Grey color
                            border: 'none'
                        }}
                    >
                        <box-icon type='solid' name='download' color="white"></box-icon>
                    </Button>
                </div>
            </div>
        </>
    );
}
