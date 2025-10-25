import { useState, useEffect } from 'react';
import CallControls from '../CallControls';

export default function CallControlsExample() {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-48">
      <CallControls 
        target="Алексей" 
        duration={duration} 
        onEnd={() => console.log('End call')} 
      />
    </div>
  );
}
