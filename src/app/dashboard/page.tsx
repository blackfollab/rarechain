import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrivyClient } from '@privy-io/server-auth';
import DashboardClient from './DashboardClient';

interface TokenClaims {
  picture?: string;
  wallet?: { address: string };
  [key: string]: unknown;
}

export default async function DashboardPage() {
  const token = (await cookies()).get('privy-token')?.value;
  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;

  if (!token || !PRIVY_APP_ID || !PRIVY_APP_SECRET) {
    redirect('/');
  }

  const client = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);

  try {
    const claims = await client.verifyAuthToken(token);
    const { picture } = claims as unknown as TokenClaims;

    return <DashboardClient picture={picture} />;
  } catch (err) {
    console.error('Invalid or expired token:', err);
    redirect('/');
  }
}
