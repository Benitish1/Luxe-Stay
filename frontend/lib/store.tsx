'use client';

/**
 * Demo data store (frontend only).
 * Everything lives in React state and is saved to localStorage.
 * When the Java backend is ready, replace each action below with an API call
 * (same names, same data shapes from lib/types.ts).
 */
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import * as seed from './seed';
import { SERVICE_CHARGE, TAX_RATE } from './config';
import type {
  Booking, BookingStatus, HousekeepingTask, MenuItem, Message, Order, OrderLine, OrderStatus,
  Review, Room, RoomStatus, RoomType, Service, ServiceRequest, Staff, User,
} from './types';

interface DB {
  users: User[];
  roomTypes: RoomType[];
  rooms: Room[];
  bookings: Booking[];
  menu: MenuItem[];
  orders: Order[];
  services: Service[];
  serviceRequests: ServiceRequest[];
  tasks: HousekeepingTask[];
  staff: Staff[];
  reviews: Review[];
  messages: Message[];
}

export interface CartLine { itemId: string; qty: number; note?: string }

const STORAGE_KEY = 'luxestay-demo-v3';
const SESSION_KEY = 'luxestay-session';
const CART_KEY = 'luxestay-cart';

const freshDB = (): DB => ({
  users: seed.users, roomTypes: seed.roomTypes, rooms: seed.rooms, bookings: seed.bookings,
  menu: seed.menu, orders: seed.orders, services: seed.services, serviceRequests: seed.serviceRequests,
  tasks: seed.tasks, staff: seed.staff, reviews: seed.reviews, messages: seed.messages,
});

const uid = (p: string) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const code = (p: string) => `${p}${Math.floor(10000 + Math.random() * 89999)}`;
export const nightsBetween = (a: string, b: string) =>
  Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

export const EXTRAS = [
  { id: 'Breakfast', label: 'Daily breakfast', price: 22, per: 'guest / night' },
  { id: 'Airport pickup', label: 'Airport pickup', price: 40, per: 'stay' },
  { id: 'Late checkout', label: 'Late checkout (until 4pm)', price: 50, per: 'stay' },
  { id: 'Spa credit', label: '$100 spa credit', price: 85, per: 'stay' },
] as const;

export function quoteBooking(rt: RoomType, checkIn: string, checkOut: string, guests: number, extras: string[]) {
  const nights = nightsBetween(checkIn, checkOut);
  const room = rt.price * nights;
  const extrasTotal = extras.reduce((s, id) => {
    const e = EXTRAS.find((x) => x.id === id);
    if (!e) return s;
    return s + (e.per === 'guest / night' ? e.price * guests * nights : e.price);
  }, 0);
  const subtotal = room + extrasTotal;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  return { nights, room, extrasTotal, subtotal, tax, total: Math.round((subtotal + tax) * 100) / 100 };
}

export function quoteOrder(subtotal: number) {
  const service = Math.round(subtotal * SERVICE_CHARGE * 100) / 100;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  return { subtotal, service, tax, total: Math.round((subtotal + service + tax) * 100) / 100 };
}

