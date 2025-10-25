import { useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import UserListItem from './UserListItem';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import CallControls from './CallControls';
import IncomingCallModal from './IncomingCallModal';
import { useChat } from '@/contexts/ChatContext';

export default function ChatInterface() {
  const { 
    currentUser, 
    users, 
    messages, 
    callState, 
    isConnected,
    sendMessage, 
    startCall, 
    acceptCall, 
    rejectCall, 
    endCall 
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Users List */}
      <div className="w-80 flex flex-col border-r border-border bg-sidebar">
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground">
            <Users className="h-5 w-5" />
            Пользователи
          </h2>
          <div className="flex items-center gap-2">
            <div 
              className={`h-2 w-2 rounded-full ${isConnected ? 'bg-status-online' : 'bg-status-offline'}`}
              data-testid="status-connection"
            />
            <span className="text-xs text-muted-foreground" data-testid="text-user-count">
              {users.length}
            </span>
          </div>
        </div>

        <ScrollArea className="flex-1 p-3">
          {users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground italic">
                Нет других пользователей
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <UserListItem
                  key={user.id}
                  username={user.username}
                  onCall={() => startCall(user.username)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-card/50 p-4">
          <h1 className="text-lg font-semibold text-foreground">
            Общий чат
          </h1>
          {currentUser && (
            <div className="text-sm text-muted-foreground" data-testid="text-current-user">
              {currentUser}
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-4 bg-background">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  Добро пожаловать в чат!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Начните общение с другими пользователями
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  username={msg.username}
                  message={msg.message}
                  timestamp={msg.timestamp}
                  isOwn={msg.username === currentUser}
                  isSystem={msg.type === 'system'}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </ScrollArea>

        <MessageInput onSend={sendMessage} disabled={!currentUser} />
      </div>

      {/* Call Controls */}
      {callState.active && (
        <CallControls
          target={callState.target || callState.caller}
          duration={callState.duration}
          onEnd={endCall}
        />
      )}

      {/* Incoming Call Modal */}
      {callState.incoming && callState.caller && (
        <IncomingCallModal
          caller={callState.caller}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}
    </div>
  );
}
