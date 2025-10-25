// Динамическая загрузка стилей
function loadStyles() {
    const styles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Экран входа */
        .login-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .login-form {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-form h2 {
            margin-bottom: 30px;
            color: #333;
            font-weight: 600;
        }

        .login-form input {
            width: 100%;
            padding: 15px;
            margin: 15px 0;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .login-form input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .login-form button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .login-form button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        /* Основной контейнер */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 20px;
            height: 100vh;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
        }

        .container.loaded {
            opacity: 1;
            transform: translateY(0);
        }

        /* Панели */
        .panel {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .panel-header {
            padding: 20px;
            border-bottom: 1px solid #e1e5e9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.8);
        }

        .panel-header h3 {
            color: #333;
            font-weight: 600;
        }

        .user-count {
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
        }

        .connection-status {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .connection-status.connected {
            background: #10b981;
        }

        .connection-status.disconnected {
            background: #ef4444;
        }

        /* Список пользователей */
        .users-panel {
            min-height: 0;
        }

        .users-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
        }

        .user-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin: 8px 0;
            background: rgba(248, 250, 252, 0.8);
            border-radius: 12px;
            border: 1px solid rgba(226, 232, 240, 0.6);
            transition: all 0.3s ease;
        }

        .user-item:hover {
            background: rgba(241, 245, 249, 0.8);
            transform: translateX(5px);
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .user-avatar {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
        }

        .user-name {
            font-weight: 500;
            color: #374151;
        }

        .call-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .call-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
        }

        .empty-state {
            text-align: center;
            color: #6b7280;
            padding: 40px 20px;
            font-style: italic;
        }

        /* Чат */
        .chat-panel {
            min-height: 0;
        }

        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: rgba(248, 250, 252, 0.5);
        }

        .welcome-message {
            text-align: center;
            color: #6b7280;
            padding: 40px 20px;
        }

        .welcome-message h4 {
            margin-bottom: 10px;
            color: #374151;
        }

        .message {
            margin: 15px 0;
            padding: 15px;
            border-radius: 15px;
            max-width: 70%;
            position: relative;
            animation: messageAppear 0.3s ease;
        }

        @keyframes messageAppear {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.own {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }

        .message.other {
            background: white;
            color: #374151;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 5px;
        }

        .message.system {
            background: rgba(255, 255, 255, 0.8);
            color: #6b7280;
            font-style: italic;
            text-align: center;
            max-width: 100%;
            border: 1px dashed #d1d5db;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            font-size: 12px;
        }

        .message-sender {
            font-weight: 600;
        }

        .message-time {
            opacity: 0.7;
        }

        .message-text {
            line-height: 1.4;
            word-wrap: break-word;
        }

        /* Ввод сообщения */
        .message-input-container {
            padding: 20px;
            border-top: 1px solid #e1e5e9;
            display: flex;
            gap: 10px;
            background: rgba(255, 255, 255, 0.8);
        }

        .message-input-container input {
            flex: 1;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .message-input-container input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .send-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        /* Управление звонком */
        .call-controls {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: white;
            padding: 20px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            display: none;
            align-items: center;
            gap: 15px;
            z-index: 100;
            animation: slideInUp 0.3s ease;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .call-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .call-icon {
            font-size: 24px;
        }

        .call-details {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .call-status {
            font-weight: 600;
            color: #374151;
        }

        .call-timer {
            font-size: 12px;
            color: #6b7280;
        }

        .end-call-button {
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .end-call-button:hover {
            background: #dc2626;
            transform: scale(1.05);
        }

        /* Входящий звонок */
        .incoming-call-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }

        .incoming-call-modal {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            animation: modalAppear 0.3s ease;
        }

        @keyframes modalAppear {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .caller-avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 20px;
        }

        .caller-info {
            margin-bottom: 30px;
        }

        .caller-name {
            font-size: 24px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }

        .incoming-text {
            color: #6b7280;
            font-size: 16px;
        }

        .call-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }

        .accept-call-button, .reject-call-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px;
            border: none;
            border-radius: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .accept-call-button {
            background: #10b981;
            color: white;
        }

        .accept-call-button:hover {
            background: #059669;
            transform: scale(1.05);
        }

        .reject-call-button {
            background: #ef4444;
            color: white;
        }

        .reject-call-button:hover {
            background: #dc2626;
            transform: scale(1.05);
        }

        /* Уведомления */
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
        }

        .notification {
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #667eea;
            animation: notificationSlide 0.3s ease;
        }

        @keyframes notificationSlide {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .notification.success {
            border-left-color: #10b981;
        }

        .notification.error {
            border-left-color: #ef4444;
        }

        .notification.warning {
            border-left-color: #f59e0b;
        }

        /* Адаптивность */
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
                padding: 10px;
            }

            .users-panel {
                display: none;
            }

            .call-controls {
                bottom: 20px;
                right: 20px;
                left: 20px;
            }

            .message {
                max-width: 85%;
            }
        }

        /* Скроллбар */
        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.5);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(107, 114, 128, 0.7);
        }

        /* Анимации */
        .fade-in {
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .slide-in-right {
            animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Состояния */
        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;

    const styleElement = document.getElementById('app-styles');
    styleElement.textContent = styles;
}

// Инициализация стилей при загрузке
document.addEventListener('DOMContentLoaded', loadStyles);