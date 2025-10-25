import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface CallControlsProps {
  target?: string;
  duration: number;
  onEnd: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function CallControls({ target, duration, onEnd }: CallControlsProps) {
  return (
    <div 
      className="fixed bottom-6 right-6 rounded-lg border border-card-border bg-card p-4 shadow-lg"
      data-testid="call-controls"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-online/20">
            <Phone className="h-5 w-5 text-status-online" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground" data-testid="text-call-target">
              {target ? `Звонок с ${target}` : 'Идет звонок...'}
            </div>
            <div className="text-xs text-muted-foreground font-mono" data-testid="text-call-duration">
              {formatDuration(duration)}
            </div>
          </div>
        </div>
        
        <Button
          data-testid="button-end-call"
          size="icon"
          variant="destructive"
          onClick={onEnd}
          className="flex-shrink-0"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
