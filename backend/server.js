const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',  // Исправлено: добавлена запятая
        methods: ['GET', 'POST']
    }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Токен отсутствует' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Недействительный токен' });
        req.user = user;
        next();
    });
};

// Игнорировать запросы к favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Тестовый маршрут для корневого пути
app.get('/', (req, res) => {
    res.json({ 
        message: 'Service Platform API is running!',
        info: 'This is the backend API. To access the application, open the frontend at http://localhost:3000'  // Исправлено: закрывающая кавычка
    });
});

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        await pool.execute(
            'INSERT INTO user_loyalty (user_id, points, tier) VALUES (?, ?, ?)',
            [result.insertId, 0, 'bronze']
        );
        res.status(201).json({ message: 'Пользователь зарегистрирован', user_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Авторизация пользователя
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение заказов пользователя
app.get('/api/orders', authenticateToken, async (req, res) => {
    // Добавлено закрывающее определение функции, так как оно отсутствовало в исходном коде
    try {
        const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ?', [req.user.userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});