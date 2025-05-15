'use client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Ticket } from '@/app/types/api';

interface TicketDisplayProps {
  ticket: Ticket;
  onCancel: (ticketId: number) => void;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ ticket, onCancel }) => {
  const handleCancel = () => {
    if (window.confirm('Вы уверены, что хотите отменить этот билет?')) {
      onCancel(Number(ticket.id)); 
    }
  };

  return (
    <div className="border p-4 rounded-md">
      <p><strong>ID Билета:</strong> {ticket.id}</p>
      <p><strong>Код:</strong> {ticket.code}</p>
      <p><strong>Имя:</strong> {ticket.name}</p>
      <p><strong>Концерт:</strong> {ticket.show.concert.artist} ({ticket.show.concert.location.name})</p>
      <p><strong>Шоу:</strong> {new Date(ticket.show.start).toLocaleString()} - {new Date(ticket.show.end).toLocaleString()}</p>
      <p><strong>Ряд:</strong> {ticket.row.name}</p>
      <p><strong>Место:</strong> {ticket.seat}</p>
      <p><strong>Дата создания:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
      <Button variant="destructive" onClick={handleCancel} className="mt-2">
        Отменить
      </Button>
    </div>
  );
};

export default TicketDisplay;