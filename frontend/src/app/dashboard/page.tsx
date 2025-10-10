import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Status from './components/Status';
import BookingList from './components/BookingList';
import CreateBooking from './components/CreateBooking';
import { BookingProvider } from '../hooks/BookingContext';

export default async function Dashboard() {
  const session = await getSession();
  //console.log("getSession ",session)
  if (!session?.user) { redirect('/api/auth/login?returnTo=/dashboard'); }


  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-bold text-black">DASHBOARD</h1>
      </header>
       <BookingProvider>
        <Status />

        <CreateBooking />

        <BookingList />
      </BookingProvider> 

    </main>
  );
}
