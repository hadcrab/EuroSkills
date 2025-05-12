'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">EuroSkills Concerts</h1>
      <Link href="/tickets">
        <Button variant="secondary">Get Tickets</Button>
      </Link>
    </header>
  );
};

export default Header;
