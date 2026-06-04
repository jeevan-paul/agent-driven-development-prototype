import { atom } from 'jotai';

export interface LeaveType {
  id: string;
  name: string;
  totalDays: number;
  usedDays: number;
  pendingDays: number;
  color: string;
}

export const leaveTypesAtom = atom<LeaveType[]>([
  { id: 'annual', name: 'Annual Leave', totalDays: 20, usedDays: 6, pendingDays: 2, color: '#085ED7' },
  { id: 'casual', name: 'Casual Leave', totalDays: 10, usedDays: 3, pendingDays: 0, color: '#7c3aed' },
  { id: 'sick', name: 'Sick Leave', totalDays: 15, usedDays: 2, pendingDays: 1, color: '#059669' },
  { id: 'emergency', name: 'Emergency Leave', totalDays: 5, usedDays: 0, pendingDays: 0, color: '#d97706' },
]);
