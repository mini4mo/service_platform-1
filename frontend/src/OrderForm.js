import React, { useState } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import axios from 'axios';

const OrderForm = ({ token }) => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [serviceType, setServiceType] = useState('taxi');
  const [error, setError] = useState('');

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
      setError('Пожалуйста, выберите начальную и конечную точки');
      return;
    }
    try {
      const response = await axios.post('[invalid url, do not cite] {
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
      setError(err.response?.data?.error || 'Ошибка при создании заказа');
      console.error(err);
    }
  };

  return (
    <GeoapifyContext apiKey={process.env.REACT_APP_GEOAPIFY_API_KEY}>
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Разместить заказ</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">Тип услуги</label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="taxi">Такси</option>
              <option value="food_delivery">Доставка еды</option>
              <option value="other">Другое</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Откуда</label>
            <GeoapifyGeocoderAutocomplete
              placeSelect={handleStartSelect}
              placeholder="Начальная точка"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Куда</label>
            <GeoapifyGeocoderAutocomplete
              placeSelect={handleEndSelect}
              placeholder="Конечная точка"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Разместить заказ
          </button>
        </form>
      </div>
    </GeoapifyContext>
  );
};

export default OrderForm;