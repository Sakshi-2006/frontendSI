// Thin session shim that delegates to the real backend via authService while
// preserving the pre-existing `getSession/login/logout` surface every page
// already imports from "@/lib/auth". Session shape kept identical.

import { authService, type AuthUser } from "@/services/authService";
import { tokenStore } from "@/services/api";

export type Session = { email: string; name: string; role: string };

function toSession(u: AuthUser | null): Session | null {
  if (!u) return null;
  return { email: u.email, name: u.name, role: u.role ?? "Officer" };
}

/** Real backend login. Throws on failure so the caller can surface the error. */
export async function login(email: string, password: string): Promise<Session> {
  const user = await authService.login(email, password);
  return toSession(user)!;
}

export async function logout(): Promise<void> {
  await authService.logout();
}

/** Synchronous session read used by route guards. Backed by localStorage. */
export function getSession(): Session | null {
  return toSession(authService.getStoredUser());
}

/** Optional async refresh — useful after mount to re-validate the token. */
export async function refreshSession(): Promise<Session | null> {
  const user = await authService.me();
  return toSession(user);
}

export { tokenStore };
