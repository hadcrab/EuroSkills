'use client';
import { useEffect } from 'react';
import { useConcertStore } from '../store/concertStore';
import { getConcerts } from '../api/concerts';
import Header from '@/components/Header';
import ConcertCard from '@/components/ConcertCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
    const { concerts, filters, setConcerts, setFilters, resetFilters, filteredConcerts } = useConcertStore();
    const filtered = filteredConcerts();
    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const data = await getConcerts();
                setConcerts(data);
            } catch (err) {
                console.error('Ошибка загрузки концертов:', err);
            }
        };
        if (concerts.length === 0) {
            fetchConcerts();
        }
    }, [concerts, setConcerts]);
    const locations = ['All locations', ...new Set(concerts.map((c) => c.location.name))];
    const artists = [
        'All Artists',
        ...new Set(concerts.filter((c) => c.shows.length > 0).map((c) => c.artist)),
    ];

    const isFilterActive =
        filters.location !== 'All locations' ||
        filters.artist !== 'All Artists' ||
        filters.date !== '';

    return (
        <div>
            <Header />
            <main className="p-4">
                <h2 className="text-2xl mb-4">Checkout these amazing concerts in Graz.</h2>
                <div className="mb-4 flex gap-2">
                    <Select
                        value={filters.location}
                        onValueChange={(value) => setFilters({ location: value })}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                    {loc}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.artist}
                        onValueChange={(value) => setFilters({ artist: value })}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select artist" />
                        </SelectTrigger>
                        <SelectContent>
                            {artists.map((artist) => (
                                <SelectItem key={artist} value={artist}>
                                    {artist}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ date: e.target.value })}
                        className="w-[180px]"
                    />
                    {isFilterActive && (
                        <Button variant="destructive" onClick={resetFilters}>
                            Очистить
                        </Button>
                    )}
                </div>
                {filtered.length === 0 ? (
                    <p>Нет шоу, соответствующих текущим критериям фильтра.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((concert) =>
                            concert.shows.map((show) => (
                                <ConcertCard
                                    key={`${concert.id}-${show.id}`}
                                    concert={concert}
                                    show={show}
                                />
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );


}

export default Home;