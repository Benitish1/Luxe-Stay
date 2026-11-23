import type {
  Booking, HousekeepingTask, MenuItem, Message, Order, Review, Room, RoomType,
  Service, ServiceRequest, Staff, User,
} from './types';

export const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Dates relative to today, so the demo always looks current
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

export const IMAGES = {
  hero: img('1566073771259-6a8506099945', 2000),
  exterior: img('1542314831-068cd1dbfeeb', 1600),
  lobby: img('1564501049412-61c2a3083791', 1600),
  pool: img('1571896349842-33c89424de2d', 1600),
  resort: img('1520250497591-112f2f40a3f4', 1600),
  restaurant: img('1414235077428-338989a2e8c0', 1600),
  restaurant2: img('1517248135467-4c7edcad34c4', 1600),
  bar: img('1470337458703-46ad1756a187', 1600),
  spa: img('1540555700478-4be289fbecef', 1600),
  event: img('1519167758481-83f550bb49b3', 1600),
  conference: img('1505373877841-8d25f7d46678', 1600),
  bathroom: img('1552321554-5fefe8c9ef14', 1600),
  gym: img('1534438327276-14e5300c3a48', 1200),
};

export const roomTypes: RoomType[] = [
  {
    id: 'rt1', name: 'Deluxe Room', slug: 'deluxe-room',
    short: 'Refined comfort with garden views and a rain shower.',
    description:
      'A calm retreat dressed in warm oak and soft linen. The Deluxe Room pairs a plush king bed with a marble bathroom, rain shower and a writing desk facing the gardens — ideal for business travellers and couples alike.',
    price: 180, capacity: 2, beds: '1 King or 2 Twin', size: 34, view: 'Garden',
    images: [img('1611892440504-42a792e24d32'), img('1552321554-5fefe8c9ef14'), img('1590490360182-c33d57733427')],
    amenities: ['Free Wi-Fi', 'Smart TV', 'Rain shower', 'Mini bar', 'Air conditioning', 'Coffee machine', 'Work desk', 'Safe'],
    rating: 4.7,
  },
  {
    id: 'rt2', name: 'Executive Room', slug: 'executive-room',
    short: 'City views, lounge access and space to unwind.',
    description:
      'Set on our upper floors, the Executive Room offers sweeping city views, a separate seating nook and complimentary access to the Executive Lounge with evening canapés and cocktails.',
    price: 260, capacity: 3, beds: '1 King + Sofa bed', size: 42, view: 'City',
    images: [img('1590490360182-c33d57733427'), img('1618773928121-c32242e63f39'), img('1552321554-5fefe8c9ef14')],
    amenities: ['Free Wi-Fi', 'Lounge access', 'Smart TV', 'Bathtub', 'Mini bar', 'Nespresso', 'Bathrobes', 'Air conditioning'],
    rating: 4.8,
  },
  {
    id: 'rt3', name: 'Junior Suite', slug: 'junior-suite',
    short: 'Open-plan living with a deep soaking tub.',
    description:
      'Generous and light-filled, the Junior Suite blends bedroom and living area with a freestanding soaking tub, walk-in wardrobe and a private balcony made for slow mornings.',
    price: 380, capacity: 3, beds: '1 King', size: 58, view: 'Pool',
    images: [img('1631049307264-da0ec9d70304'), img('1582719478250-c89cae4dc85b'), img('1552321554-5fefe8c9ef14')],
    amenities: ['Free Wi-Fi', 'Private balcony', 'Soaking tub', 'Walk-in wardrobe', 'Lounge access', 'Bose speaker', 'Mini bar', 'Butler on call'],
    rating: 4.9,
  },
  {
    id: 'rt4', name: 'Family Suite', slug: 'family-suite',
    short: 'Two bedrooms and room for everyone.',
    description:
      'Designed for families, with two connected bedrooms, a spacious living room, kids’ welcome amenities and a kitchenette. Children under 6 stay and eat breakfast free.',
    price: 420, capacity: 5, beds: '1 King + 2 Twin', size: 75, view: 'Garden',
    images: [img('1578683010236-d716f9a3f461'), img('1591088398332-8a7791972843'), img('1552321554-5fefe8c9ef14')],
    amenities: ['Free Wi-Fi', '2 Bedrooms', 'Kitchenette', 'Kids amenities', 'Two bathrooms', 'Smart TV', 'Dining area', 'Air conditioning'],
    rating: 4.8,
  },
  {
    id: 'rt5', name: 'Presidential Suite', slug: 'presidential-suite',
    short: 'The pinnacle of LuxeStay — private terrace & butler.',
    description:
      'Our signature suite spans the top floor with a private terrace and plunge pool, a grand living and dining room, a master bedroom with dressing room, and 24-hour personal butler service.',
    price: 1200, capacity: 4, beds: '1 Emperor King', size: 160, view: 'Panoramic',
    images: [img('1582719478250-c89cae4dc85b'), img('1584132967334-10e028bd69f7'), img('1631049307264-da0ec9d70304')],
    amenities: ['Private terrace', 'Plunge pool', '24h Butler', 'Airport transfer', 'Dining room', 'Champagne on arrival', 'Steam room', 'Lounge access'],
    rating: 5.0,
  },
];

