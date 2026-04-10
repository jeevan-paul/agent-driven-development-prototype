import { atom } from 'jotai';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarInitials: string;
}

export const isAuthenticatedAtom = atom<boolean>(false);

export const authUserAtom = atom<AuthUser | null>(null);
