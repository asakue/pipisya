import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";

interface User {
  id: string;
  username: string;
  socketId: string;
}

const onlineUsers = new Map<string, User>();

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer);

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('join', (username: string) => {
      if (!username || username.trim() === '') {
        socket.emit('join-error', 'Введите имя пользователя');
        return;
      }

      const trimmedUsername = username.trim();

      // Check if username is already taken
      const usernameExists = Array.from(onlineUsers.values()).some(
        user => user.username === trimmedUsername
      );
      
      if (usernameExists) {
        socket.emit('join-error', 'Имя уже занято');
        return;
      }

      // Add user
      const user: User = {
        id: socket.id,
        username: trimmedUsername,
        socketId: socket.id,
      };

      onlineUsers.set(socket.id, user);

      console.log('✅ User joined:', trimmedUsername);

      // Send success to current user
      socket.emit('join-success', {
        username: trimmedUsername,
        users: Array.from(onlineUsers.values()),
      });

      // Notify others
      socket.broadcast.emit('user-joined', {
        username: trimmedUsername,
        users: Array.from(onlineUsers.values()),
      });

      console.log('📊 Total users online:', onlineUsers.size);
    });

    socket.on('send-message', (data: { message: string }) => {
      const user = onlineUsers.get(socket.id);
      if (!user) return;

      const messageData = {
        username: user.username,
        message: data.message,
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };

      console.log('💬 Message from', user.username);
      io.emit('receive-message', messageData);
    });

    // WebRTC signaling
    socket.on('call-user', (data: { targetUsername: string }) => {
      const caller = onlineUsers.get(socket.id);
      if (!caller) return;

      console.log('📞 Call from', caller.username, 'to', data.targetUsername);

      const targetUser = Array.from(onlineUsers.values()).find(
        user => user.username === data.targetUsername
      );

      if (targetUser) {
        socket.to(targetUser.socketId).emit('incoming-call', {
          from: socket.id,
          callerName: caller.username,
        });
      }
    });

    socket.on('webrtc-offer', (data: { target: string; offer: RTCSessionDescriptionInit }) => {
      socket.to(data.target).emit('webrtc-offer', {
        offer: data.offer,
        caller: socket.id,
      });
    });

    socket.on('webrtc-answer', (data: { target: string; answer: RTCSessionDescriptionInit }) => {
      socket.to(data.target).emit('webrtc-answer', {
        answer: data.answer,
      });
    });

    socket.on('webrtc-ice-candidate', (data: { target: string; candidate: RTCIceCandidateInit }) => {
      socket.to(data.target).emit('webrtc-ice-candidate', {
        candidate: data.candidate,
      });
    });

    socket.on('accept-call', (data: { callerId: string }) => {
      socket.to(data.callerId).emit('call-accepted');
    });

    socket.on('reject-call', (data: { callerId: string }) => {
      socket.to(data.callerId).emit('call-rejected');
    });

    socket.on('end-call', (data: { targetId: string }) => {
      if (data.targetId) {
        socket.to(data.targetId).emit('call-ended');
      }
    });

    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (user) {
        onlineUsers.delete(socket.id);
        console.log('❌ User disconnected:', user.username);

        socket.broadcast.emit('user-left', {
          username: user.username,
          users: Array.from(onlineUsers.values()),
        });
      }
    });
  });

  return httpServer;
}
