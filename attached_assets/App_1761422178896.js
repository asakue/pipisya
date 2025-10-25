const socket = io();
let localStream;
let remoteStream;
let peerConnection;
let currentCallTarget = null;
let isCalling = false;
let callStartTime = null;
let callTimerInterval = null;
let currentUsername = '';

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Элементы интерфейса
const loginScreen = document.getElementById('loginScreen');
const mainContainer = document.getElementById('mainContainer');
const usersList = document.getElementById('usersList');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const userCount = document.getElementById('userCount');
const connectionStatus = document.getElementById('connectionStatus');

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeSocketEvents();
});

function initializeApp() {
    // Инициализация обработчиков событий
    document.getElementById('joinButton').addEventListener('click', joinChat);
    document.getElementById('usernameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') joinChat();
    });
    
    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    document.getElementById('endCallButton').addEventListener('click', endCall);
    document.getElementById('acceptCallButton').addEventListener('click', acceptCall);
    document.getElementById('rejectCallButton').addEventListener('click', rejectCall);
    
    // Фокус на поле ввода имени
    document.getElementById('usernameInput').focus();
}

function initializeSocketEvents() {
    // Обработчики Socket.io
    socket.on('connect', () => {
        console.log('✅ Подключено к серверу');
        connectionStatus.className = 'connection-status connected';
        showNotification('Подключено к серверу', 'success');
    });

    socket.on('disconnect', () => {
        console.log('❌ Отключено от сервера');
        connectionStatus.className = 'connection-status disconnected';
        showNotification('Потеряно соединение с сервером', 'error');
    });

    socket.on('join-success', (data) => {
        console.log('✅ Успешное присоединение:', data);
        currentUsername = data.username;
        updateUsersList(data.users);
        showNotification(`Добро пожаловать, ${data.username}!`, 'success');
        
        // Показываем основной интерфейс
        loginScreen.style.display = 'none';
        mainContainer.style.display = 'grid';
        
        // Анимация появления
        setTimeout(() => {
            mainContainer.classList.add('loaded');
        }, 100);
    });

    socket.on('join-error', (error) => {
        console.error('❌ Ошибка присоединения:', error);
        showNotification(error, 'error');
    });

    socket.on('users-update', (users) => {
        updateUsersList(users);
    });

    socket.on('user-joined', (data) => {
        console.log('👋 Пользователь присоединился:', data.username);
        updateUsersList(data.users);
        addSystemMessage(`${data.username} присоединился к чату`);
        showNotification(`${data.username} присоединился`, 'success');
    });

    socket.on('user-left', (data) => {
        console.log('👋 Пользователь вышел:', data.username);
        updateUsersList(data.users);
        addSystemMessage(`${data.username} покинул чат`);
        showNotification(`${data.username} вышел`, 'warning');
    });

    socket.on('receive-message', (data) => {
        addMessage(data);
    });

    // WebRTC события
    socket.on('incoming-call', (data) => {
        console.log('📞 Входящий звонок от:', data.callerName);
        showIncomingCall(data.callerName, data.from);
    });

    socket.on('call-initiated', (data) => {
        showNotification(`Звонок пользователю ${data.target}...`, 'success');
    });

    socket.on('call-accepted', () => {
        console.log('✅ Звонок принят');
        startCallTimer();
        showNotification('Звонок принят', 'success');
    });

    socket.on('call-rejected', () => {
        console.log('❌ Звонок отклонен');
        showNotification('Звонок отклонен', 'error');
        endCall();
    });

    socket.on('call-ended', () => {
        console.log('📞 Звонок завершен');
        showNotification('Звонок завершен', 'warning');
        endCall();
    });

    socket.on('call-error', (error) => {
        showNotification(error, 'error');
        endCall();
    });

    // WebRTC сигналы
    socket.on('webrtc-offer', async (data) => {
        if (!peerConnection) await createPeerConnection();
        await handleOffer(data.offer);
    });

    socket.on('webrtc-answer', async (data) => {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(data.answer);
        }
    });

    socket.on('webrtc-ice-candidate', async (data) => {
        if (peerConnection) {
            await peerConnection.addIceCandidate(data.candidate);
        }
    });
}

function joinChat() {
    const usernameInput = document.getElementById('usernameInput');
    const username = usernameInput.value.trim();
    
    if (!username) {
        showNotification('Введите имя пользователя', 'error');
        usernameInput.focus();
        return;
    }
    
    if (username.length < 2) {
        showNotification('Имя должно содержать минимум 2 символа', 'error');
        usernameInput.focus();
        return;
    }
    
    console.log('🔄 Отправка запроса на присоединение:', username);
    socket.emit('join', username);
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;
    
    if (!currentUsername) {
        showNotification('Сначала присоединитесь к чату', 'error');
        return;
    }
    
    socket.emit('send-message', { message });
    messageInput.value = '';
}

