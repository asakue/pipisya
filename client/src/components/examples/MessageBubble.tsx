import MessageBubble from '../MessageBubble';

export default function MessageBubbleExample() {
  return (
    <div className="p-4 space-y-2">
      <MessageBubble 
        username="Алексей" 
        message="Привет! Как дела?" 
        timestamp="14:32" 
      />
      <MessageBubble 
        username="Вы" 
        message="Отлично, спасибо! У тебя как?" 
        timestamp="14:33" 
        isOwn 
      />
      <MessageBubble 
        username="System" 
        message="Мария присоединилась к чату" 
        timestamp="14:34" 
        isSystem 
      />
      <MessageBubble 
        username="Алексей" 
        message="Тоже хорошо! Давай созвонимся?" 
        timestamp="14:35" 
      />
    </div>
  );
}
