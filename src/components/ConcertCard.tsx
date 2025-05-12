'use client';
import Link from 'next/link';
import { format } from 'date-fns';
import { Concert, Show } from '../app/types/api';
import { Button } from '@/components/ui/button';

interface ConcertCardProps {
  concert: Concert;
  show: Show;
}

const ConcertCard: React.FC<ConcertCardProps> = ({ concert, show }) => {
  const startDate = new Date(show.start);
  const endDate = new Date(show.end);
  return (
    <Link href={`/booking/${concert.id}/${show.id}`}>
      <div className="border rounded-md p-4 hover:shadow-lg transition bg-card text-card-foreground">
        <p>{format(startDate, 'dd/MM/yyyy')}</p>
        <h2 className="text-xl font-semibold">{concert.artist}</h2>
        <p>{concert.location.name}</p>
        <p>
          {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
        </p>
        <Button className="mt-2">Book Now</Button>
      </div>
    </Link>
  );
};

export default ConcertCard;