const statuses: Room['status'][] = ['available', 'occupied', 'occupied', 'available', 'cleaning', 'available', 'occupied', 'maintenance'];
export const rooms: Room[] = (() => {
  const list: Room[] = [];
  const layout: [number, string, number][] = [
    [1, 'rt1', 8], [2, 'rt1', 6], [2, 'rt4', 2], [3, 'rt2', 8], [4, 'rt3', 5], [4, 'rt4', 2], [5, 'rt5', 1],
  ];
  let i = 0;
  const perFloor: Record<number, number> = {};
  for (const [floor, typeId, count] of layout) {
    for (let k = 0; k < count; k++) {
      perFloor[floor] = (perFloor[floor] || 0) + 1;
      list.push({
        id: `r${floor}${String(perFloor[floor]).padStart(2, '0')}`,
        number: `${floor}${String(perFloor[floor]).padStart(2, '0')}`,
        floor, typeId,
        status: statuses[i++ % statuses.length],
      });
    }
  }
  return list;
})();

export const users: User[] = [
  { id: 'u1', name: 'Hotel Manager', email: 'admin@luxestay.com', password: 'admin123', role: 'admin', loyaltyPoints: 0, phone: '+250 788 111 111', createdAt: ago(24 * 200) },
  { id: 'u2', name: 'Grace Uwase', email: 'staff@luxestay.com', password: 'staff123', role: 'staff', loyaltyPoints: 0, phone: '+250 788 222 222', createdAt: ago(24 * 120) },
  { id: 'u3', name: 'Daniel Mugisha', email: 'guest@luxestay.com', password: 'guest123', role: 'guest', loyaltyPoints: 2450, phone: '+250 788 333 333', createdAt: ago(24 * 60) },
  { id: 'u4', name: 'Amelia Brooks', email: 'amelia@example.com', password: 'demo123', role: 'guest', loyaltyPoints: 900, phone: '+44 7700 900123', createdAt: ago(24 * 30) },
  { id: 'u5', name: 'Kenji Watanabe', email: 'kenji@example.com', password: 'demo123', role: 'guest', loyaltyPoints: 3100, phone: '+81 90 1234 5678', createdAt: ago(24 * 15) },
];

const b = (
  n: number, guestName: string, guestEmail: string, roomTypeId: string, roomId: string | undefined,
  inOff: number, nights: number, status: Booking['status'], userId?: string, guests = 2,
): Booking => {
  const rt = roomTypes.find((r) => r.id === roomTypeId)!;
  return {
    id: `b${n}`, code: `LX${(48210 + n * 37).toString()}`, userId, guestName, guestEmail,
    guestPhone: '+250 78' + (1000000 + n * 7919).toString().slice(0, 7),
    roomTypeId, roomId, checkIn: day(inOff), checkOut: day(inOff + nights), guests,
    extras: n % 3 === 0 ? ['Breakfast'] : n % 3 === 1 ? ['Breakfast', 'Airport pickup'] : [],
    total: Math.round(rt.price * nights * 1.18), paid: status !== 'pending',
    paymentMethod: n % 2 ? 'card' : 'mobile_money', status, createdAt: ago(24 * (10 - inOff) + n),
  };
};

