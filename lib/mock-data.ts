// Mock data for Hotel Operations Dashboard

export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Executive' | 'Presidential';
export type ReservationStatus = 'Confirmed' | 'Pending' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'No Show';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Refunded';
export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'UPI';
export type HousekeepingStatus = 'Dirty' | 'In Progress' | 'Ready' | 'Clean';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  floor: number;
  capacity: number;
  ratePerNight: number;
  status: RoomStatus;
  amenities: string[];
  description: string;
  lastCleaned?: string;
  maintenanceNote?: string;
}

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  idType: string;
  idNumber: string;
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  address: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  ratePerNight: number;
  totalAmount: number;
  paidAmount: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  status: HousekeepingStatus;
  assignedStaff: string;
  priority: Priority;
  lastUpdated: string;
  notes?: string;
  estimatedTime?: number; // minutes
}

export interface Payment {
  id: string;
  bookingId: string;
  reservationId: string;
  guestName: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  status: PaymentStatus;
  invoiceNumber: string;
  description?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Off Duty';
  shift: 'Morning' | 'Afternoon' | 'Night';
  joinedDate: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  type: 'check-in' | 'check-out' | 'reservation' | 'payment' | 'housekeeping' | 'maintenance';
}

// ==================== ROOMS ====================
export const rooms: Room[] = [
  { id: 'r1', roomNumber: '101', type: 'Standard', floor: 1, capacity: 2, ratePerNight: 3500, status: 'Available', amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge'], description: 'Cozy standard room with garden view.' },
  { id: 'r2', roomNumber: '102', type: 'Standard', floor: 1, capacity: 2, ratePerNight: 3500, status: 'Occupied', amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge'], description: 'Cozy standard room with garden view.' },
  { id: 'r3', roomNumber: '103', type: 'Standard', floor: 1, capacity: 2, ratePerNight: 3500, status: 'Cleaning', amenities: ['WiFi', 'TV', 'AC', 'Mini Fridge'], description: 'Standard room with city view.' },
  { id: 'r4', roomNumber: '104', type: 'Deluxe', floor: 1, capacity: 2, ratePerNight: 5500, status: 'Available', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'], description: 'Spacious deluxe room with premium furnishings.' },
  { id: 'r5', roomNumber: '201', type: 'Deluxe', floor: 2, capacity: 3, ratePerNight: 5500, status: 'Reserved', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'], description: 'Deluxe room with city panorama.' },
  { id: 'r6', roomNumber: '202', type: 'Deluxe', floor: 2, capacity: 2, ratePerNight: 5500, status: 'Occupied', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'], description: 'Deluxe room with sea view.' },
  { id: 'r7', roomNumber: '203', type: 'Suite', floor: 2, capacity: 4, ratePerNight: 9500, status: 'Available', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Living Area', 'Balcony'], description: 'Luxurious suite with separate living area and balcony.' },
  { id: 'r8', roomNumber: '301', type: 'Suite', floor: 3, capacity: 4, ratePerNight: 9500, status: 'Maintenance', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Living Area'], description: 'Premier suite with panoramic city views.', maintenanceNote: 'Air conditioning unit replacement' },
  { id: 'r9', roomNumber: '302', type: 'Executive', floor: 3, capacity: 2, ratePerNight: 12000, status: 'Occupied', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Living Area', 'Butler Service'], description: 'Executive suite with dedicated butler service.' },
  { id: 'r10', roomNumber: '303', type: 'Executive', floor: 3, capacity: 2, ratePerNight: 12000, status: 'Available', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Jacuzzi', 'Living Area', 'Butler Service'], description: 'Executive suite with sea-facing views.' },
  { id: 'r11', roomNumber: '401', type: 'Presidential', floor: 4, capacity: 6, ratePerNight: 25000, status: 'Available', amenities: ['WiFi', 'TV', 'AC', 'Full Bar', 'Jacuzzi', 'Living Room', 'Dining Area', 'Butler Service', 'Private Terrace'], description: 'The pinnacle of luxury — a full-floor presidential suite with private terrace and dining.' },
  { id: 'r12', roomNumber: '105', type: 'Standard', floor: 1, capacity: 2, ratePerNight: 3500, status: 'Available', amenities: ['WiFi', 'TV', 'AC'], description: 'Standard single room.' },
  { id: 'r13', roomNumber: '204', type: 'Deluxe', floor: 2, capacity: 2, ratePerNight: 5500, status: 'Occupied', amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'], description: 'Deluxe room with pool view.' },
  { id: 'r14', roomNumber: '304', type: 'Suite', floor: 3, capacity: 4, ratePerNight: 9500, status: 'Reserved', amenities: ['WiFi', 'TV', 'AC', 'Jacuzzi', 'Living Area'], description: 'Elegant suite with city skyline view.' },
  { id: 'r15', roomNumber: '106', type: 'Standard', floor: 1, capacity: 2, ratePerNight: 3500, status: 'Maintenance', amenities: ['WiFi', 'TV', 'AC'], description: 'Standard room — plumbing repair in progress.', maintenanceNote: 'Bathroom plumbing repair' },
];

// ==================== GUESTS ====================
export const guests: Guest[] = [
  { id: 'g1', firstName: 'Arjun', lastName: 'Mehta', email: 'arjun.mehta@email.com', phone: '+91 98765 43210', nationality: 'Indian', idType: 'Passport', idNumber: 'N1234567', totalBookings: 8, totalSpent: 124500, joinedDate: '2023-03-15', address: '14 Linking Road, Bandra, Mumbai, Maharashtra 400050', notes: 'Prefers high-floor rooms. VIP guest.' },
  { id: 'g2', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com', phone: '+91 87654 32109', nationality: 'Indian', idType: 'Aadhaar', idNumber: '1234 5678 9012', totalBookings: 3, totalSpent: 42000, joinedDate: '2024-01-10', address: '7 MG Road, Bengaluru, Karnataka 560001' },
  { id: 'g3', firstName: 'Rahul', lastName: 'Gupta', email: 'rahul.gupta@email.com', phone: '+91 76543 21098', nationality: 'Indian', idType: 'Driving License', idNumber: 'DL0420110149768', totalBookings: 5, totalSpent: 78000, joinedDate: '2023-08-22', address: '22 Connaught Place, New Delhi 110001' },
  { id: 'g4', firstName: 'Aisha', lastName: 'Khan', email: 'aisha.khan@email.com', phone: '+91 65432 10987', nationality: 'Indian', idType: 'Passport', idNumber: 'M9876543', totalBookings: 12, totalSpent: 210000, joinedDate: '2022-11-05', address: '5 Park Street, Kolkata, West Bengal 700016', notes: 'Frequent guest. Allergic to feather pillows.' },
  { id: 'g5', firstName: 'David', lastName: 'Chen', email: 'david.chen@email.com', phone: '+86 138 0013 8000', nationality: 'Chinese', idType: 'Passport', idNumber: 'G12345678', totalBookings: 2, totalSpent: 35000, joinedDate: '2024-05-18', address: '123 Nanjing Road, Shanghai, China' },
  { id: 'g6', firstName: 'Sarah', lastName: 'Williams', email: 'sarah.w@email.com', phone: '+1 555 234 5678', nationality: 'American', idType: 'Passport', idNumber: '123456789', totalBookings: 4, totalSpent: 89000, joinedDate: '2023-06-30', address: '456 Fifth Avenue, New York, USA', notes: 'Vegetarian. Requires late checkout when possible.' },
  { id: 'g7', firstName: 'Mohammed', lastName: 'Al-Rashid', email: 'm.alrashid@email.com', phone: '+971 50 123 4567', nationality: 'Emirati', idType: 'Passport', idNumber: 'A1234567', totalBookings: 6, totalSpent: 175000, joinedDate: '2023-01-20', address: 'Al Wasl Road, Dubai, UAE', notes: 'VIP guest. Always books Presidential Suite.' },
  { id: 'g8', firstName: 'Sneha', lastName: 'Patil', email: 'sneha.patil@email.com', phone: '+91 54321 09876', nationality: 'Indian', idType: 'Aadhaar', idNumber: '9876 5432 1098', totalBookings: 1, totalSpent: 9500, joinedDate: '2024-09-01', address: '8 Shivaji Nagar, Pune, Maharashtra 411005' },
  { id: 'g9', firstName: 'Carlos', lastName: 'Mendez', email: 'c.mendez@email.com', phone: '+52 55 1234 5678', nationality: 'Mexican', idType: 'Passport', idNumber: 'G09876543', totalBookings: 3, totalSpent: 52000, joinedDate: '2024-02-14', address: 'Paseo de la Reforma, Mexico City, Mexico' },
  { id: 'g10', firstName: 'Anita', lastName: 'Verma', email: 'anita.verma@email.com', phone: '+91 43210 98765', nationality: 'Indian', idType: 'Passport', idNumber: 'P7654321', totalBookings: 7, totalSpent: 98000, joinedDate: '2023-04-10', address: '12 CG Road, Ahmedabad, Gujarat 380009' },
];

// ==================== RESERVATIONS ====================
export const reservations: Reservation[] = [
  { id: 'res1', bookingId: 'VNX-2025-001', guestId: 'g1', guestName: 'Arjun Mehta', roomId: 'r9', roomNumber: '302', roomType: 'Executive', checkIn: '2026-10-16', checkOut: '2026-10-19', nights: 3, adults: 2, children: 0, ratePerNight: 12000, totalAmount: 36000, paidAmount: 36000, status: 'Checked In', paymentStatus: 'Paid', paymentMethod: 'Credit Card', specialRequests: 'High floor room, extra pillows', createdAt: '2026-10-10', updatedAt: '2026-10-16' },
  { id: 'res2', bookingId: 'VNX-2025-002', guestId: 'g2', guestName: 'Priya Sharma', roomId: 'r2', roomNumber: '102', roomType: 'Standard', checkIn: '2026-10-16', checkOut: '2026-10-17', nights: 1, adults: 1, children: 0, ratePerNight: 3500, totalAmount: 3500, paidAmount: 3500, status: 'Checked In', paymentStatus: 'Paid', paymentMethod: 'UPI', createdAt: '2026-10-14', updatedAt: '2026-10-16' },
  { id: 'res3', bookingId: 'VNX-2025-003', guestId: 'g4', guestName: 'Aisha Khan', roomId: 'r6', roomNumber: '202', roomType: 'Deluxe', checkIn: '2026-10-16', checkOut: '2026-10-18', nights: 2, adults: 2, children: 1, ratePerNight: 5500, totalAmount: 11000, paidAmount: 5500, status: 'Checked In', paymentStatus: 'Partial', paymentMethod: 'Credit Card', specialRequests: 'Cot for child, feather-free pillows', createdAt: '2026-10-12', updatedAt: '2026-10-16' },
  { id: 'res4', bookingId: 'VNX-2025-004', guestId: 'g5', guestName: 'David Chen', roomId: 'r13', roomNumber: '204', roomType: 'Deluxe', checkIn: '2026-10-15', checkOut: '2026-10-16', nights: 1, adults: 2, children: 0, ratePerNight: 5500, totalAmount: 5500, paidAmount: 5500, status: 'Checked Out', paymentStatus: 'Paid', paymentMethod: 'Cash', createdAt: '2026-10-13', updatedAt: '2026-10-16' },
  { id: 'res5', bookingId: 'VNX-2025-005', guestId: 'g3', guestName: 'Rahul Gupta', roomId: 'r5', roomNumber: '201', roomType: 'Deluxe', checkIn: '2026-10-17', checkOut: '2026-10-20', nights: 3, adults: 2, children: 0, ratePerNight: 5500, totalAmount: 16500, paidAmount: 0, status: 'Confirmed', paymentStatus: 'Pending', createdAt: '2026-10-14', updatedAt: '2026-10-14' },
  { id: 'res6', bookingId: 'VNX-2025-006', guestId: 'g7', guestName: 'Mohammed Al-Rashid', roomId: 'r11', roomNumber: '401', roomType: 'Presidential', checkIn: '2026-10-18', checkOut: '2026-10-23', nights: 5, adults: 4, children: 2, ratePerNight: 25000, totalAmount: 125000, paidAmount: 62500, status: 'Confirmed', paymentStatus: 'Partial', paymentMethod: 'Bank Transfer', specialRequests: 'Airport pickup, champagne on arrival', createdAt: '2026-10-05', updatedAt: '2026-10-12' },
  { id: 'res7', bookingId: 'VNX-2025-007', guestId: 'g6', guestName: 'Sarah Williams', roomId: 'r14', roomNumber: '304', roomType: 'Suite', checkIn: '2026-10-17', checkOut: '2026-10-22', nights: 5, adults: 2, children: 0, ratePerNight: 9500, totalAmount: 47500, paidAmount: 47500, status: 'Confirmed', paymentStatus: 'Paid', paymentMethod: 'Credit Card', specialRequests: 'Vegetarian breakfast, late checkout', createdAt: '2026-10-08', updatedAt: '2026-10-10' },
  { id: 'res8', bookingId: 'VNX-2025-008', guestId: 'g8', guestName: 'Sneha Patil', roomId: 'r8', roomNumber: '301', roomType: 'Suite', checkIn: '2026-10-19', checkOut: '2026-10-21', nights: 2, adults: 2, children: 0, ratePerNight: 9500, totalAmount: 19000, paidAmount: 0, status: 'Pending', paymentStatus: 'Pending', createdAt: '2026-10-15', updatedAt: '2026-10-15' },
  { id: 'res9', bookingId: 'VNX-2025-009', guestId: 'g9', guestName: 'Carlos Mendez', roomId: 'r4', roomNumber: '104', roomType: 'Deluxe', checkIn: '2026-10-14', checkOut: '2026-10-16', nights: 2, adults: 1, children: 0, ratePerNight: 5500, totalAmount: 11000, paidAmount: 11000, status: 'Checked Out', paymentStatus: 'Paid', paymentMethod: 'Credit Card', createdAt: '2026-10-10', updatedAt: '2026-10-16' },
  { id: 'res10', bookingId: 'VNX-2025-010', guestId: 'g10', guestName: 'Anita Verma', roomId: 'r1', roomNumber: '101', roomType: 'Standard', checkIn: '2026-10-20', checkOut: '2026-10-22', nights: 2, adults: 2, children: 0, ratePerNight: 3500, totalAmount: 7000, paidAmount: 3500, status: 'Confirmed', paymentStatus: 'Partial', paymentMethod: 'UPI', createdAt: '2026-10-16', updatedAt: '2026-10-16' },
  { id: 'res11', bookingId: 'VNX-2025-011', guestId: 'g1', guestName: 'Arjun Mehta', roomId: 'r10', roomNumber: '303', roomType: 'Executive', checkIn: '2026-10-25', checkOut: '2026-10-28', nights: 3, adults: 2, children: 0, ratePerNight: 12000, totalAmount: 36000, paidAmount: 36000, status: 'Confirmed', paymentStatus: 'Paid', paymentMethod: 'Credit Card', createdAt: '2026-10-16', updatedAt: '2026-10-16' },
  { id: 'res12', bookingId: 'VNX-2025-012', guestId: 'g2', guestName: 'Priya Sharma', roomId: 'r12', roomNumber: '105', roomType: 'Standard', checkIn: '2026-10-13', checkOut: '2026-10-14', nights: 1, adults: 1, children: 0, ratePerNight: 3500, totalAmount: 3500, paidAmount: 0, status: 'No Show', paymentStatus: 'Pending', createdAt: '2026-10-12', updatedAt: '2026-10-14' },
];

// ==================== HOUSEKEEPING ====================
export const housekeepingTasks: HousekeepingTask[] = [
  { id: 'hk1', roomId: 'r3', roomNumber: '103', floor: 1, status: 'In Progress', assignedStaff: 'Meena Devi', priority: 'High', lastUpdated: '2026-10-16T09:30:00', notes: 'Guest checking in at 2 PM, prioritize.' },
  { id: 'hk2', roomId: 'r13', roomNumber: '204', floor: 2, status: 'Dirty', assignedStaff: 'Rajan Kumar', priority: 'Urgent', lastUpdated: '2026-10-16T08:45:00', notes: 'Guest checked out. Deep clean required.' },
  { id: 'hk3', roomId: 'r4', roomNumber: '104', floor: 1, status: 'Dirty', assignedStaff: 'Sunita Rao', priority: 'Medium', lastUpdated: '2026-10-16T08:00:00' },
  { id: 'hk4', roomId: 'r7', roomNumber: '203', floor: 2, status: 'Ready', assignedStaff: 'Meena Devi', priority: 'Low', lastUpdated: '2026-10-16T07:30:00', notes: 'Passed inspection. Ready for new guest.' },
  { id: 'hk5', roomId: 'r10', roomNumber: '303', floor: 3, status: 'Clean', assignedStaff: 'Rajan Kumar', priority: 'Low', lastUpdated: '2026-10-15T18:00:00' },
  { id: 'hk6', roomId: 'r11', roomNumber: '401', floor: 4, status: 'In Progress', assignedStaff: 'Pradeep Singh', priority: 'Urgent', lastUpdated: '2026-10-16T10:00:00', notes: 'VIP arrival on 18th. Full deep clean and setup.', estimatedTime: 180 },
  { id: 'hk7', roomId: 'r12', roomNumber: '105', floor: 1, status: 'Dirty', assignedStaff: 'Sunita Rao', priority: 'Low', lastUpdated: '2026-10-16T07:00:00' },
  { id: 'hk8', roomId: 'r1', roomNumber: '101', floor: 1, status: 'Clean', assignedStaff: 'Pradeep Singh', priority: 'Low', lastUpdated: '2026-10-15T17:00:00' },
];

// ==================== PAYMENTS ====================
export const payments: Payment[] = [
  { id: 'pay1', bookingId: 'VNX-2025-001', reservationId: 'res1', guestName: 'Arjun Mehta', amount: 36000, method: 'Credit Card', date: '2026-10-10', status: 'Paid', invoiceNumber: 'INV-2025-001' },
  { id: 'pay2', bookingId: 'VNX-2025-002', reservationId: 'res2', guestName: 'Priya Sharma', amount: 3500, method: 'UPI', date: '2026-10-16', status: 'Paid', invoiceNumber: 'INV-2025-002' },
  { id: 'pay3', bookingId: 'VNX-2025-003', reservationId: 'res3', guestName: 'Aisha Khan', amount: 5500, method: 'Credit Card', date: '2026-10-12', status: 'Partial', invoiceNumber: 'INV-2025-003', description: 'Advance payment. Balance due on checkout.' },
  { id: 'pay4', bookingId: 'VNX-2025-004', reservationId: 'res4', guestName: 'David Chen', amount: 5500, method: 'Cash', date: '2026-10-15', status: 'Paid', invoiceNumber: 'INV-2025-004' },
  { id: 'pay5', bookingId: 'VNX-2025-006', reservationId: 'res6', guestName: 'Mohammed Al-Rashid', amount: 62500, method: 'Bank Transfer', date: '2026-10-12', status: 'Partial', invoiceNumber: 'INV-2025-006', description: 'Advance deposit. Balance payable at checkout.' },
  { id: 'pay6', bookingId: 'VNX-2025-007', reservationId: 'res7', guestName: 'Sarah Williams', amount: 47500, method: 'Credit Card', date: '2026-10-08', status: 'Paid', invoiceNumber: 'INV-2025-007' },
  { id: 'pay7', bookingId: 'VNX-2025-009', reservationId: 'res9', guestName: 'Carlos Mendez', amount: 11000, method: 'Credit Card', date: '2026-10-14', status: 'Paid', invoiceNumber: 'INV-2025-009' },
  { id: 'pay8', bookingId: 'VNX-2025-010', reservationId: 'res10', guestName: 'Anita Verma', amount: 3500, method: 'UPI', date: '2026-10-16', status: 'Partial', invoiceNumber: 'INV-2025-010', description: 'Half advance paid.' },
  { id: 'pay9', bookingId: 'VNX-2025-011', reservationId: 'res11', guestName: 'Arjun Mehta', amount: 36000, method: 'Credit Card', date: '2026-10-16', status: 'Paid', invoiceNumber: 'INV-2025-011' },
];

// ==================== STAFF ====================
export const staff: Staff[] = [
  { id: 's1', name: 'Vikram Nair', role: 'Front Desk Manager', department: 'Front Office', email: 'vikram.n@velnovax.com', phone: '+91 98000 11000', status: 'Active', shift: 'Morning', joinedDate: '2021-06-15' },
  { id: 's2', name: 'Deepa Krishnan', role: 'Receptionist', department: 'Front Office', email: 'deepa.k@velnovax.com', phone: '+91 98000 22000', status: 'Active', shift: 'Afternoon', joinedDate: '2022-09-01' },
  { id: 's3', name: 'Meena Devi', role: 'Senior Housekeeper', department: 'Housekeeping', email: 'meena.d@velnovax.com', phone: '+91 98000 33000', status: 'Active', shift: 'Morning', joinedDate: '2020-03-10' },
  { id: 's4', name: 'Rajan Kumar', role: 'Housekeeper', department: 'Housekeeping', email: 'rajan.k@velnovax.com', phone: '+91 98000 44000', status: 'Active', shift: 'Afternoon', joinedDate: '2023-01-20' },
  { id: 's5', name: 'Sunita Rao', role: 'Housekeeper', department: 'Housekeeping', email: 'sunita.r@velnovax.com', phone: '+91 98000 55000', status: 'Active', shift: 'Morning', joinedDate: '2022-07-15' },
  { id: 's6', name: 'Pradeep Singh', role: 'Housekeeping Supervisor', department: 'Housekeeping', email: 'pradeep.s@velnovax.com', phone: '+91 98000 66000', status: 'Active', shift: 'Morning', joinedDate: '2021-11-30' },
  { id: 's7', name: 'Anjali Pillai', role: 'Accountant', department: 'Finance', email: 'anjali.p@velnovax.com', phone: '+91 98000 77000', status: 'Active', shift: 'Morning', joinedDate: '2022-04-05' },
  { id: 's8', name: 'Suresh Babu', role: 'Maintenance Engineer', department: 'Maintenance', email: 'suresh.b@velnovax.com', phone: '+91 98000 88000', status: 'Active', shift: 'Morning', joinedDate: '2020-08-22' },
];

// ==================== ACTIVITY LOG ====================
export const activityLog: ActivityLog[] = [
  { id: 'al1', action: 'Check-In', description: 'Arjun Mehta checked in to Room 302 (Executive)', user: 'Vikram Nair', timestamp: '2026-10-16T14:22:00', type: 'check-in' },
  { id: 'al2', action: 'Check-In', description: 'Priya Sharma checked in to Room 102 (Standard)', user: 'Deepa Krishnan', timestamp: '2026-10-16T13:05:00', type: 'check-in' },
  { id: 'al3', action: 'Check-In', description: 'Aisha Khan checked in to Room 202 (Deluxe)', user: 'Deepa Krishnan', timestamp: '2026-10-16T12:45:00', type: 'check-in' },
  { id: 'al4', action: 'Payment Received', description: 'Payment of ₹36,000 received from Arjun Mehta (Credit Card)', user: 'Anjali Pillai', timestamp: '2026-10-16T14:20:00', type: 'payment' },
  { id: 'al5', action: 'Check-Out', description: 'David Chen checked out from Room 204 (Deluxe)', user: 'Vikram Nair', timestamp: '2026-10-16T11:30:00', type: 'check-out' },
  { id: 'al6', action: 'Reservation Created', description: 'New reservation VNX-2025-010 for Anita Verma (Room 101)', user: 'Deepa Krishnan', timestamp: '2026-10-16T10:15:00', type: 'reservation' },
  { id: 'al7', action: 'Housekeeping Update', description: 'Room 203 status changed to Ready by Meena Devi', user: 'Pradeep Singh', timestamp: '2026-10-16T09:45:00', type: 'housekeeping' },
  { id: 'al8', action: 'Maintenance Reported', description: 'Room 301 flagged for AC unit replacement', user: 'Suresh Babu', timestamp: '2026-10-16T09:00:00', type: 'maintenance' },
  { id: 'al9', action: 'Payment Received', description: 'Payment of ₹3,500 received from Anita Verma (UPI)', user: 'Anjali Pillai', timestamp: '2026-10-16T10:30:00', type: 'payment' },
  { id: 'al10', action: 'Reservation Created', description: 'New reservation VNX-2025-011 for Arjun Mehta (Room 303)', user: 'Deepa Krishnan', timestamp: '2026-10-16T11:00:00', type: 'reservation' },
];

// ==================== ANALYTICS ====================
export const weeklyRevenueData = [
  { day: 'Mon', revenue: 82500, occupancy: 68 },
  { day: 'Tue', revenue: 74000, occupancy: 62 },
  { day: 'Wed', revenue: 95000, occupancy: 78 },
  { day: 'Thu', revenue: 88000, occupancy: 73 },
  { day: 'Fri', revenue: 112000, occupancy: 87 },
  { day: 'Sat', revenue: 125000, occupancy: 93 },
  { day: 'Sun', revenue: 98000, occupancy: 80 },
];

export const monthlyRevenueData = [
  { month: 'Apr', revenue: 2850000, occupancy: 71 },
  { month: 'May', revenue: 3120000, occupancy: 76 },
  { month: 'Jun', revenue: 2980000, occupancy: 73 },
  { month: 'Jul', revenue: 3450000, occupancy: 84 },
  { month: 'Aug', revenue: 3680000, occupancy: 89 },
  { month: 'Sep', revenue: 3210000, occupancy: 79 },
  { month: 'Oct', revenue: 3890000, occupancy: 92 },
];

export const roomTypeData = [
  { name: 'Standard', value: 5, revenue: 87500, occupancy: 72, avgRate: 3500 },
  { name: 'Deluxe', value: 5, revenue: 165000, occupancy: 84, avgRate: 5500 },
  { name: 'Suite', value: 3, revenue: 142500, occupancy: 78, avgRate: 9500 },
  { name: 'Executive', value: 2, revenue: 144000, occupancy: 80, avgRate: 12000 },
  { name: 'Presidential', value: 1, revenue: 125000, occupancy: 60, avgRate: 25000 },
];

export const bookingStatusData = [
  { name: 'Confirmed', value: 5, color: '#3B82F6' },
  { name: 'Checked In', value: 3, color: '#22C55E' },
  { name: 'Checked Out', value: 2, color: '#94A3B8' },
  { name: 'Pending', value: 1, color: '#F59E0B' },
  { name: 'No Show', value: 1, color: '#EF4444' },
];

// ==================== DASHBOARD STATS ====================
export const dashboardStats = {
  totalRooms: 15,
  availableRooms: 6,
  occupiedRooms: 4,
  maintenanceRooms: 2,
  cleaningRooms: 1,
  reservedRooms: 2,
  todayArrivals: 3,
  todayDepartures: 2,
  weekRevenue: 674500,
  occupancyRate: 72,
  avgDailyRate: 8250,
  revPAR: 5940,
};