function updateUsersList(users) {
    console.log('🔄 Обновление списка пользователей:', users);
    
    const usersListElement = document.getElementById('usersList');
    const userCountElement = document.getElementById('userCount');
    
    if (!users || users.length === 0) {
        usersListElement.innerHTML = '<div class="empty-state">Нет других пользователей</div>';
        userCountElement.textContent = '0';
        return;
    }
    
    // Фильтруем текущего пользователя
    const otherUsers = users.filter(user => user.username !== currentUsername);
    userCountElement.textContent = otherUsers.length;
    
    if (otherUsers.length === 0) {
        usersListElement.innerHTML = '<div class="empty-state">Нет других пользователей</div>';
        return;
    }
    
    usersListElement.innerHTML = '';
    otherUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <div class="user-info">
                <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
                <span class="user-name">${user.username}</span>
            </div>
            <button class="call-btn" onclick="startCall('${user.username}')">
                📞
            </button>
        `;
        usersListElement.appendChild(userElement);
    });
}

function addMessage(data) {
    const messagesElement = document.getElementById('messages');
    const messageElement = document.createElement('div');
    
    messageElement.className = `message ${data.username === currentUsername ? 'own' : 'other'}`;
    messageElement.innerHTML = `
        <div class="message-header">
            <span class="message-sender">${data.username}</span>
            <span class="message-time">${data.timestamp}</span>
        </div>
        <div class="message-text">${data.message}</div>
    `;
    
    messagesElement.appendChild(messageElement);
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

function addSystemMessage(message) {
    const messagesElement = document.getElementById('messages');
    const messageElement = document.createElement('div');
    
    messageElement.className = 'message system';
    messageElement.innerHTML = `
        <div class="message-text">${message}</div>
    `;
    
    messagesElement.appendChild(messageElement);
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// WebRTC функции
async function startCall(targetUsername) {
    if (isCalling) {
        showNotification('Уже идет звонок!', 'error');
        return;
    }
    
    try {
        console.log('📞 Начинаем звонок с:', targetUsername);
        
        // Получаем доступ к микрофону
        localStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        currentCallTarget = targetUsername;
        isCalling = true;
        
        // Создаем peer connection
        await createPeerConnection();
        
        // Отправляем запрос на звонок
        socket.emit('call-user', {
            targetUsername: targetUsername
        });
        
        // Показываем управление звонком
        document.getElementById('callControls').style.display = 'flex';
        document.getElementById('callStatus').textContent = `Звонок ${targetUsername}...`;
        
    } catch (error) {
        console.error('❌ Ошибка начала звонка:', error);
        showNotification('Ошибка доступа к микрофону: ' + error.message, 'error');
        isCalling = false;
    }
}

async function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);
    
    // Добавляем локальные треки
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
    }
    
    // Обработчик получения удаленного потока
    peerConnection.ontrack = (event) => {
        console.log('✅ Получен удаленный поток');
        remoteStream = event.streams[0];
        // Воспроизводим удаленный звук
        const remoteAudio = new Audio();
        remoteAudio.srcObject = remoteStream;
        remoteAudio.play().catch(e => console.error('Ошибка воспроизведения:', e));
    };
    
    // Обработчик ICE кандидатов
    peerConnection.onicecandidate = (event) => {
        if (event.candidate && currentCallTarget) {
            socket.emit('webrtc-ice-candidate', {
                target: getTargetSocketId(),
                candidate: event.candidate
            });
        }
    };
    
    return peerConnection;
}

async function handleOffer(offer) {
    if (!peerConnection) await createPeerConnection();
    await peerConnection.setRemoteDescription(offer);
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    
    socket.emit('webrtc-answer', {
        target: getTargetSocketId(),
        answer: answer
    });
}

function showIncomingCall(callerName, callerId) {
    document.getElementById('callerName').textContent = callerName;
    document.getElementById('incomingCall').style.display = 'flex';
    currentCallTarget = callerName;
    
    // Сохраняем ID звонящего для ответа
    document.getElementById('incomingCall').dataset.callerId = callerId;
}

async function acceptCall() {
    try {
        console.log('✅ Принимаем звонок');
        
        // Получаем доступ к микрофону
        localStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        isCalling = true;
        
        // Создаем peer connection
        await createPeerConnection();
        
        // Отправляем подтверждение
        const callerId = document.getElementById('incomingCall').dataset.callerId;
        socket.emit('accept-call', { callerId: callerId });
        
        // Показываем управление звонком
        document.getElementById('incomingCall').style.display = 'none';
        document.getElementById('callControls').style.display = 'flex';
        document.getElementById('callStatus').textContent = `Разговор с ${currentCallTarget}`;
        
        startCallTimer();
        
    } catch (error) {
        console.error('❌ Ошибка принятия звонка:', error);
        showNotification('Ошибка доступа к микрофону', 'error');
        rejectCall();
    }
}

function rejectCall() {
    const callerId = document.getElementById('incomingCall').dataset.callerId;
    socket.emit('reject-call', { callerId: callerId });
    document.getElementById('incomingCall').style.display = 'none';
    currentCallTarget = null;
}

function endCall() {
    console.log('📞 Завершаем звонок');
    
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    // Останавливаем таймер
    stopCallTimer();
    
    // Скрываем элементы управления
    document.getElementById('callControls').style.display = 'none';
    document.getElementById('incomingCall').style.display = 'none';
    
    // Отправляем событие завершения звонка
    if (currentCallTarget) {
        socket.emit('end-call', { 
            targetId: getTargetSocketId() 
        });
    }
    
    currentCallTarget = null;
    isCalling = false;
}

function getTargetSocketId() {
    // В реальном приложении нужно получить socket.id целевого пользователя
    // Для демонстрации используем broadcast
    return 'broadcast';
}

function startCallTimer() {
    callStartTime = new Date();
    callTimerInterval = setInterval(updateCallTimer, 1000);
}

function stopCallTimer() {
    if (callTimerInterval) {
        clearInterval(callTimerInterval);
        callTimerInterval = null;
    }
    document.getElementById('callTimer').textContent = '00:00';
}

function updateCallTimer() {
    if (!callStartTime) return;
    
    const now = new Date();
    const diff = Math.floor((now - callStartTime) / 1000);
    const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
    const seconds = (diff % 60).toString().padStart(2, '0');
    
    document.getElementById('callTimer').textContent = `${minutes}:${seconds}`;
}

// Обработка закрытия страницы
window.addEventListener('beforeunload', () => {
    if (isCalling) {
        endCall();
    }
});