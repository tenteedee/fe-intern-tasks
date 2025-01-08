import { atom } from 'jotai';
import { User } from '../types/User';

export const userAtom = atom<User | null>(null);

export const isLoggedInAtom = atom<boolean>(
  !!localStorage.getItem('accessToken')
);
