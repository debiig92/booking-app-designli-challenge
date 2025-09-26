"use client"
import { useBooking } from "@/app/hooks/BookingContext";
import { useEffect } from "react";

const BookingList = () => {

    const {
        bookings,
        getAllBookings, cancelBooking,
    } = useBooking();


    useEffect(() => {
        getAllBookings();
    }, []);


    return (
        <div className='user-list w-fulls bg-white rounded-xl shadow-xl flex flex-col py-4'>
            {bookings.length === 0 ? <p className="text-sm text-gray-600 p-4">No bookings yet.</p> : <h1 className="p-4 font-bold text-gray-600">My Bookings</h1>}
            {bookings.map((b) => (
                <div key={b.id}  className="user-row flex flex-col items-center justify-between cursor-pointer  p-4 duration-300 sm:flex-row sm:py-4 sm:px-8 hover:bg-[#f6f8f9]">
                    <div className="user flex items-center text-center flex-col sm:flex-row sm:text-left">
                        <div className="avatar-content mb-2.5 sm:mb-0 sm:mr-2.5">
                            <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-teal-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.53 11.06L15.47 10l-4.88 4.88-2.12-2.12-1.06 1.06L10.59 17l5.94-5.94zM19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
                            </div>
                        </div>
                        <div className="user-body flex flex-col mb-4 sm:mb-0 sm:mr-4">
                            <a href="#" className="title font-medium no-underline">{b.title}</a>
                            <div className="skills flex flex-col">
                                <span className="subtitle text-slate-500"> {new Date(b.start).toLocaleString()} – {new Date(b.end).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="user-option mx-auto sm:ml-auto sm:mr-0">
                        <button className="btn inline-block select-none no-underline align-middle cursor-pointer whitespace-nowrap px-4 py-1.5 rounded text-base font-medium leading-6 tracking-tight text-white text-center border-0 bg-teal-500 hover:bg-teal-600 duration-300" type="button" onClick={() => cancelBooking(b.id)}>Cancel</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BookingList