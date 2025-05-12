import { create } from 'zustand';
import { Concert } from '../types/api';

interface ConcertState {
  concerts: Concert[];
  filters: {
    location: string;
    artist: string;
    date: string;
  };
  setConcerts: (concerts: Concert[]) => void;
  setFilters: (filters: Partial<ConcertState['filters']>) => void;
  resetFilters: () => void;
  filteredConcerts: () => Concert[];
}

export const useConcertStore = create<ConcertState>((set, get) => ({
  concerts: [],
  filters: {
    location: 'All locations',
    artist: 'All Artists',
    date: '',
  },
  setConcerts: (concerts) => set({ concerts }),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  resetFilters: () => set({
    filters: {
      location: 'All locations',
      artist: 'All Artists',
      date: '',
    },
  }),
  filteredConcerts: () => {
    const { concerts, filters } = get();
    return concerts
      .filter((concert) => {
        const shows = concert.shows.filter((show) => {
          const showDate = new Date(show.start).toISOString().split('T')[0];
          return (
            (filters.location === 'All locations' || concert.location.name === filters.location) &&
            (filters.artist === 'All Artists' || concert.artist === filters.artist) &&
            (filters.date === '' || showDate === filters.date)
          );
        });
        return shows.length > 0;
      })
      .map((concert) => ({
        ...concert,
        shows: concert.shows.filter((show) => {
          const showDate = new Date(show.start).toISOString().split('T')[0];
          return (
            (filters.location === 'All locations' || concert.location.name === filters.location) &&
            (filters.artist === 'All Artists' || concert.artist === filters.artist) &&
            (filters.date === '' || showDate === filters.date)
            
          );
        }),
      }));
  },
}));