import { Ticket, TicketRequest } from '../types/api';
import api from '@/lib/api';
import axios from 'axios';

export const getTickets = async (code: string, name: string): Promise<Ticket[]> => {
  const response = await api.post('/tickets', { code, name });
  return response.data.tickets;
};

export const createTicket = async (data: { concert_id: number; show_id: number; user_id: string }): Promise<any> => {
  const response = await api.post(`/tickets`, data);
  return response.data.ticket;
};

export const cancelTicket = async (ticketId: number, code: string, name: string ): Promise<void> => {
  await api.post(`/tickets/${ticketId}/cancel`, { code, name });
  alert(`Билет с кодом ${code} отменен.`);
};