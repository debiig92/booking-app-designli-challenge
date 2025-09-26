type Booking = { id: string; title: string; start: string; end: string };
type BookingMsgType = 'success' | 'error';
type BookingContextType = {
  busy: boolean;
  bookings: Booking[];
  msg: string | null;
  msgType: BookingMsgType | null;
  title: string;
  start: string;
  end: string;
  setTitle: (v: string) => void;
  setStart: (v: string) => void;
  setEnd: (v: string) => void;
  getAllBookings: () => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  createBooking: () => Promise<void>;
};