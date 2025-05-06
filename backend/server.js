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

// Настройка CORS для Socket.IO. Для разработки можно использовать '*'
// Для продакшена лучше указать конкретный origin вашего фронтенда.
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000", // Или '*' для большей гибкости в разработке
        methods: ['GET', 'POST']
    }
});

// Настройка CORS для Express. Указывает, что запросы с http://localhost:3000 разрешены.
// Если ваш фронтенд работает на другом порту/домене, измените это.
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
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
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(403).json({ error: 'Недействительный или просроченный токен' });
        }
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
        info: `This is the backend API. To access the application, open the frontend at ${process.env.FRONTEND_URL || 'http://localhost:3000'}`
    });
});

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Имя пользователя, email и пароль обязательны' });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        // Предполагается, что таблица user_loyalty существует
        await pool.execute(
            'INSERT INTO user_loyalty (user_id, points, tier) VALUES (?, ?, ?)',
            [result.insertId, 0, 'bronze']
        );
        res.status(201).json({ message: 'Пользователь зарегистрирован', userId: result.insertId });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Пользователь с таким email или именем уже существует' });
        }
        res.status(500).json({ error: 'Ошибка на сервере при регистрации' });
    }
});

// Авторизация пользователя
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email и пароль обязательны' });
        }
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user.id, username: user.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Ошибка на сервере при авторизации' });
    }
});

// Создание заказа (пример, логика создания заказа не полностью реализована в вашем коде)
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { service_type, start_location, end_location } = req.body;
        const userId = req.user.userId;

        if (!service_type || !start_location || !end_location) {
            return res.status(400).json({ error: 'Все поля для заказа обязательны' });
        }

        // Здесь должна быть логика сохранения заказа в базу данных
        // Например:
        // const [result] = await pool.execute(
        //     'INSERT INTO orders (user_id, service_type, start_location, end_location, status) VALUES (?, ?, ?, ?, ?)',
        //     [userId, service_type, start_location, end_location, 'pending']
        // );
        // const orderId = result.insertId;

        // Временный ответ
        const newOrder = {
            id: Date.now(), // Временный ID
            user_id: userId,
            service_type,
            start_location,
            end_location,
            status: 'pending',
            created_at: new Date()
        };

        // Оповещение через Socket.IO о новом заказе (пример)
        io.emit('newOrder', newOrder); // Отправляем всем подключенным клиентам

        res.status(201).json({ message: 'Заказ успешно создан', order: newOrder });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Ошибка на сервере при создании заказа' });
    }
});


// Получение заказов пользователя
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Ошибка на сервере при получении заказов' });
    }
});


// Socket.IO соединение
io.on('connection', (socket) => {
    console.log('Пользователь подключился:', socket.id);

    // Пример обработки события от клиента
    socket.on('clientMessage', (data) => {
        console.log(`Сообщение от ${socket.id}:`, data);
        // Отправка ответа обратно этому же клиенту
        socket.emit('serverMessage', { text: 'Сообщение получено сервером!' });
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился:', socket.id);
    });
});


// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`API доступен по адресу http://localhost:${PORT}`);
    console.log(`Для подключения фронтенда ожидается адрес ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Обработка ошибок MySQL соединения
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Ошибка подключения к базе данных MySQL:', err);
        process.exit(1); // Завершаем процесс, если не удалось подключиться к БД
    } else {
        console.log('Успешное подключение к базе данных MySQL.');
        if (connection) connection.release();
    }
});