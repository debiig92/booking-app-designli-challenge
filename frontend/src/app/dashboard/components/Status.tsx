"use client"

import { useEffect, useMemo, useState } from "react";
import { api } from '@/lib/api';

const Status = () => {

    const [calendarConnected, setCalendarConnected] = useState<boolean>(false);
    const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('jwt') : null), []);

    useEffect(() => {
        checkCalendar();
    }, []);

    const connectCalendar = () => {
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;
        // State carries our JWT so backend knows who is connecting
        window.location.href = `${backend}/auth/google-calendar?state=${encodeURIComponent(token as string)}`;
    };

    const checkCalendar = async () => {
        try {
            const res = await api.get('/google/status');
            setCalendarConnected(!!res.data.connected);
        } catch { setCalendarConnected(false); }
    };

    return (
        <div className="col-span-12 sm:col-span-6 md:col-span-3">
            <div className="flex flex-row user-list w-fulls bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-teal-500">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9H21M7 3V5M17 3V5M7 13H17V17H7V13ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="flex flex-col justify-center flex-grow ml-4">
                    <div className="text-sm text-gray-500">Google Calendar</div>
                    <div className="font-bold text-lg"> <p className="text-sm text-gray-600">
                        Status: {calendarConnected ? 'Connected' : 'Not connected'}
                    </p>
                        {!calendarConnected && (
                            <button type="button"
                                className="btn btn-primary btn-xs rounded"
                                onClick={connectCalendar}
                            >
                                Connect Google Calendar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Status