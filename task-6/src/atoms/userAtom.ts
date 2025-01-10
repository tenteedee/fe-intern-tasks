import { atom } from 'jotai';

interface UserState {
  username: string;
}

export const userAtom = atom<UserState | null>(null);
