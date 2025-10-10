import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

export default async function AuthCallback() {
  const session = await getSession();
  if (session?.user) redirect('/dashboard');
  redirect('/');
}
