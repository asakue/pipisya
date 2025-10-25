const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Раздаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Добавляем роут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const users = new Map();

io.on('connection', (socket) => {
    console.log('✅ Новый пользователь подключился:', socket.id);

    socket.on('join', (username) => {
        console.log('🔄 Попытка присоединения:', username);
        
        if (!username || username.trim() === '') {
            socket.emit('join-error', 'Введите имя пользователя');
            return;
        }

        const trimmedUsername = username.trim();

        // Проверяем уникальность имени
        const usernameExists = Array.from(users.values()).some(user => user.username === trimmedUsername);
        if (usernameExists) {
            socket.emit('join-error', 'Имя уже занято');
            return;
        }

        // Добавляем пользователя
        users.set(socket.id, {
            id: socket.id,
            username: trimmedUsername,
            joinedAt: new Date()
        });

        console.log('✅ Пользователь добавлен:', trimmedUsername);
        
        // Отправляем успех текущему пользователю
        socket.emit('join-success', {
            username: trimmedUsername,
            users: Array.from(users.values())
        });

        // Уведомляем других
        socket.broadcast.emit('user-joined', {
            username: trimmedUsername,
            users: Array.from(users.values())
        });

        console.log('📊 Всего пользователей онлайн:', users.size);
    });

    socket.on('send-message', (data) => {
        const user = users.get(socket.id);
        if (!user) return;

        const messageData = {
            username: user.username,
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        };

        console.log('💬 Сообщение от', user.username);
        io.emit('receive-message', messageData);
    });

    // WebRTC handlers
    socket.on('call-user', (data) => {
        const caller = users.get(socket.id);
        if (!caller) return;

        console.log('📞 Звонок от', caller.username, 'к', data.targetUsername);
        
        // Находим целевого пользователя
        const targetUser = Array.from(users.values()).find(user => user.username === data.targetUsername);
        if (targetUser) {
            socket.to(targetUser.id).emit('incoming-call', {
                from: socket.id,
                callerName: caller.username
            });
        }
    });

    socket.on('webrtc-offer', (data) => {
        socket.to(data.target).emit('webrtc-offer', {
            offer: data.offer,
            caller: socket.id
        });
    });

    socket.on('webrtc-answer', (data) => {
        socket.to(data.target).emit('webrtc-answer', {
            answer: data.answer
        });
    });

    socket.on('webrtc-ice-candidate', (data) => {
        socket.to(data.target).emit('webrtc-ice-candidate', {
            candidate: data.candidate
        });
    });

    socket.on('accept-call', (data) => {
        socket.to(data.callerId).emit('call-accepted');
    });

    socket.on('reject-call', (data) => {
        socket.to(data.callerId).emit('call-rejected');
    });

    socket.on('end-call', (data) => {
        if (data.targetId) {
            socket.to(data.targetId).emit('call-ended');
        }
    });

    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);
            console.log('❌ Пользователь отключился:', user.username);
            
            socket.broadcast.emit('user-left', {
                username: user.username,
                users: Array.from(users.values())
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});