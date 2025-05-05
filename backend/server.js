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
        origin: 'http://localhost:3000',
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

// Создание заказа (защищенный маршрут)
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { service_type, start_location, end_location } = req.body;
        const user_id = req.user.userId;
        const [result] = await pool.execute(
            'INSERT INTO orders (user_id, service_type, status, start_location, end_location) VALUES (?, ?, ?, ?, ?)',
            [user_id, service_type, 'pending', start_location, end_location]
        );
        io.emit('order_update', { order_id: result.insertId, status: 'pending' });
        res.status(201).json({ order_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Чат поддержки
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('send_message', async (data) => {
        try {
            const { user_id, message } = data;
            await pool.execute(
                'INSERT INTO support_chats (user_id, message, is_from_support) VALUES (?, ?, ?)',
                [user_id, message, false]
            );
            io.emit('receive_message', { user_id, message, created_at: new Date() });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});