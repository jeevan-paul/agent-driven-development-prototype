import { atom } from 'jotai';

export type BuildFormState = {
  title: string;
  description: string;
};

export type BuildSubmitStatus =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; issueUrl: string; issueNumber: number }
  | { type: 'error'; message: string };

export const buildFormAtom = atom<BuildFormState>({ title: '', description: '' });
export const buildSubmitStatusAtom = atom<BuildSubmitStatus>({ type: 'idle' });
