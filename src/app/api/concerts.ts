import axios from 'axios';
import { Concert, Row, Reservation, Ticket, ReservationRequest, BookingRequest } from '../types/api';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

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
): Promise<Ticket[]> => {
  const response = await api.post(`/concerts/${concertId}/shows/${showId}/booking`, data);
  return response.data.tickets;
};
