'use client';
import { useState } from 'react';
import { createTicket } from './api/tickets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TicketFormProps {
  onTicketCreated: (ticket: any) => void;
}

interface TicketFormProps {
  onBookingSuccess: () => void; 
}

const TicketForm: React.FC<TicketFormProps> = ({ onTicketCreated }) => {
  const [ticketData, setTicketData] = useState({ concertId: '', showId: '', userId: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const newTicket = await createTicket({
        concert_id: parseInt(ticketData.concertId),
        show_id: parseInt(ticketData.showId),
        user_id: ticketData.userId,
      });
      onTicketCreated(newTicket);
      setTicketData({ concertId: '', showId: '', userId: '' });
      setError(null);
      
    } catch (err: any) {
      setError('Не удалось создать билет.');
    }
  
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="concertId">ID Концерта</Label>
          <Input
            id="concertId"
            value={ticketData.concertId}
            onChange={(e) => setTicketData({ ...ticketData, concertId: e.target.value })}
            placeholder="Введите ID концерта"
          />
        </div>
        <div>
          <Label htmlFor="showId">ID Шоу</Label>
          <Input
            id="showId"
            value={ticketData.showId}
            onChange={(e) => setTicketData({ ...ticketData, showId: e.target.value })}
            placeholder="Введите ID шоу"
          />
        </div>
        <div>
          <Label htmlFor="userId">ID Пользователя</Label>
          <Input
            id="userId"
            value={ticketData.userId}
            onChange={(e) => setTicketData({ ...ticketData, userId: e.target.value })}
            placeholder="Введите ID пользователя"
          />
        </div>
        <Button type="submit">Создать билет</Button>
      </form>
    </div>
  );
};

export default TicketForm;