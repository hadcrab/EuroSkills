'use client';
import { useState, useEffect } from 'react';
import { useReservationStore } from '../app/store/reservationStore';
import { getSeating } from '../app/api/concerts';
import { Row, ErrorResponse } from '../app/types/api';
import { Button } from '@/components/ui/button';

interface SeatSelectorProps {
  concertId: number;
  showId: number;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ concertId, showId }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { selectedSeats, updateReservation, reservation, timer, setTimer, clearReservation } =
    useReservationStore();

  useEffect(() => {
    const fetchSeating = async () => {
      try {
        const seating = await getSeating(concertId, showId);
        setRows(seating);
      } catch (err: any) {
        setError('Не удалось загрузить информацию о местах.');
      }
    };
    fetchSeating();
  }, [concertId, showId]);

  useEffect(() => {
    if (reservation) {
      const reservedUntil = new Date(reservation.reserved_until).getTime();
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((reservedUntil - now) / 1000));
        if (remaining === 0) {
          clearReservation();
          setError('Ваше резервирование истекло. Резервирование отменено.');
        } else {
          setTimer(
            `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`
          );
        }
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [reservation, setTimer, clearReservation]); 

  const handleSeatClick = async (row: Row, seatNumber: number) => {
    if (row.seats.unavailable.includes(seatNumber)) return;
    const seatIndex = selectedSeats.findIndex(
      (seat) => seat.rowId === row.id && seat.seatNumber === seatNumber
    );
    let newSeats;
    if (seatIndex >= 0) {
      newSeats = selectedSeats.filter((_, index) => index !== seatIndex);
    } else {
      newSeats = [...selectedSeats, { rowId: row.id, seatNumber, rowName: row.name }];
    }
    try {
      await updateReservation(concertId, showId, newSeats);
      setError(null);
    } catch (err: any) {
      const errorResponse: ErrorResponse = err;
      setError(errorResponse.error || 'Не удалось обновить резервирование.');
    }
  };

  return (
    <div>
      {error && <p className="text-destructive">{error}</p>}
      {timer && <p>Оставшееся время: {timer}</p>}
      {rows.map((row) => (
        <div key={row.id} className="flex justify-center my-2">
          <span className="mr-4">{row.name}</span>
          <div className="flex">
            {Array.from({ length: row.seats.total }, (_, i) => i + 1).map((seat) => (
              <Button
                key={seat}
                variant={
                  row.seats.unavailable.includes(seat)
                    ? 'ghost'
                    : selectedSeats.some((s) => s.rowId === row.id && s.seatNumber === seat)
                    ? 'default'
                    : 'outline'
                }
                className={`w-8 h-8 m-1 ${
                  row.seats.unavailable.includes(seat) ? 'cursor-not-allowed opacity-50' : ''
                }`}
                onClick={() => handleSeatClick(row, seat)}
                disabled={row.seats.unavailable.includes(seat)}
              >
                {seat}
              </Button>
            ))}
          </div>
        </div>
      ))}
      {/* <div className="mt-4">
        <h3>Выбранные места</h3>
        {selectedSeats.length === 0 ? (
          <p>Места не выбраны. Нажмите на место, чтобы зарезервировать.</p>
        ) : (
          <ul>
            {selectedSeats.map((seat, index) => (
              <li key={index}>
                Ряд: {seat.rowName}, Место: {seat.seatNumber}
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
};

export default SeatSelector;