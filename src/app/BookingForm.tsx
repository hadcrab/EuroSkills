'use client';
import { useState } from 'react';
import { useReservationStore } from './store/reservationStore';
import { bookTickets } from './api/concerts';
import { BookingRequest, BookingResult, ErrorResponse } from './types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BookingFormProps {
  concertId: number;
  showId: number;
  onBookingSuccess: (result: { code: string; name: string }) => void;
}


const BookingForm: React.FC<BookingFormProps> = ({ concertId, showId, onBookingSuccess }) => {
  const { reservation, selectedSeats } = useReservationStore();
  const [formData, setFormData] = useState<Partial<BookingRequest>>({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const countries = [
  'Albania',
  'Andorra',
  'Armenia',
  'Austria',
  'Azerbaijan',
  'Belarus',
  'Belgium',
  'Bosnia and Herzegovina',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Georgia',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Kazakhstan',
  'Kosovo',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Moldova',
  'Monaco',
  'Montenegro',
  'Netherlands',
  'North Macedonia',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'San Marino',
  'Serbia',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'Turkey',
  'Ukraine',
  'United',
  'Vatican City'
];;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    if (!formData.address) newErrors.address = 'Адрес обязателен';
    if (!formData.city) newErrors.city = 'Город обязателен';
    if (!formData.zip) newErrors.zip = 'Почтовый индекс обязателен';
    if (!formData.country) newErrors.country = 'Страна обязательна';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) {
      setApiError('Нет активного резервирования. Выберите места.');
      return;
    }
    if (!validateForm()) return;

    try {
      const bookingData: BookingRequest = {
        reservation_token: reservation.reservation_token,
        name: formData.name!,
        address: formData.address!,
        city: formData.city!,
        zip: formData.zip!,
        country: formData.country!,
      };
      const tickets = await bookTickets(concertId, showId, bookingData);
      onBookingSuccess(tickets); 
      setApiError(null);
      setFormData({ name: '', address: '', city: '', zip: '', country: '' });
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response?.data || {
        error: 'Не удалось создать билеты',
      };
      setApiError(errorResponse.error);
      if (errorResponse.fields) {
        setErrors(errorResponse.fields);
      }
    }
  };

  const handleInputChange = (field: keyof BookingRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}
      <h3 className="text-lg font-semibold mb-4">Данные для бронирования</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
            placeholder="Введите ваше имя"
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="address">Адрес</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={errors.address ? 'border-destructive' : ''}
            placeholder="Введите адрес"
          />
          {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
        </div>
        <div>
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={errors.city ? 'border-destructive' : ''}
            placeholder="Введите город"
          />
          {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
        </div>
        <div>
          <Label htmlFor="zip">Почтовый индекс</Label>
          <Input
            id="zip"
            value={formData.zip}
            onChange={(e) => handleInputChange('zip', e.target.value)}
            className={errors.zip ? 'border-destructive' : ''}
            placeholder="Введите почтовый индекс"
          />
          {errors.zip && <p className="text-destructive text-sm">{errors.zip}</p>}
        </div>
        <div>
          <Label htmlFor="country">Страна</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleInputChange('country', value)}
          >
            <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
              <SelectValue placeholder="Выберите страну" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
        </div>
        <Button type="submit" disabled={!selectedSeats.length}>
          Забронировать
        </Button>
      </form>
      <div className="mt-4">
        <h4 className="font-semibold">Выбранные места</h4>
        {selectedSeats.length === 0 ? (
          <p>Места не выбраны</p>
        ) : (
          <ul>
            {selectedSeats.map((seat, index) => (
              <li key={index}>
                Ряд: {seat.rowName}, Место: {seat.seatNumber}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingForm;