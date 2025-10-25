import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  username: string;
}

interface Message {
  username: string;
  message: string;
  timestamp: string;
  type?: 'system' | 'user';
}

interface CallState {
  active: boolean;
  incoming: boolean;
  caller?: string;
  callerId?: string;
  target?: string;
  duration: number;
}

interface ChatContextType {
  socket: Socket | null;
  currentUser: string | null;
  users: User[];
  messages: Message[];
  callState: CallState;
  isConnected: boolean;
  joinChat: (username: string) => void;
  sendMessage: (message: string) => void;
  startCall: (targetUsername: string) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    active: false,
    incoming: false,
    duration: 0,
  });

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    const newSocket = io();
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('join-success', (data: { username: string; users: User[] }) => {
      const myUsername = data.username;
      setCurrentUser(myUsername);
      setUsers(data.users.filter(u => u.username !== myUsername));
      addSystemMessage(`Добро пожаловать, ${myUsername}!`);
    });

    newSocket.on('user-joined', (data: { username: string; users: User[] }) => {
      setCurrentUser(prevUser => {
        setUsers(data.users.filter(u => u.username !== prevUser));
        return prevUser;
      });
      addSystemMessage(`${data.username} присоединился к чату`);
    });

    newSocket.on('user-left', (data: { username: string; users: User[] }) => {
      setCurrentUser(prevUser => {
        setUsers(data.users.filter(u => u.username !== prevUser));
        return prevUser;
      });
      addSystemMessage(`${data.username} покинул чат`);
    });

    newSocket.on('receive-message', (data: { username: string; message: string; timestamp: string }) => {
      setMessages(prev => [...prev, { ...data, type: 'user' }]);
    });

    newSocket.on('incoming-call', async (data: { from: string; callerName: string }) => {
      console.log('Incoming call from:', data.callerName);
      setCallState({
        active: false,
        incoming: true,
        caller: data.callerName,
        callerId: data.from,
        duration: 0,
      });

      // Get microphone access for incoming call
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
        });
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    });

    newSocket.on('webrtc-offer', async (data: { offer: RTCSessionDescriptionInit; caller: string }) => {
      if (!peerConnectionRef.current) {
        await createPeerConnection(newSocket, data.caller);
      }
      await peerConnectionRef.current?.setRemoteDescription(data.offer);
      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);
      newSocket.emit('webrtc-answer', { target: data.caller, answer });
    });

    newSocket.on('webrtc-answer', async (data: { answer: RTCSessionDescriptionInit }) => {
      await peerConnectionRef.current?.setRemoteDescription(data.answer);
    });

    newSocket.on('webrtc-ice-candidate', async (data: { candidate: RTCIceCandidateInit }) => {
      await peerConnectionRef.current?.addIceCandidate(data.candidate);
    });

    newSocket.on('call-accepted', () => {
      console.log('Call accepted');
      setCallState(prev => {
        // Only start timer if not already active (caller side)
        if (!prev.active) {
          startCallTimer();
        }
        return { ...prev, incoming: false, active: true };
      });
    });

    newSocket.on('call-rejected', () => {
      console.log('Call rejected');
      cleanupCall();
    });

    newSocket.on('call-ended', () => {
      console.log('Call ended');
      cleanupCall();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      cleanupCall();
    };
  }, []);

  const createPeerConnection = async (socket: Socket, targetId: string) => {
    const pc = new RTCPeerConnection(configuration);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    pc.ontrack = (event) => {
      console.log('Received remote stream');
      remoteStreamRef.current = event.streams[0];
      const remoteAudio = new Audio();
      remoteAudio.srcObject = remoteStreamRef.current;
      remoteAudio.play().catch(e => console.error('Error playing audio:', e));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc-ice-candidate', { target: targetId, candidate: event.candidate });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const addSystemMessage = (message: string) => {
    setMessages(prev => [...prev, {
      username: 'System',
      message,
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
    }]);
  };

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallState(prev => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);
  };

  const cleanupCall = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach(track => track.stop());
      remoteStreamRef.current = null;
    }

    setCallState({ active: false, incoming: false, duration: 0 });
  };

  const joinChat = (username: string) => {
    if (socket) {
      socket.emit('join', username);
    }
  };

  const sendMessage = (message: string) => {
    if (socket && currentUser) {
      socket.emit('send-message', { message });
    }
  };

  const startCall = async (targetUsername: string) => {
    if (!socket) return;

    try {
      console.log('Starting call to:', targetUsername);
      
      // Get microphone access
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
      });

      const targetUser = users.find(u => u.username === targetUsername);
      if (!targetUser) {
        console.error('Target user not found:', targetUsername);
        return;
      }

      console.log('Creating peer connection for target:', targetUser.id);
      await createPeerConnection(socket, targetUser.id);
      
      const offer = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offer);
      
      console.log('Sending call-user and webrtc-offer');
      socket.emit('call-user', { targetUsername });
      socket.emit('webrtc-offer', { target: targetUser.id, offer });

      setCallState({
        active: false,
        incoming: false,
        target: targetUsername,
        duration: 0,
      });
    } catch (error) {
      console.error('Error starting call:', error);
      alert('Ошибка доступа к микрофону: ' + (error as Error).message);
      cleanupCall();
    }
  };

  const acceptCall = () => {
    if (socket && callState.callerId) {
      console.log('Accepting call from:', callState.callerId);
      socket.emit('accept-call', { callerId: callState.callerId });
      setCallState(prev => ({ ...prev, incoming: false, active: true }));
      startCallTimer();
    }
  };

  const rejectCall = () => {
    if (socket && callState.callerId) {
      socket.emit('reject-call', { callerId: callState.callerId });
      cleanupCall();
    }
  };

  const endCall = () => {
    if (socket) {
      const targetUser = users.find(u => u.username === callState.target || u.username === callState.caller);
      if (targetUser) {
        socket.emit('end-call', { targetId: targetUser.id });
      }
    }
    cleanupCall();
  };

  return (
    <ChatContext.Provider value={{
      socket,
      currentUser,
      users,
      messages,
      callState,
      isConnected,
      joinChat,
      sendMessage,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
