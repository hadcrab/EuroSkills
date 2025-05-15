import api from '@/lib/api';
import { Concert, Row, Reservation, Ticket, ReservationRequest, BookingRequest, BookingResult } from '../types/api';;

export const getConcerts = async (): Promise<Concert[]> => {
  const response = await api.get('/concerts');
  return response.data.concerts;
};

export const getConcert = async (concertId: number): Promise<Concert> => {
  const response = await api.get(`/concerts/${concertId}`);
  return response.data.concert;
};

export const getSeating = async (concertId: number, showId: number): Promise<Row[]> => {
  const response = await api.get(`/concerts/${concertId}/shows/${showId}/seating`);
  return response.data.rows;
};

export const makeReservation = async (
  concertId: number,
  showId: number,
  data: ReservationRequest
): Promise<Reservation> => {
  const response = await api.post(`/concerts/${concertId}/shows/${showId}/reservation`, data);
  return response.data;
};


export const bookTickets = async (
  concertId: number,
  showId: number,
  data: BookingRequest
): Promise<{ code: string, name: string }> => {
  const response = await api.post(`/concerts/${concertId}/shows/${showId}/booking`, data);
  const tickets = response.data.tickets;

  if (!tickets || tickets.length === 0) {
    throw new Error('Билеты не найдены в ответе бронирования.');
  }

  const { code, name } = tickets[0];
  alert(`Ваши билеты: ${tickets.map((ticket: Ticket) => `Код: ${ticket.code}, Имя: ${ticket.name}`).join('\n')}`);

  return { code, name };
};