export const bookings: Booking[] = [
  b(1, 'Daniel Mugisha', 'guest@luxestay.com', 'rt3', 'r401', -2, 4, 'checked_in', 'u3'),
  b(2, 'Amelia Brooks', 'amelia@example.com', 'rt2', 'r302', -1, 3, 'checked_in', 'u4'),
  b(3, 'Kenji Watanabe', 'kenji@example.com', 'rt5', 'r501', 0, 3, 'confirmed', 'u5', 2),
  b(4, 'Sophie Laurent', 'sophie@example.com', 'rt1', 'r103', 0, 2, 'confirmed'),
  b(5, 'Michael Otieno', 'michael@example.com', 'rt4', 'r207', 1, 5, 'confirmed', undefined, 4),
  b(6, 'Aisha Kamau', 'aisha@example.com', 'rt1', undefined, 2, 2, 'pending'),
  b(7, 'Lucas Fernández', 'lucas@example.com', 'rt2', undefined, 4, 3, 'pending'),
  b(8, 'Olivia Chen', 'olivia@example.com', 'rt3', 'r403', -5, 3, 'checked_out'),
  b(9, 'Daniel Mugisha', 'guest@luxestay.com', 'rt1', 'r102', -30, 2, 'checked_out', 'u3'),
  b(10, 'Noah Smith', 'noah@example.com', 'rt1', 'r107', -3, 3, 'checked_out'),
  b(11, 'Fatuma Hassan', 'fatuma@example.com', 'rt2', 'r307', -1, 2, 'checked_in'),
  b(12, 'Ethan Moreau', 'ethan@example.com', 'rt4', undefined, 7, 4, 'confirmed', undefined, 5),
  b(13, 'Isabella Rossi', 'isabella@example.com', 'rt1', undefined, 1, 1, 'cancelled'),
  b(14, 'Jean Claude N.', 'jc@example.com', 'rt2', 'r303', 0, 1, 'checked_out'),
];

const m = (
  id: string, name: string, category: MenuItem['category'], price: number, photo: string,
  description: string, tags: string[] = [], prepMinutes = 15,
): MenuItem => ({ id, name, category, price, image: img(photo, 700), description, tags, available: true, prepMinutes });

export const menu: MenuItem[] = [
  m('m1', 'Full Continental Breakfast', 'Breakfast', 18, '1533089860892-a7c6f0a88666', 'Buttermilk pancakes, maple syrup, seasonal berries and fresh juice.', ['Popular'], 15),
  m('m2', 'Avocado & Poached Eggs', 'Breakfast', 14, '1525351484163-7529414344d8', 'Sourdough, smashed avocado, poached eggs, chilli flakes.', ['Vegetarian'], 12),
  m('m3', 'Greek Yogurt Parfait', 'Breakfast', 9, '1488477181946-6428a0291777', 'Honey, house granola and tropical fruit.', ['Vegetarian', 'Light'], 5),
  m('m4', 'Garden Superfood Salad', 'Starters', 12, '1512621776951-a57141f2eefd', 'Quinoa, kale, avocado, pomegranate and citrus dressing.', ['Vegan', 'Gluten free'], 10),
  m('m5', 'Poke Bowl', 'Starters', 15, '1546069901-ba9599a7e63c', 'Marinated tuna, edamame, mango, sesame and rice.', ['Chef’s pick'], 12),
  m('m6', 'Grilled Lake Tilapia', 'Mains', 26, '1467003909585-2f8a72700288', 'Whole tilapia, lemon butter, plantain and greens.', ['Local favourite'], 25),
  m('m7', 'Truffle Tagliatelle', 'Mains', 24, '1621996346565-e3dbc646d9a9', 'Hand-cut pasta, wild mushrooms, parmesan, black truffle.', ['Vegetarian'], 20),
  m('m8', 'Wood-fired Margherita', 'Mains', 17, '1565299624946-b28f40a0ae38', 'San Marzano tomato, buffalo mozzarella, basil.', ['Vegetarian', 'Popular'], 18),
  m('m9', 'LuxeStay Signature Burger', 'Mains', 21, '1568901346375-23c9450c58cd', 'Aged beef, cheddar, caramelised onion, brioche, fries.', ['Popular'], 18),
  m('m10', 'Prime Ribeye 300g', 'Grill', 42, '1600891964092-4316c288032e', 'Dry-aged ribeye, peppercorn sauce, truffle mash.', ['Chef’s pick'], 30),
  m('m11', 'Brochette Platter', 'Grill', 22, '1555939594-58d7cb561ad1', 'Goat & beef skewers, pili-pili, roasted potatoes.', ['Spicy', 'Local favourite'], 25),
  m('m12', 'Chocolate Fondant', 'Desserts', 11, '1578985545062-69928b1d9587', 'Molten centre, vanilla bean ice cream.', ['Popular'], 15),
  m('m13', 'Artisan Gelato Trio', 'Desserts', 9, '1563805042-7684c019e1cb', 'Passion fruit, pistachio and dark chocolate.', ['Gluten free'], 5),
  m('m14', 'Single-Origin Coffee', 'Drinks', 4, '1495474472287-4d71bcdd2085', 'Locally grown highland beans — espresso, latte or cappuccino.', ['Local'], 4),
  m('m15', 'Fresh Pressed Juice', 'Drinks', 6, '1600271886742-f049cd451bba', 'Orange, passion fruit, pineapple or mixed.', ['Vegan'], 5),
  m('m16', 'Golden Hour Spritz', 'Cocktails', 13, '1514362545857-3bc16c4c7d1b', 'Aperitivo, prosecco, orange and a hint of passion fruit.', ['Signature'], 6),
  m('m17', 'Smoked Old Fashioned', 'Cocktails', 15, '1470337458703-46ad1756a187', 'Bourbon, demerara, bitters, cherrywood smoke.', ['Signature'], 8),
  m('m18', 'Cabernet Sauvignon (glass)', 'Wine', 12, '1510812431401-41d2bd2722f3', 'Full-bodied red from Stellenbosch.', [], 2),
];

