import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface IncomingCallModalProps {
  caller: string;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallModal({ caller, onAccept, onReject }: IncomingCallModalProps) {
  const initials = caller.charAt(0).toUpperCase();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      data-testid="modal-incoming-call"
    >
      <div className="w-full max-w-sm rounded-lg border border-card-border bg-card p-8 shadow-xl">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h2 className="mb-2 text-xl font-semibold text-foreground" data-testid="text-caller">
            {caller}
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">
            Входящий звонок...
          </p>
          
          <div className="flex gap-4">
            <Button
              data-testid="button-reject-call"
              variant="destructive"
              size="lg"
              onClick={onReject}
              className="flex-1"
            >
              <PhoneOff className="mr-2 h-5 w-5" />
              Отклонить
            </Button>
            <Button
              data-testid="button-accept-call"
              size="lg"
              onClick={onAccept}
              className="flex-1 bg-status-online hover:bg-status-online/90"
            >
              <Phone className="mr-2 h-5 w-5" />
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
