import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import OrderForm from './OrderForm';
import OrderHistory from './OrderHistory';

function RegisterForm({ setToken, setUserId }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('[invalid url, do not cite] {
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
      const response = await axios.post('[invalid url, do not cite] {
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

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState('orderForm');

  const handleLogout = () => {
    setToken('');
    setUserId(null);
    localStorage.removeItem('token');
  };

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
        <div>
          <div className="mb-4">
            <button
              onClick={() => setView('orderForm')}
              className={`mr-2 px-4 py-2 rounded ${view === 'orderForm' ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-600`}
            >
              Place Order
            </button>
            <button
              onClick={() => setView('orderHistory')}
              className={`mr-2 px-4 py-2 rounded ${view === 'orderHistory' ? 'bg-blue-700' : 'bg-blue-500'} text-white hover:bg-blue-600`}
            >
              Order History
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          {view === 'orderForm' && <OrderForm token={token} />}
          {view === 'orderHistory' && <OrderHistory token={token} />}
        </div>
      )}
    </div>
  );
}

export default App;