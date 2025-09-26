"use client";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Menu = () => {

    const [me, setMe] = useState<{ email: string; name?: string } | null>(null);
    const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('jwt') : null), []);
    const menuRoutes: MenuItems[] = [
        {
            id: 1,
            route: 'dashboard',
            name: 'Dashboard',
        }
    ]
    useEffect(() => {
        if (!token) { window.location.href = '/'; return; }
        try {
            const payload: any = jwtDecode(token);
            setMe({ email: payload.email, name: payload.name });
        } catch { }
    }, []);

    return (
        <>

            <div id="menu" className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0 h-screen overflow-y-scroll">
                <div id="logo" className="my-4 px-6">
                    <h1 className="text-lg md:text-2xl font-bold text-white">BOOKING <span className="text-teal-500">APP</span></h1>
                    <p className="text-slate-500 text-sm">Start Booking</p>
                </div>
                <div id="profile" className="px-6 py-10">
                    {me && <p className="text-sm text-slate-500">Welcome {me.name || me.email}</p>}
                </div>
                <div id="nav" className="w-full px-6">

                    {

                        menuRoutes.map((item) =>
                            <Link key={item.id} href={item.route} className="rounded w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py-3 hover:bg-teal-500 transition ease-linear duration-150">
                                <MenuItem item={item} />
                            </Link>
                        )

                    }

                    <div className="rounded w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py-3 hover:bg-teal-500 transition ease-linear duration-150">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>

                        </div>
                        <div className="flex flex-col">
                            <button
                                onClick={() => { localStorage.removeItem('jwt'); window.location.href = '/'; }}
                                className="text-lg font-bold leading-5 text-white"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Menu