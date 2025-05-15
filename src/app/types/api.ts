export interface Location {
  id: number;
  name: string;
}

export interface Show {
  id: number;
  start: string;
  end: string;
}

export interface Concert {
  id: number;
  artist: string;
  location: Location;
  shows: Show[];
}

export interface Row {
  id: number;
  name: string;
  seats: {
    total: number;
    unavailable: number[];
  };
}

export interface Reservation {
  reserved: boolean;
  reservation_token: string;
  reserved_until: string;
}

export interface Ticket {
  id: number;
  concert_id: number;
  show_id: number;
  user_id: string;
  code: string;
  name: string;
  created_at: string;
  row: {
    id: number;
    name: string;
  };
  seat: number;
  show: {
    id: number;
    start: string;
    end: string;
    concert: {
      id: number;
      artist: string;
      location: {
        id: number;
        name: string;
      };
    };
  };
}

export interface TicketRequest {
  concert_id: number;
  show_id: number;
  user_id: string;
}

export interface GetTicketsRequest {
  code: string;
  name: string;
}

export interface ReservationRequest {
  reservation_token?: string;
  reservations: { row: number; seat: number }[];
  duration?: number;
}

export interface BookingRequest {
  reservation_token: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface BookingResult {
  tickets: Ticket[];
  code: string;
  name: string;
}

export interface TicketRequest {
  code: string;
  name: string;
}

export interface ErrorResponse {
  error: string;
  fields?: Record<string, string>;
}

