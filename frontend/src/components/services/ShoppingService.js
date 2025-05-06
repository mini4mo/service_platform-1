import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicePages.css';

function ShoppingService() {
  const navigate = useNavigate();
  
  const storeCategories = [
    {
      id: 'grocery',
      name: 'Продуктовые',
      icon: '🛒',
      color: 'bg-green-500',
      description: 'Продукты питания и товары для дома'
    },
    {
      id: 'electronics',
      name: 'Электроника',
      icon: '📱',
      color: 'bg-blue-500',
      description: 'Гаджеты, техника и аксессуары'
    },
    {
      id: 'clothing',
      name: 'Одежда',
      icon: '👕',
      color: 'bg-purple-500',
      description: 'Мужская, женская и детская одежда'
    },
    {
      id: 'cosmetics',
      name: 'Косметика',
      icon: '💄',
      color: 'bg-pink-500',
      description: 'Косметика и средства по уходу'
    },
    {
      id: 'pharmacy',
      name: 'Аптеки',
      icon: '💊',
      color: 'bg-red-500',
      description: 'Лекарства и медицинские товары'
    },
    {
      id: 'pets',
      name: 'Зоотовары',
      icon: '🐾',
      color: 'bg-yellow-500',
      description: 'Товары для животных'
    }
  ];

  const handleCategoryClick = (category) => {
    // In a real app, navigate to a specific category page
    navigate(`/service/shopping/${category.id}`);
  };

  return (
    <div className="service-page shopping-service">
      <div className="page-header">
        <h1>Магазины</h1>
        <p>Выберите категорию магазинов для заказа товаров</p>
      </div>

      <div className="store-categories-grid">
        {storeCategories.map(category => (
          <div 
            key={category.id}
            className={`store-category-card ${category.color}`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-icon-large">{category.icon}</div>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      <div className="promo-section">
        <div className="promo-card">
          <h3>Скидка 20% на первый заказ</h3>
          <p>Используйте промокод WELCOME20</p>
          <button className="promo-button">Активировать</button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingService;