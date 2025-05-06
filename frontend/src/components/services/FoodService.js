import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicePages.css';

function FoodService() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('restaurants');
  
  const categories = [
    { id: 'restaurants', name: 'Рестораны', icon: '🍽️' },
    { id: 'fastfood', name: 'Фастфуд', icon: '🍔' },
    { id: 'grocery', name: 'Продукты', icon: '🛒' },
    { id: 'pharmacy', name: 'Аптеки', icon: '💊' }
  ];
  
  const places = {
    restaurants: [
      { id: 'rest1', name: 'Итальянская кухня', rating: 4.8, time: '30-45 мин', image: 'italian.jpg' },
      { id: 'rest2', name: 'Японский ресторан', rating: 4.6, time: '40-55 мин', image: 'japanese.jpg' },
      { id: 'rest3', name: 'Русская кухня', rating: 4.7, time: '35-50 мин', image: 'russian.jpg' },
      { id: 'rest4', name: 'Французский ресторан', rating: 4.9, time: '45-60 мин', image: 'french.jpg' }
    ],
    fastfood: [
      { id: 'fast1', name: 'Бургер Кинг', rating: 4.3, time: '15-25 мин', image: 'burgers.jpg' },
      { id: 'fast2', name: 'Пицца Хат', rating: 4.5, time: '20-35 мин', image: 'pizza.jpg' },
      { id: 'fast3', name: 'KFC', rating: 4.2, time: '15-30 мин', image: 'chicken.jpg' }
    ],
    grocery: [
      { id: 'groc1', name: 'Перекресток', rating: 4.6, time: '40-60 мин', image: 'grocery1.jpg' },
      { id: 'groc2', name: 'Пятерочка', rating: 4.4, time: '30-50 мин', image: 'grocery2.jpg' },
      { id: 'groc3', name: 'Магнит', rating: 4.3, time: '35-55 мин', image: 'grocery3.jpg' }
    ],
    pharmacy: [
      { id: 'pharm1', name: 'Аптека 36.6', rating: 4.7, time: '30-45 мин', image: 'pharmacy1.jpg' },
      { id: 'pharm2', name: 'Неофарм', rating: 4.5, time: '35-50 мин', image: 'pharmacy2.jpg' }
    ]
  };

  const handlePlaceClick = (place) => {
    // In a real app, this would navigate to a specific store page
    alert(`Вы выбрали: ${place.name}`);
  };

  return (
    <div className="service-page food-service">
      <div className="categories-bar">
        {categories.map(category => (
          <div 
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>

      <div className="places-grid">
        <h2 className="section-title">{categories.find(c => c.id === activeCategory).name}</h2>
        
        <div className="places-container">
          {places[activeCategory].map(place => (
            <div 
              key={place.id}
              className="place-card"
              onClick={() => handlePlaceClick(place)}
            >
              <div className="place-image-container">
                {/* Placeholder for images */}
                <div className="place-image-placeholder">
                  <span>{place.name.charAt(0)}</span>
                </div>
              </div>
              <div className="place-info">
                <h3>{place.name}</h3>
                <div className="place-meta">
                  <span className="place-rating">⭐ {place.rating}</span>
                  <span className="place-time">🕒 {place.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="food-service-footer">
        <p>Выберите категорию и место для заказа</p>
      </div>
    </div>
  );
}

export default FoodService;