export const services: Service[] = [
  { id: 's1', name: 'Signature Massage', category: 'Spa', description: 'A 90-minute full-body ritual with warm oils and hot stones.', price: 110, duration: '90 min', image: img('1544161515-4ab6ce6db874', 900) },
  { id: 's2', name: 'Couples Spa Journey', category: 'Spa', description: 'Side-by-side massage, steam and a private relaxation suite.', price: 220, duration: '2 hrs', image: img('1540555700478-4be289fbecef', 900) },
  { id: 's3', name: 'Sunrise Yoga', category: 'Wellness', description: 'Guided group session on the garden deck, every morning.', price: 20, duration: '60 min', image: img('1544367567-0f2fcb009e0b', 900) },
  { id: 's4', name: 'Personal Training', category: 'Wellness', description: 'One-on-one session with our in-house trainer.', price: 45, duration: '60 min', image: img('1534438327276-14e5300c3a48', 900) },
  { id: 's5', name: 'Airport Transfer', category: 'Transport', description: 'Private chauffeured sedan to or from the airport.', price: 40, duration: 'One way', image: img('1436491865332-7a61a109cc05', 900) },
  { id: 's6', name: 'Safari Day Trip', category: 'Experience', description: 'Full-day guided game drive with lunch and park fees.', price: 260, duration: 'Full day', image: img('1516426122078-c23e76319801', 900) },
  { id: 's7', name: 'City Culture Tour', category: 'Experience', description: 'Markets, museums and local crafts with a private guide.', price: 75, duration: '4 hrs', image: img('1547471080-7cc2caa01a7e', 900) },
];

export const serviceRequests: ServiceRequest[] = [
  { id: 'sr1', serviceId: 's1', userId: 'u3', guestName: 'Daniel Mugisha', date: day(0), time: '16:00', people: 1, status: 'confirmed', createdAt: ago(20) },
  { id: 'sr2', serviceId: 's5', guestName: 'Kenji Watanabe', date: day(0), time: '13:30', people: 2, status: 'confirmed', createdAt: ago(30) },
  { id: 'sr3', serviceId: 's6', guestName: 'Amelia Brooks', date: day(1), time: '06:30', people: 2, status: 'requested', createdAt: ago(3) },
];

const o = (
  n: number, customerName: string, type: Order['type'], location: string,
  items: [string, number][], status: Order['status'], hoursAgo: number, userId?: string,
): Order => {
  const lines = items.map(([id, qty]) => {
    const it = menu.find((x) => x.id === id)!;
    return { itemId: id, name: it.name, price: it.price, qty };
  });
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return {
    id: `o${n}`, code: `OR${1040 + n}`, userId, customerName, type, location, lines, subtotal,
    total: Math.round(subtotal * 1.23 * 100) / 100, status,
    paymentMethod: type === 'room_service' ? 'room_bill' : 'card', createdAt: ago(hoursAgo),
  };
};

export const orders: Order[] = [
  o(1, 'Daniel Mugisha', 'room_service', 'Room 401', [['m1', 2], ['m14', 2]], 'preparing', 0.2, 'u3'),
  o(2, 'Amelia Brooks', 'room_service', 'Room 302', [['m9', 1], ['m15', 1]], 'received', 0.05, 'u4'),
  o(3, 'Walk-in', 'dine_in', 'Table 6', [['m10', 2], ['m18', 2], ['m12', 1]], 'ready', 0.6),
  o(4, 'Fatuma Hassan', 'dine_in', 'Table 2', [['m6', 1], ['m4', 1]], 'preparing', 0.3),
  o(5, 'Jean Claude N.', 'takeaway', 'Pickup', [['m8', 2]], 'delivered', 3),
  o(6, 'Olivia Chen', 'room_service', 'Room 403', [['m17', 2], ['m11', 1]], 'delivered', 26),
  o(7, 'Daniel Mugisha', 'dine_in', 'Table 9', [['m7', 1], ['m16', 2]], 'delivered', 28, 'u3'),
];

