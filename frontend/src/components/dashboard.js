import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const services = [
    {
      id: 'taxi',
      title: 'Такси',
      description: 'Быстрая подача такси в любую точку города',
      icon: '🚕',
      color: 'bg-yellow-400'
    },
    {
      id: 'food',
      title: 'Еда',
      description: 'Рестораны, кафе и магазины с доставкой',
      icon: '🍔',
      color: 'bg-red-400'
    },
    {
      id: 'courier',
      title: 'Доставка',
      description: 'Быстрая доставка посылок и документов',
      icon: '📦',
      color: 'bg-blue-400'
    },
    {
      id: 'shopping',
      title: 'Магазины',
      description: 'Продукты и товары с доставкой',
      icon: '🛒',
      color: 'bg-green-400'
    }
  ];

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="text-4xl font-bold mb-4">Сервисная платформа</h1>
          <p className="text-xl mb-6">Все услуги в одном приложении</p>
        </div>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`service-card ${service.color}`}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="service-icon">{service.icon}</div>
            <h2 className="service-title">{service.title}</h2>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="benefits-section">
        <h2 className="text-2xl font-bold mb-4">Преимущества нашей платформы</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3 className="benefit-title">Быстро</h3>
            <p>Моментальное подключение к ближайшим сервисам</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3 className="benefit-title">Выгодно</h3>
            <p>Специальные предложения и система лояльности</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔒</div>
            <h3 className="benefit-title">Безопасно</h3>
            <p>Проверенные поставщики услуг и защита данных</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;