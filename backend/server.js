const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'super-secret-key';

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Mock Data
let users = [
    { id: 1, email: 'admin@example.com', password: 'password', role: 'admin' },
    { id: 2, email: 'user1@example.com', password: 'password', role: 'user' },
    { id: 3, email: 'user2@example.com', password: 'password', role: 'user' }
];

let tasks = [
    { id: 1, title: 'Learn Angular 21', userId: 1 },
    { id: 2, title: 'Admin Work', userId: 1 },
    { id: 3, title: 'User 1 Task', userId: 2 },
    { id: 4, title: 'User 2 Task', userId: 3 }
];

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token Verification Error:', err.message);
            return res.sendStatus(403);
        }
        console.log('Decoded User:', user);
        req.user = user;
        next();
    });
};

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY);
        res.json({ id: user.id, token, role: user.role, email: user.email });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
    if (req.user.role === 'admin') {
        res.json(tasks);
    } else {
        // console.log('User ID:', req.user.id);
        // console.log('Tasks:', tasks);
        // console.log('Filtered:', tasks.filter(t => t.userId === req.user.id));
        res.json(tasks.filter(t => t.userId === req.user.id));
    }
});

app.post('/api/tasks', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can add tasks' });
    
    const newTask = { 
        id: Math.max(...tasks.map(t => t.id)) + 1, 
        title: req.body.title, 
        userId: parseInt(req.body.userId) 
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can delete tasks' });

    tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    res.sendStatus(204);
});

// Users (Admin Only)
app.get('/api/users', authenticateToken, (req, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    res.json(users.map(u => ({ id: u.id, email: u.email, role: u.role })));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