function useStoreValue() {
  const [db, setDb] = useState<DB>(freshDB);
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Load saved state once in the browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDb({ ...freshDB(), ...JSON.parse(saved) });
      setUserId(localStorage.getItem(SESSION_KEY));
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
    } catch { /* ignore broken storage */ }
    setReady(true);
    // Keep multiple tabs in sync (e.g. guest tab + kitchen dashboard tab)
    const onStorage = (e: StorageEvent) => {
      try {
        if (e.key === STORAGE_KEY && e.newValue) setDb({ ...freshDB(), ...JSON.parse(e.newValue) });
        if (e.key === CART_KEY && e.newValue) setCart(JSON.parse(e.newValue));
      } catch { /* ignore */ }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      if (userId) localStorage.setItem(SESSION_KEY, userId);
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* storage full or blocked */ }
  }, [db, cart, userId, ready]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 3200);
  }, []);

  const user = db.users.find((u) => u.id === userId) || null;
  // Admin & staff manage the hotel from the dashboard; they don't book or order as guests
  const isStaff = !!user && user.role !== 'guest';

  const patch = <K extends keyof DB>(key: K, fn: (list: DB[K]) => DB[K]) =>
    setDb((d) => ({ ...d, [key]: fn(d[key]) }));

  // ---------- Auth ----------
  const login = (email: string, password: string) => {
    const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
    if (!u) throw new Error('Incorrect email or password');
    setUserId(u.id);
    return u;
  };
  const register = (name: string, email: string, password: string, phone?: string) => {
    if (db.users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase()))
      throw new Error('An account with this email already exists');
    const u: User = { id: uid('u'), name, email: email.trim(), password, phone, role: 'guest', loyaltyPoints: 250, createdAt: new Date().toISOString() };
    patch('users', (l) => [...l, u]);
    setUserId(u.id);
    return u;
  };
  const logout = () => setUserId(null);
  const updateProfile = (data: Partial<Pick<User, 'name' | 'phone'>>) =>
    user && patch('users', (l) => l.map((u) => (u.id === user.id ? { ...u, ...data } : u)));
  const setUserRole = (id: string, role: User['role']) =>
    patch('users', (l) => l.map((u) => (u.id === id ? { ...u, role } : u)));

  // ---------- Bookings ----------
  const createBooking = (data: Omit<Booking, 'id' | 'code' | 'status' | 'createdAt'>) => {
    const bk: Booking = { ...data, id: uid('b'), code: code('LX'), status: data.paid ? 'confirmed' : 'pending', createdAt: new Date().toISOString() };
    patch('bookings', (l) => [bk, ...l]);
    if (data.userId) {
      patch('users', (l) => l.map((u) => (u.id === data.userId ? { ...u, loyaltyPoints: u.loyaltyPoints + Math.round(data.total) } : u)));
    }
    return bk;
  };
  const setBookingStatus = (id: string, status: BookingStatus) => {
    const bk = db.bookings.find((x) => x.id === id);
    let roomId = bk?.roomId;
    if (bk && status === 'checked_in' && !roomId) {
      const free = db.rooms.find((r) => r.typeId === bk.roomTypeId && r.status === 'available');
      roomId = free?.id;
    }
    patch('bookings', (l) => l.map((x) => (x.id === id ? { ...x, status, roomId, paid: status === 'checked_out' ? true : x.paid } : x)));
    if (roomId && status === 'checked_in') setRoomStatus(roomId, 'occupied');
    if (roomId && status === 'checked_out') {
      setRoomStatus(roomId, 'cleaning');
      addTask({ roomId, title: 'Full clean after checkout', assignee: 'Unassigned', priority: 'high' });
    }
  };
  const assignRoom = (bookingId: string, roomId: string) =>
    patch('bookings', (l) => l.map((x) => (x.id === bookingId ? { ...x, roomId } : x)));

  // ---------- Rooms ----------
  const setRoomStatus = (id: string, status: RoomStatus) =>
    patch('rooms', (l) => l.map((r) => (r.id === id ? { ...r, status } : r)));
  const addRoom = (r: Omit<Room, 'id'>) => patch('rooms', (l) => [...l, { ...r, id: uid('r') }]);
  const deleteRoom = (id: string) => patch('rooms', (l) => l.filter((r) => r.id !== id));
  const updateRoomType = (id: string, data: Partial<RoomType>) =>
    patch('roomTypes', (l) => l.map((r) => (r.id === id ? { ...r, ...data } : r)));

  // ---------- Menu & orders ----------
  const addToCart = (itemId: string, qty = 1) => {
    if (isStaff) return notify('Staff accounts manage orders from the dashboard');
    setCart((c) => {
      const ex = c.find((l) => l.itemId === itemId);
      if (ex) return c.map((l) => (l.itemId === itemId ? { ...l, qty: l.qty + qty } : l));
      return [...c, { itemId, qty }];
    });
  };
  const setCartQty = (itemId: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((l) => l.itemId !== itemId) : c.map((l) => (l.itemId === itemId ? { ...l, qty } : l))));
  const setCartNote = (itemId: string, note: string) =>
    setCart((c) => c.map((l) => (l.itemId === itemId ? { ...l, note } : l)));
  const clearCart = () => setCart([]);

  const cartLines: OrderLine[] = cart
    .map((c) => {
      const it = db.menu.find((m) => m.id === c.itemId);
      return it ? { itemId: it.id, name: it.name, price: it.price, qty: c.qty, note: c.note } : null;
    })
    .filter(Boolean) as OrderLine[];
  const cartSubtotal = cartLines.reduce((s, l) => s + l.price * l.qty, 0);
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  const placeOrder = (data: Pick<Order, 'customerName' | 'type' | 'location' | 'paymentMethod'>) => {
    const q = quoteOrder(cartSubtotal);
    const ord: Order = {
      ...data, id: uid('o'), code: code('OR'), userId: user?.id, lines: cartLines,
      subtotal: cartSubtotal, total: q.total, status: 'received', createdAt: new Date().toISOString(),
    };
    patch('orders', (l) => [ord, ...l]);
    clearCart();
    return ord;
  };
  const setOrderStatus = (id: string, status: OrderStatus) =>
    patch('orders', (l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
  const saveMenuItem = (item: Omit<MenuItem, 'id'> & { id?: string }) =>
    patch('menu', (l) => (item.id ? l.map((x) => (x.id === item.id ? { ...x, ...item } as MenuItem : x)) : [...l, { ...item, id: uid('m') } as MenuItem]));
  const deleteMenuItem = (id: string) => patch('menu', (l) => l.filter((x) => x.id !== id));

  // ---------- Services ----------
  const requestService = (data: Omit<ServiceRequest, 'id' | 'status' | 'createdAt'>) => {
    const sr: ServiceRequest = { ...data, id: uid('sr'), status: 'requested', createdAt: new Date().toISOString() };
    patch('serviceRequests', (l) => [sr, ...l]);
    return sr;
  };
  const setServiceRequestStatus = (id: string, status: ServiceRequest['status']) =>
    patch('serviceRequests', (l) => l.map((x) => (x.id === id ? { ...x, status } : x)));

  // ---------- Housekeeping ----------
  const addTask = (t: Omit<HousekeepingTask, 'id' | 'status' | 'createdAt'>) =>
    patch('tasks', (l) => [{ ...t, id: uid('t'), status: 'todo', createdAt: new Date().toISOString() }, ...l]);
  const setTaskStatus = (id: string, status: HousekeepingTask['status']) => {
    const t = db.tasks.find((x) => x.id === id);
    patch('tasks', (l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
    if (t && status === 'done') {
      const room = db.rooms.find((r) => r.id === t.roomId);
      if (room && (room.status === 'cleaning' || room.status === 'maintenance')) setRoomStatus(room.id, 'available');
    }
  };

  // ---------- Staff ----------
  /**
   * Save a staff member. If `access` is given, the admin is also creating/updating
   * their dashboard login (staff cannot register themselves).
   */
  const saveStaff = (
    s: Omit<Staff, 'id'> & { id?: string },
    access?: { email: string; password?: string; role: 'staff' | 'admin' } | null,
  ) => {
    const member = { ...s, id: s.id || uid('st') } as Staff;
    if (access) {
      const email = access.email.trim();
      const taken = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== member.userId);
      if (taken) throw new Error('Another account already uses this email');
      if (member.userId && db.users.some((u) => u.id === member.userId)) {
        patch('users', (l) => l.map((u) => (u.id === member.userId
          ? { ...u, name: member.name, phone: member.phone, email, role: access.role, ...(access.password ? { password: access.password } : {}) }
          : u)));
      } else {
        if (!access.password) throw new Error('Set a password for the new login');
        const nu: User = { id: uid('u'), name: member.name, email, password: access.password, phone: member.phone, role: access.role, loyaltyPoints: 0, createdAt: new Date().toISOString() };
        patch('users', (l) => [...l, nu]);
        member.userId = nu.id;
      }
      member.email = email;
    }
    patch('staff', (l) => (l.some((x) => x.id === member.id) ? l.map((x) => (x.id === member.id ? member : x)) : [...l, member]));
    return member;
  };
  /** Remove dashboard access but keep the staff record */
  const revokeStaffAccess = (id: string) => {
    const m = db.staff.find((x) => x.id === id);
    if (m?.userId) patch('users', (l) => l.filter((u) => u.id !== m.userId));
    patch('staff', (l) => l.map((x) => (x.id === id ? { ...x, userId: undefined, email: undefined } : x)));
  };
  const deleteStaff = (id: string) => {
    const m = db.staff.find((x) => x.id === id);
    if (m?.userId) patch('users', (l) => l.filter((u) => u.id !== m.userId));
    patch('staff', (l) => l.filter((x) => x.id !== id));
  };

  // ---------- Reviews & messages ----------
  const addReview = (r: Omit<Review, 'id' | 'date' | 'published'>) =>
    patch('reviews', (l) => [{ ...r, id: uid('rv'), date: new Date().toISOString().slice(0, 10), published: false }, ...l]);
  const toggleReview = (id: string) =>
    patch('reviews', (l) => l.map((x) => (x.id === id ? { ...x, published: !x.published } : x)));
  const sendMessage = (msg: Omit<Message, 'id' | 'read' | 'createdAt'>) =>
    patch('messages', (l) => [{ ...msg, id: uid('msg'), read: false, createdAt: new Date().toISOString() }, ...l]);
  const markMessageRead = (id: string) =>
    patch('messages', (l) => l.map((x) => (x.id === id ? { ...x, read: true } : x)));

  const resetDemo = () => {
    setDb(freshDB());
    setCart([]);
    notify('Demo data has been reset');
  };

  // Availability: how many rooms of a type are free for the given dates
  const availableCount = (typeId: string, checkIn: string, checkOut: string) => {
    const total = db.rooms.filter((r) => r.typeId === typeId && r.status !== 'maintenance').length;
    const overlapping = db.bookings.filter(
      (bk) => bk.roomTypeId === typeId && !['cancelled', 'checked_out'].includes(bk.status) &&
        bk.checkIn < checkOut && bk.checkOut > checkIn,
    ).length;
    return Math.max(0, total - overlapping);
  };

  return {
    ready, db, user, isStaff, toast, notify, cartOpen, setCartOpen, cart, cartLines, cartSubtotal, cartCount,
    login, register, logout, updateProfile, setUserRole,
    createBooking, setBookingStatus, assignRoom,
    setRoomStatus, addRoom, deleteRoom, updateRoomType, availableCount,
    addToCart, setCartQty, setCartNote, clearCart, placeOrder, setOrderStatus, saveMenuItem, deleteMenuItem,
    requestService, setServiceRequestStatus,
    addTask, setTaskStatus, saveStaff, revokeStaffAccess, deleteStaff,
    addReview, toggleReview, sendMessage, markMessageRead, resetDemo,
  };
}

type Store = ReturnType<typeof useStoreValue>;
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
