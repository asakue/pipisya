interface MessageBubbleProps {
  username: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
  isSystem?: boolean;
}

export default function MessageBubble({ 
  username, 
  message, 
  timestamp, 
  isOwn = false,
  isSystem = false 
}: MessageBubbleProps) {
  if (isSystem) {
    return (
      <div className="my-4 flex justify-center" data-testid="message-system">
        <div className="max-w-md rounded-md border border-dashed border-border bg-muted/30 px-4 py-2">
          <p className="text-center text-xs text-muted-foreground italic">
            {message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mb-3 flex ${isOwn ? 'justify-end' : 'justify-start'}`}
      data-testid={`message-${isOwn ? 'own' : 'other'}`}
    >
      <div 
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwn 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card border border-card-border text-card-foreground'
        }`}
      >
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-xs font-semibold" data-testid="text-sender">
            {username}
          </span>
          <span className="text-xs opacity-70" data-testid="text-timestamp">
            {timestamp}
          </span>
        </div>
        <p className="text-sm leading-relaxed break-words" data-testid="text-message">
          {message}
        </p>
      </div>
    </div>
  );
}
