import React, { useState, useEffect } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import axios from 'axios';
import io from 'socket.io-client';

const OrderForm = ({ token }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [serviceType, setServiceType] = useState('taxi');
  const [error, setError] = useState('');

  // Подключение Socket.IO
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'], // Поддержка WebSocket и polling
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('newOrder', (order) => {
      console.log('New order received:', order);
      alert(`New order: ${order.service_type} from ${order.start_location}`);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setError('Could not connect to real-time server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStartSelect = (value) => {
    if (value && value.properties && value.properties.formatted) {
      setStartLocation(value.properties.formatted);
    } else {
      setStartLocation('');
    }
  };

  const handleEndSelect = (value) => {
    if (value && value.properties && value.properties.formatted) {
      setEndLocation(value.properties.formatted);
    } else {
      setEndLocation('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startLocation || !endLocation) {
      setError('Please select both start and end locations');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        service_type: serviceType,
        start_location: startLocation,
        end_location: endLocation
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Order placed:', response.data);
      setError('');
      setStartLocation('');
      setEndLocation('');
      setServiceType('taxi');
    } catch (err) {
      setError(err.response?.data?.error || 'Error placing order');
      console.error(err);
    }
  };

  return (
    <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Place Order</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">Service Type</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="taxi">Taxi</option>
              <option value="food_delivery">Food Delivery</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">From</label>
            <GeoapifyGeocoderAutocomplete
              placeSelect={handleStartSelect}
              placeholder="Start Location"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">To</label>
            <GeoapifyGeocoderAutocomplete
              placeSelect={handleEndSelect}
              placeholder="End Location"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Place Order
          </button>
        </form>
      </div>
    </GeoapifyContext>
  );
};

export default OrderForm;