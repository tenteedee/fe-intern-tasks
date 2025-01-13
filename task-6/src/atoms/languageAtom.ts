import { atom } from 'jotai';
import i18n from './../i18n';

export const languageAtom = atom<string>(i18n.language);

export const setLanguageAtom = atom(
  (get) => get(languageAtom),
  (get, set, newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    set(languageAtom, newLanguage);
  }
);
