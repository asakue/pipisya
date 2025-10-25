import MessageInput from '../MessageInput';

export default function MessageInputExample() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <MessageInput onSend={(msg) => console.log('Sending:', msg)} />
    </div>
  );
}
