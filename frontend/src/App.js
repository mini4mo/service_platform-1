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
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password
      });
      alert('Registration successful! Please log in.');
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Registration</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="block mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter username"
        />
      </div>
      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter password"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Register
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
      setError(error.response?.data?.error || 'Login error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter password"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
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
      <h1 className="text-2xl font-bold mb-4">Service Platform</h1>
      {!token ? (
        showRegister ? (
          <>
            <RegisterForm setToken={setToken} setUserId={setUserId} />
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 text-blue-500 hover:underline"
            >
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <LoginForm setToken={setToken} setUserId={setUserId} />
            <button
              onClick={() => setShowRegister(true)}
              className="mt-4 text-blue-500 hover:underline"
            >
              No account? Register
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