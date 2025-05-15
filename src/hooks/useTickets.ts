import { useState, useEffect } from 'react';
import { getTickets } from '../app/api/tickets';
import { Ticket } from '../app/types/api';
// import  { code, name } from '../app/tickets/page';

export const useTickets = (initialCode?: string, initialName?: string) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState(initialCode || '');
  const [name, setName] = useState(initialName || '');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets(code, name);
      console.log('Tickets data:', data);
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        setTickets([]);
        setError('Данные не являются массивом билетов.');
      }
    } catch (err: any) {
      setError('Не удалось загрузить билеты: ' + (err.message || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [code, name]);
  return { tickets, setTickets, loading, error, setError, fetchTickets, code, setCode, name, setName };
};