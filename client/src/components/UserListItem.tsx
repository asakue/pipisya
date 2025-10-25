import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserListItemProps {
  username: string;
  onCall: () => void;
}

export default function UserListItem({ username, onCall }: UserListItemProps) {
  const initials = username.charAt(0).toUpperCase();

  return (
    <div 
      className="flex items-center justify-between gap-3 rounded-md border border-card-border bg-card p-3 hover-elevate"
      data-testid={`user-item-${username}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-primary/20 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground truncate" data-testid={`text-username-${username}`}>
          {username}
        </span>
      </div>
      
      <Button
        data-testid={`button-call-${username}`}
        size="icon"
        variant="ghost"
        className="flex-shrink-0 h-9 w-9 text-status-online hover:text-status-online"
        onClick={onCall}
      >
        <Phone className="h-4 w-4" />
      </Button>
    </div>
  );
}
