import { redirect } from 'next/navigation';
import { getAuthenticatedUser } from '@/lib/auth';
import CredentialsClient from './CredentialsClient';

export const metadata = {
  title: 'Karmayogi Digital Passport | DigiLocker W3C Verifiable Credentials',
  description: 'Sovereign W3C Verifiable Credentials issued by MoSPI and NSSTA, backed by DigiLocker and cryptographic Ed25519 signatures.',
};

export default async function CredentialsPage() {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth/login');
  }
  return <CredentialsClient user={user} />;
}
