import IncomingCallModal from '../IncomingCallModal';

export default function IncomingCallModalExample() {
  return (
    <IncomingCallModal 
      caller="Алексей" 
      onAccept={() => console.log('Call accepted')} 
      onReject={() => console.log('Call rejected')} 
    />
  );
}
