'use client';
import Header from '@/components/Header';
import TicketDisplay from '@/app/TicketDisplay';
import { cancelTicket } from '../api/tickets';
import { useTickets } from '@/hooks/useTickets';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Ticket } from '@/app/types/api';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const TicketsPage: React.FC = () => {
  const { tickets, setTickets, loading, error, setError, fetchTickets, code, setCode, name, setName } = useTickets();
  const [showError, setShowError] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlCode = searchParams.get('code');
    const urlName = searchParams.get('name');
    if (urlCode && urlName) {
      setCode(decodeURIComponent(urlCode));
      setName(decodeURIComponent(urlName));
      const fetchOnMount = async () => {
        setShowError(false);
        try {
          await fetchTickets();
        } catch (err: any) {
          setError('Не удалось загрузить билеты: ' + (err.message || 'Неизвестная ошибка'));
          setShowError(true);
        }
      };
      fetchOnMount();
    }
  }, [searchParams, setCode, setName]);

  const handleFetchTickets = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Пожалуйста, введите код билета и имя.');
      setShowError(true);
      return;
    }
    setShowError(false);
    try {
      await fetchTickets();
      if (tickets.length === 0 && !error) {
        setError('Билеты не найдены. Проверьте код и имя.');
        setShowError(true);
      }
    } catch (err: any) {
      setError('Не удалось загрузить билеты: ' + (err.message || 'Неизвестная ошибка'));
      setShowError(true);
    }
  };

  const handleTicketCanceled = async (ticketId: number, ticketCode: string) => {
    if (!name.trim()) {
      setError('Пожалуйста, введите имя.');
      setShowError(true);
      return;
    }
    if (!tickets.length) {
      setError('Список билетов пуст. Загрузите билеты сначала.');
      setShowError(true);
      return;
    }
    try {
      await cancelTicket(ticketId, ticketCode, name);
      setTickets((prev: Ticket[]) => prev.filter((ticket: Ticket) => ticket.id !== ticketId));
    } catch (err: any) {
      setError('Не удалось отменить билет: ' + (err.message || 'Неизвестная ошибка'));
      setShowError(true);
    }
  };

  return (
    <div>
      <Header />
      <main className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Мои билеты</h2>

        <div className="mb-6">
          <form onSubmit={handleFetchTickets} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="code">Код билета</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Введите код билета (например, QVLJTWK4Y7)"
              />
            </div>
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя (например, John Doe)"
              />
            </div>
            <Button type="submit" disabled={loading || !code.trim() || !name.trim()}>
              {loading ? 'Загрузка...' : 'Показать билеты'}
            </Button>
          </form>
        </div>

        {showError && error && !loading && (
          <div className="text-destructive mb-4">
            <p>{error}</p>
          </div>
        )}
        {loading && <p>Загрузка...</p>}
        {!loading && tickets.length === 0 && code.trim() && name.trim() && !showError && (
          <p>Билеты не найдены. Проверьте код и имя.</p>
        )}
        {!loading && tickets.length > 0 && (
          <div className="space-y-4 mb-6">
            {tickets.map((ticket: Ticket) => (
              <TicketDisplay
                key={ticket.id}
                ticket={ticket}
                onCancel={(ticketId) => handleTicketCanceled(ticketId, ticket.code)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TicketsPage;