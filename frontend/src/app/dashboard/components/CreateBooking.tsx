"use client"

import { useBooking } from "@/app/hooks/BookingContext";


const CreateBooking = () => {

    const {
        busy, msg, msgType,
        title, start, end,
        setTitle, setStart, setEnd, createBooking,
    } = useBooking();


    return (
        <section className="user-list w-fulls bg-white rounded-xl shadow-xl flex flex-col p-4">
            <h2 className="font-bold text-gray-600 mb-2">Create a booking</h2>
            <div className="grid gap-3 sm:grid-cols-3">
                <input
                    className="border text-gray-600 border-gray-600 rounded px-2 py-1"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="datetime-local"
                    className="border border-gray-600 text-gray-600 rounded px-2 py-1"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                />
                <input
                    type="datetime-local"
                    className="border border-gray-600 text-gray-600 rounded px-2 py-1"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                />
            </div>
            <div className="mt-3">
                <button
                    disabled={busy || !title || !start || !end}
                    onClick={createBooking}
                    className="rounded bg-teal-500 text-black px-3 py-2 disabled:opacity-50"
                >
                    {busy ? 'Saving…' : 'Book'}
                </button>
                {msg && msgType === "success" && <span className="ml-3 text-sm text-green-600">{msg}</span>}
                {msg && msgType === "error" && <span className="ml-3 text-sm text-red-600">{msg}</span>}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                We’ll reject if the time overlaps an existing system booking or any event in your Google Calendar (when connected).
            </p>
        </section>
    )
}

export default CreateBooking