import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';

interface LoginScreenProps {
  onJoin: (username: string) => void;
}

export default function LoginScreen({ onJoin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Введите имя пользователя');
      return;
    }
    
    if (username.trim().length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }
    
    setError('');
    onJoin(username.trim());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-primary/10 p-4">
              <Phone className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Чат с голосовыми звонками
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Войдите, чтобы начать общение
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              data-testid="input-username"
              type="text"
              placeholder="Введите ваше имя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="h-12"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-destructive" data-testid="text-error">
                {error}
              </p>
            )}
          </div>

          <Button 
            data-testid="button-join"
            type="submit" 
            className="h-12 w-full"
            size="lg"
          >
            Присоединиться
          </Button>
        </form>
      </div>
    </div>
  );
}
