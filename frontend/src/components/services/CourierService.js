import React, { useState } from 'react';
import './ServicePages.css';

function CourierService() {
  const [packageType, setPackageType] = useState('document');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [weight, setWeight] = useState('');
  
  const packageTypes = [
    { id: 'document', name: 'Документы', icon: '📄', price: '200 ₽' },
    { id: 'small', name: 'Небольшая посылка', icon: '📦', price: '350 ₽' },
    { id: 'medium', name: 'Средняя посылка', icon: '📦📦', price: '500 ₽' },
    { id: 'large', name: 'Крупная посылка', icon: '📦📦📦', price: '800 ₽' }
  ];

  const handleOrderCourier = () => {
    if (!pickupAddress || !deliveryAddress) {
      alert('Пожалуйста, заполните адреса отправления и доставки');
      return;
    }
    
    const selectedPackage = packageTypes.find(p => p.id === packageType);
    alert(`Заказ курьера оформлен! Тип посылки: ${selectedPackage.name}. Стоимость: ${selectedPackage.price}.`);
  };

  return (
    <div className="service-page courier-service">
      <div className="page-header">
        <h1>Курьерская доставка</h1>
        <p>Быстрая доставка посылок по городу</p>
      </div>

      <div className="courier-form">
        <div className="form-section">
          <h2>Тип посылки</h2>
          <div className="package-type-options">
            {packageTypes.map(pkg => (
              <div 
                key={pkg.id}
                className={`package-option ${packageType === pkg.id ? 'selected' : ''}`}
                onClick={() => setPackageType(pkg.id)}
              >
                <div className="package-icon">{pkg.icon}</div>
                <div className="package-details">
                  <h3>{pkg.name}</h3>
                  <p className="package-price">{pkg.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Адреса</h2>
          <div className="address-inputs">
            <div className="input-group">
              <label>Адрес отправления</label>
              <input 
                type="text" 
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Введите адрес отправления"
              />
            </div>
            <div className="input-group">
              <label>Адрес доставки</label>
              <input 
                type="text" 
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Введите адрес доставки"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Дополнительно</h2>
          <div className="additional-inputs">
            <div className="input-group half-width">
              <label>Вес посылки (кг)</label>
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Вес"
                min="0.1"
                step="0.1"
              />
            </div>
            <div className="input-group half-width">
              <label>Комментарий</label>
              <textarea 
                placeholder="Комментарий для курьера"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <button 
          className="order-button"
          onClick={handleOrderCourier}
        >
          Вызвать курьера
        </button>
      </div>
    </div>
  );
}

export default CourierService;