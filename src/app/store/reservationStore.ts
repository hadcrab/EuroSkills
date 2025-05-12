import { create } from 'zustand';
import { makeReservation } from '../api/concerts';
import { Reservation, ReservationRequest } from '../types/api';

interface Seat {
    rowId: number;
    seatNumber: number;
    rowName: string;
}

interface ReservationState {
    reservation: Reservation | null;
    selectedSeats: Seat[];
    timer: string | null;
    setReservation: (reservation: Reservation) => void;
    setSelectedSeats: (seats: Seat[]) => void;
    updateReservation: (
      concertId: number,
      showId: number,
      seats: Seat[]
    ) => Promise<Reservation>;
    clearReservation: () => void;
    setTimer: (time: string | null) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
    reservation: null,
    selectedSeats: [],
    timer: null,
    setReservation: (reservation) => set({ reservation }),
    setSelectedSeats: (seats) => set({ selectedSeats: seats }),
    updateReservation: async (concertId, showId, seats) => {
      try {
        const data: ReservationRequest = {
          reservations: seats.map((seat) => ({
            row: seat.rowId,
            seat: seat.seatNumber,
          })),
          duration: 300,
        };
        const currentReservation = useReservationStore.getState().reservation;
        if (currentReservation) {
          data.reservation_token = currentReservation.reservation_token;
        }
        const response = await makeReservation(concertId, showId, data);
        set({ reservation: response, selectedSeats: seats });
        return response;
      } catch (error: any) {
        throw error.response?.data || error;
      }
    },
    clearReservation: () => set({ reservation: null, selectedSeats: [], timer: null }),
    setTimer: (time) => set({ timer: time }),
  }));