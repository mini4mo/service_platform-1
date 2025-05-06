import React, { useState } from 'react';
import './ServicePages.css';

function TaxiService() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedTariff, setSelectedTariff] = useState(null);

  const tariffs = [
    { id: 'economy', name: 'Эконом', price: '150 ₽', time: '5-7 мин', icon: '🚗' },
    { id: 'comfort', name: 'Комфорт', price: '250 ₽', time: '3-5 мин', icon: '🚙' },
    { id: 'business', name: 'Бизнес', price: '350 ₽', time: '3-4 мин', icon: '🚘' },
    { id: 'premium', name: 'Премиум', price: '500 ₽', time: '2-3 мин', icon: '🏎️' }
  ];

  const handleOrderTaxi = () => {
    if (!pickup || !destination || !selectedTariff) {
      alert('Пожалуйста, заполните все поля и выберите тариф');
      return;
    }
    alert(`Заказ оформлен! Тариф: ${selectedTariff.name}. Машина прибудет через ${selectedTariff.time}.`);
  };

  return (
    <div className="service-page taxi-service">
      <div className="map-container">
        {/* This is where the map would be rendered */}
        <div className="map-placeholder">
          <p>Интерактивная карта</p>
          <p className="map-instructions">Здесь будет отображаться карта города с возможностью выбора точек маршрута</p>
        </div>
      </div>

      <div className="service-content">
        <div className="address-inputs">
          <div className="input-group">
            <label>Откуда</label>
            <input 
              type="text" 
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Введите адрес отправления"
            />
          </div>
          <div className="input-group">
            <label>Куда</label>
            <input 
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Введите адрес назначения"
            />
          </div>
        </div>

        <div className="tariff-selection">
          <h2>Выберите тариф</h2>
          <div className="tariff-options">
            {tariffs.map(tariff => (
              <div 
                key={tariff.id}
                className={`tariff-card ${selectedTariff?.id === tariff.id ? 'selected' : ''}`}
                onClick={() => setSelectedTariff(tariff)}
              >
                <div className="tariff-icon">{tariff.icon}</div>
                <div className="tariff-info">
                  <h3>{tariff.name}</h3>
                  <p className="tariff-price">{tariff.price}</p>
                  <p className="tariff-time">Время ожидания: {tariff.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="order-button"
          onClick={handleOrderTaxi}
        >
          Заказать такси
        </button>
      </div>
    </div>
  );
}

export default TaxiService;