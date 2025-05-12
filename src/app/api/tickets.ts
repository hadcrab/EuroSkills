import axios from 'axios';
import { Ticket, TicketRequest } from '../types/api';

const api = axios.create({
  baseURL: 'https://apic.polytech.kz/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const getTickets = async (data: TicketRequest): Promise<Ticket[]> => {
  const response = await api.post('/tickets', data);
  return response.data.tickets;
};

export const cancelTicket = async (ticketId: number, data: TicketRequest): Promise<void> => {
  await api.post(`/tickets/${ticketId}/cancel`, data);
};