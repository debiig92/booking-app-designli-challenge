"use client"
import Login from "./components/Login";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!;
export default function Home() {
  const login = () => {
    window.location.href = `${BACKEND}/auth/google`;
  };
  return (
    <Login>
      <button
        onClick={login}
        className="rounded-lg px-4 py-2 bg-teal-500 hover:bg-teal-600"
      >
        Sign in with Google
      </button>
    </Login>
  );
}
