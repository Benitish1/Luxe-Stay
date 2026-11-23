// Shared data shapes. The Java backend should return these same shapes
// so the frontend can switch from demo data to real API calls easily.

export type Role = 'admin' | 'staff' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — the real backend must never send this
  phone?: string;
  role: Role;
  loyaltyPoints: number;
  createdAt: string;
}

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  short: string;
  description: string;
  price: number; // per night
  capacity: number;
  beds: string;
  size: number; // m²
  view: string;
  images: string[];
  amenities: string[];
  rating: number;
}

export interface Room {
  id: string;
  number: string;
  floor: number;
  typeId: string;
  status: RoomStatus;
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export interface Booking {
  id: string;
  code: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  roomId?: string;
  checkIn: string; // yyyy-mm-dd
  checkOut: string;
  guests: number;
  extras: string[];
  requests?: string;
  total: number;
  paid: boolean;
  paymentMethod: 'card' | 'mobile_money' | 'pay_at_hotel';
  status: BookingStatus;
  createdAt: string;
}

export type MenuCategory = 'Breakfast' | 'Starters' | 'Mains' | 'Grill' | 'Desserts' | 'Drinks' | 'Cocktails' | 'Wine';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  tags: string[]; // e.g. Vegan, Spicy, Chef's pick
  available: boolean;
  prepMinutes: number;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderType = 'room_service' | 'dine_in' | 'takeaway';

export interface OrderLine {
  itemId: string;
  name: string;
  price: number;
  qty: number;
  note?: string;
}

export interface Order {
  id: string;
  code: string;
  userId?: string;
  customerName: string;
  type: OrderType;
  location: string; // room number / table number / pickup
  lines: OrderLine[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'room_bill' | 'card' | 'mobile_money' | 'cash';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Spa' | 'Wellness' | 'Transport' | 'Experience';
  description: string;
  price: number;
  duration: string;
  image: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  userId?: string;
  guestName: string;
  date: string;
  time: string;
  people: number;
  status: 'requested' | 'confirmed' | 'done' | 'cancelled';
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface HousekeepingTask {
  id: string;
  roomId: string;
  title: string;
  assignee: string;
  priority: 'low' | 'normal' | 'high';
  status: TaskStatus;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: 'Front Office' | 'Housekeeping' | 'Kitchen' | 'Restaurant' | 'Spa' | 'Management' | 'Security';
  phone: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  onDuty: boolean;
  avatar: string;
  email?: string;   // login email, if the admin gave this person dashboard access
  userId?: string;  // linked user account
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  published: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
