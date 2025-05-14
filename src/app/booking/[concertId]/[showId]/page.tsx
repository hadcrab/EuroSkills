/**
 * File: src/app/booking/[concertId]/[showId]/page.tsx
 */
'use client';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import SeatSelector from '@/components/SeatSelector';
import BookingForm from '@/app/BookingForm';

const BookingPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const concertId = parseInt(params.concertId as string);
  const showId = parseInt(params.showId as string);

  const handleBookingSuccess = (tickets: any[]) => {
    router.push('/tickets');
  };

  return (
    <div>
      <Header />
      <main className="p-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Выберите места и забронируйте</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Выбор мест</h3>
            <SeatSelector concertId={concertId} showId={showId} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Данные бронирования</h3>
            <BookingForm
              concertId={concertId}
              showId={showId}
              onBookingSuccess={handleBookingSuccess}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;