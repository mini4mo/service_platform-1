import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function RegisterForm({ setToken, setUserId }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password
      });
      alert('Регистрация успешна! Пожалуйста, войдите.');
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Регистрация</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="block mb-2">Имя пользователя</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Введите имя"
        />
      </div>
      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Введите email"
        />
      </div>
      <div>
        <label className="block mb-2">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Введите пароль"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Зарегистрироваться
      </button>
    </div>
  );
}

function LoginForm({ setToken, setUserId }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });
      setToken(response.data.token);
      setUserId(response.data.userId);
      localStorage.setItem('token', response.data.token);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка авторизации');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Вход</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Введите email"
        />
      </div>
      <div>
        <label className="block mb-2">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Введите пароль"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Войти
      </button>
    </div>
  );
}

function OrderForm({ token }) {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [serviceType, setServiceType] = useState('taxi');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      setError(error.response?.data?.error || 'Ошибка при создании заказа');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Разместить заказ</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
        <input
          type="text"
          placeholder="Начальная точка"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-2">Куда</label>
        <input
          type="text"
          placeholder="Конечная точка"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Разместить заказ
      </button>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Сервисная платформа</h1>
      {!token ? (
        showRegister ? (
          <>
            <RegisterForm setToken={setToken} setUserId={setUserId} />
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 text-blue-500 hover:underline"
            >
              Уже есть аккаунт? Войти
            </button>
          </>
        ) : (
          <>
            <LoginForm setToken={setToken} setUserId={setUserId} />
            <button
              onClick={() => setShowRegister(true)}
              className="mt-4 text-blue-500 hover:underline"
            >
              Нет аккаунта? Зарегистрироваться
            </button>
          </>
        )
      ) : (
        <>
          <button
            onClick={() => {
              setToken('');
              setUserId(null);
              localStorage.removeItem('token');
            }}
            className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Выйти
          </button>
          <OrderForm token={token} />
        </>
      )}
    </div>
  );
}

export default App;