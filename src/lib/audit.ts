import { createContext, useContext } from 'react';
import type { AuditLogEntry, AuditEventType } from '../types';

export type AuditContextType = {
  auditEntries: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  clearAudit: () => void;
};

export const AuditContext = createContext<AuditContextType>({
  auditEntries: [],
  addAuditEntry: () => {},
  clearAudit: () => {},
});

export const useAudit = () => useContext(AuditContext);

const LS_KEY = 'fathiya.auditLog.v1';

export function loadAuditEntries(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as AuditLogEntry[]) : [];
  } catch { return []; }
}

export function saveAuditEntries(entries: AuditLogEntry[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(entries)); } catch { /* ignore */ }
}

export { type AuditEventType };
