// Temporary stub for 'next-auth/react' while real dependency fails to install.
// Remove this file and tsconfig path when next-auth installs successfully.
export interface Session {
  user?: { id?: string; name?: string; email?: string };
  expires?: string;
}

export function useSession(): { data: Session | null; status: 'loading' | 'authenticated' | 'unauthenticated' } {
  return { data: null, status: 'unauthenticated' };
}

export function signIn(_provider?: string, _opts?: Record<string, unknown>) {
  // no-op stub
  return Promise.resolve();
}

export function signOut() {
  return Promise.resolve();
}

export function getSession() {
  return Promise.resolve<Session | null>(null);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return children as any;
}
