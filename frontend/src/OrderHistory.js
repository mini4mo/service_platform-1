import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <ul>
        {orders.map(order => (
          <li key={order.id} className="mb-2">
            <p>Service: {order.service_type}</p>
            <p>Status: {order.status}</p>
            <p>From: {order.start_location}</p>
            <p>To: {order.end_location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;