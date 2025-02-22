import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PriceSection = ({ pricePerNight, hotel }) => {
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);

    const maxGuestsPerRoom = 2;

    const calculateTotalPrice = () => {
        if (checkIn && checkOut) {
            const days =
                (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 
                (1000 * 3600 * 24);
            return days > 0 ? rooms * pricePerNight * days : 0;
        }
        return 0;
    };

    const handleGuestChange = (value) => {
        const maxGuests = rooms * maxGuestsPerRoom;
        setGuests(value > maxGuests ? maxGuests : value);
    };

    const resetSelections = () => {
        setRooms(1);
        setGuests(1);
        setCheckIn(null);
        setCheckOut(null);
    };

    const totalPrice = calculateTotalPrice();

    useEffect(() => {
        const scriptId = 'payu-checkout-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://test.payu.in/_payment';
            script.id = scriptId;
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    const handlePayment = async () => {
        
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_URL}payment/make-payment`,
                {
                amount: totalPrice * 100, // PayU expects amount in paise
                currency: 'INR',
                order_id: `ORDER_${Date.now()}`, // Generate a unique order ID
                order_note: `Booking for Seaside Resort`,
                firstname: 'User Name', // Add firstname
                email: 'user@example.com', // Add email
                phone: '9999999999', // Add phone
                productinfo: `Booking for Seaside Resort`, // Add productinfo
                }
            );
          
           
            
            const { txnid, payment_link, status } = response.data.paymentData;

            if (response.status === 200) {
                const options = {
                    key: 'Sy5lhf', 
                    txnid: txnid,
                    amount: totalPrice, 
                    productinfo: `Booking for seaside hotel`,
                    firstname: 'User Name',
                    email: 'user@example.com',
                    phone: '9999999999',
                    surl: `${process.env.REACT_APP_URL}payment/verify-payment`,
                    furl: `${process.env.REACT_APP_URL}payment/verify-payment`,
                };
                
                 
             
                if (window.PayUCheckout) {
                    
                    const payu = new window.PayUCheckout(options);
                    payu.setMerchantKey(options.key);
                    payu.setTransactionId(options.txnid);
                    payu.setAmount(options.amount);
                    payu.setProductInfo(options.productinfo);
                    payu.setFirstName(options.firstname);
                    payu.setEmail(options.email);
                    payu.setPhone(options.phone);
                    payu.setSuccessUrl(options.surl);
                    payu.setFailureUrl(options.furl);
                    payu.makePayment();
                } else {
                   
                    console.error('PayUCheckout is not available.');
                }
              
            } else {
                console.error('Failed to create order:', response);
                alert('Failed to create payment order. Please try again.');
            }
        } catch (error) {
            console.error('Payment Initialization Failed:', error);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    return (
        <div style={styles.priceSection}>
            <h3>Price Details</h3>
            <div style={styles.row}>
                <label>Price per night:</label>
                <span>₹{pricePerNight}</span>
            </div>
            <div style={styles.row}>
                <label>Rooms:</label>
                <select
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    style={styles.select}
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.row}>
                <label>Guests:</label>
                <select
                    value={guests}
                    onChange={(e) => handleGuestChange(Number(e.target.value))}
                    style={styles.select}
                >
                    {Array.from({ length: rooms * maxGuestsPerRoom }, (_, i) => i + 1).map(
                        (num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        )
                    )}
                </select>
                <small style={styles.info}>
                    Max {rooms * maxGuestsPerRoom} guests allowed for {rooms} room(s).
                </small>
            </div>
            <div style={styles.row}>
                <label>Check-in:</label>
                <DatePicker
                    selected={checkIn}
                    onChange={(date) => {
                        setCheckIn(date);
                        if (checkOut && date >= checkOut) setCheckOut(null);
                    }}
                    placeholderText="Select date"
                    style={styles.datePicker}
                    minDate={new Date()}
                />
            </div>
            <div style={styles.row}>
                <label>Check-out:</label>
                <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    placeholderText="Select date"
                    style={styles.datePicker}
                    minDate={checkIn ? new Date(checkIn).setDate(new Date(checkIn).getDate() + 1) : new Date()}
                />
            </div>
            <div style={styles.row}>
                <label>Total Price:</label>
                <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div style={styles.actions}>
                <button
                    style={styles.reserveButton}
                    disabled={!checkIn || !checkOut || totalPrice === 0}
                    onClick={handlePayment}
                >
                    Reserve Now
                </button>
                <button style={styles.resetButton} onClick={resetSelections}>
                    Reset
                </button>
            </div>
        </div>
    );
};

// Styles
const styles = {
    priceSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: 'auto',
        marginTop: '20px',
        width: '40%',
    },
    row: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
    },
    select: {
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    datePicker: {
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        width: '100%',
    },
    info: {
        fontSize: '12px',
        color: '#888',
        marginTop: '5px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    reserveButton: {
        backgroundColor: '#ff5a5f',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    resetButton: {
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
    },
};

export default PriceSection;
