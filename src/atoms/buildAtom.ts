import { atom } from 'jotai';

export type BuildFormState = {
  description: string;
};

export type BuildSubmitStatus =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; issueUrl: string; issueNumber: number }
  | { type: 'error'; message: string };

export const buildFormAtom = atom<BuildFormState>({ description: '' });
export const buildSubmitStatusAtom = atom<BuildSubmitStatus>({ type: 'idle' });
