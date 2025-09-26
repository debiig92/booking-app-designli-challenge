"use client"
import Image from "next/image";

interface LoginProps {
    children?: React.ReactNode;
}

const Login: React.FC<LoginProps> = ({ children }) => {
    return (
        <main>
            <div className="bg-gray-100 flex justify-center items-center h-screen">
                <div className="w-1/2 h-screen hidden lg:block">
                    <Image src="/login.jpg" width={500} height={1000} alt="Placeholder Image" className="object-cover w-full h-full" />
                </div>
                <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                    <div className="flex flex-col items-center justify-center gap-8">
                        <h1 className="text-lg md:text-2xl font-bold text-black">BOOKING <span className="text-teal-500">APP</span></h1>
                        <p className="text-sm text-gray-600">
                            Sign in with Google to book time slots. We’ll prevent conflicts with your
                            Google Calendar and with other system bookings.
                        </p>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Login