export const tasks: HousekeepingTask[] = [
  { id: 't1', roomId: 'r105', title: 'Full clean after checkout', assignee: 'Claudine M.', priority: 'high', status: 'in_progress', createdAt: ago(1) },
  { id: 't2', roomId: 'r403', title: 'Turn-down service', assignee: 'Eric N.', priority: 'normal', status: 'todo', createdAt: ago(2) },
  { id: 't3', roomId: 'r108', title: 'Fix AC unit', assignee: 'Maintenance — Paul', priority: 'high', status: 'todo', createdAt: ago(5) },
  { id: 't4', roomId: 'r302', title: 'Restock mini bar', assignee: 'Claudine M.', priority: 'low', status: 'done', createdAt: ago(8) },
  { id: 't5', roomId: 'r501', title: 'VIP arrival setup — flowers & champagne', assignee: 'Eric N.', priority: 'high', status: 'todo', createdAt: ago(0.5) },
];

const av = (id: string) => img(id, 200);
export const staff: Staff[] = [
  { id: 'st1', name: 'Grace Uwase', role: 'Front Office Manager', department: 'Front Office', phone: '+250 788 222 222', shift: 'Morning', onDuty: true, avatar: av('1494790108377-be9c29b29330'), email: 'staff@luxestay.com', userId: 'u2' },
  { id: 'st2', name: 'Patrick Habimana', role: 'Executive Chef', department: 'Kitchen', phone: '+250 788 444 101', shift: 'Afternoon', onDuty: true, avatar: av('1507003211169-0a1dd7228f2d') },
  { id: 'st3', name: 'Claudine Mukamana', role: 'Room Attendant', department: 'Housekeeping', phone: '+250 788 444 102', shift: 'Morning', onDuty: true, avatar: av('1438761681033-6461ffad8d80') },
  { id: 'st4', name: 'Eric Niyonzima', role: 'Room Attendant', department: 'Housekeeping', phone: '+250 788 444 103', shift: 'Afternoon', onDuty: false, avatar: av('1500648767791-00dcc994a43e') },
  { id: 'st5', name: 'Sandrine Ishimwe', role: 'Restaurant Supervisor', department: 'Restaurant', phone: '+250 788 444 104', shift: 'Afternoon', onDuty: true, avatar: av('1544005313-94ddf0286df2') },
  { id: 'st6', name: 'Joseph Kalisa', role: 'Night Auditor', department: 'Front Office', phone: '+250 788 444 105', shift: 'Night', onDuty: false, avatar: av('1472099645785-5658abf4ff4e') },
];

export const reviews: Review[] = [
  { id: 'rv1', name: 'Amelia B.', country: 'United Kingdom', rating: 5, title: 'Pure elegance', text: 'From the welcome drink to the turndown chocolates, every detail felt considered. The Junior Suite was stunning and the staff remembered our names.', date: day(-12), published: true },
  { id: 'rv2', name: 'Kenji W.', country: 'Japan', rating: 5, title: 'Best breakfast in the city', text: 'Ordering room service from the app was effortless and it arrived in 20 minutes. The single-origin coffee is a must.', date: day(-20), published: true },
  { id: 'rv3', name: 'Michael O.', country: 'Kenya', rating: 5, title: 'Perfect for families', text: 'The Family Suite gave the kids their own space and the pool kept them busy all day. We will be back.', date: day(-35), published: true },
  { id: 'rv4', name: 'Sophie L.', country: 'France', rating: 4, title: 'Beautiful spa', text: 'The signature massage was heavenly. Only wish the pool bar stayed open a little later!', date: day(-3), published: false },
];

export const messages: Message[] = [
  { id: 'msg1', name: 'Ruth Akinyi', email: 'ruth@example.com', subject: 'Wedding venue enquiry', message: 'Hello, we are planning a wedding for 150 guests next June. Could you send your events package?', read: false, createdAt: ago(5) },
  { id: 'msg2', name: 'Tom Becker', email: 'tom@example.com', subject: 'Group booking', message: 'Looking for 12 rooms for a corporate retreat in March. Do you offer group rates?', read: true, createdAt: ago(40) },
];

// Revenue for the last 14 days (demo analytics)
export const revenueHistory = Array.from({ length: 14 }, (_, i) => {
  const base = 3800 + Math.sin(i / 2) * 900 + (i % 7 >= 5 ? 1400 : 0);
  return { date: day(i - 13), rooms: Math.round(base), dining: Math.round(base * 0.32) };
});
