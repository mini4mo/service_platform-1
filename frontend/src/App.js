import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from '.src/components/dashboard.js';

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
      localStorage.setItem('userId', response.data.userId);
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
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    setToken('');
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Выйти
            </button>
          </div>
          <Dashboard token={token} userId={userId} />
        </>
      )}
    </div>
  );
}

export default App;