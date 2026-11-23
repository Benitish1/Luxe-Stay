// Central hotel settings. Change these to match your hotel.
export const HOTEL = {
  name: 'LuxeStay',
  tagline: 'Hotel & Residences',
  phone: '+250 788 000 000',
  email: 'reservations@luxestay.com',
  address: '12 KG 7 Avenue, Kigali',
  checkIn: '14:00',
  checkOut: '11:00',
};

export const CURRENCY = { code: 'USD', symbol: '$', locale: 'en-US' };

// Taxes & service charges applied to bookings and orders
export const TAX_RATE = 0.18;
export const SERVICE_CHARGE = 0.05;

export const money = (n: number) =>
  new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
