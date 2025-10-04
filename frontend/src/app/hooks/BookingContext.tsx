"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../../lib/api";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<BookingMsgType | null>(null);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const getAllBookings = useCallback(async () => {
    const res = await api.get<Booking[]>("/bookings/mine");
    setBookings(res.data);
  }, []);

  const cancelBooking = useCallback(async (id: string) => {
    setBusy(true);
    setMsg(null);
    setMsgType(null)
    try {
      await api.delete(`/bookings/${id}`);
      await getAllBookings();
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Failed to cancel booking.");
      setMsgType('error')
    } finally {
      setBusy(false);
    }
  }, [getAllBookings]);

  const createBooking = useCallback(async () => {
    setBusy(true);
    setMsg(null);
    setMsgType(null)
    try {
      await api.post("/bookings", {
        title,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      });
      setTitle("");
      setStart("");
      setEnd("");
      setMsg("Booking created!");
      setMsgType('success')
      await getAllBookings();
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Failed to create booking.");
      setMsgType('error')
    } finally {
      setBusy(false);
    }
  }, [title, start, end, getAllBookings]);

  return (
    <BookingContext.Provider
      value={{
        busy,
        bookings,
        msg,
        msgType,
        title,
        start,
        end,
        setTitle,
        setStart,
        setEnd,
        getAllBookings,
        cancelBooking,
        createBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
