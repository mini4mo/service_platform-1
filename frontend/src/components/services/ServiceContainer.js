import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaxiService from './TaxiService';
import FoodService from './FoodService';
import CourierService from './CourierService';
import ShoppingService from './ShoppingService';
import './ServicePages.css';

function ServiceContainer() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const renderServiceComponent = () => {
    switch(serviceId) {
      case 'taxi':
        return <TaxiService />;
      case 'food':
        return <FoodService />;
      case 'courier':
        return <CourierService />;
      case 'shopping':
        return <ShoppingService />;
      default:
        // Redirect to dashboard if invalid service
        navigate('/dashboard');
        return null;
    }
  };

  return (
    <div className="service-container">
      <div className="service-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Назад
        </button>
        <h1 className="service-title">
          {serviceId === 'taxi' && 'Такси'}
          {serviceId === 'food' && 'Еда'}
          {serviceId === 'courier' && 'Доставка'}
          {serviceId === 'shopping' && 'Магазины'}
        </h1>
      </div>
      
      {renderServiceComponent()}
    </div>
  );
}

export default ServiceContainer;