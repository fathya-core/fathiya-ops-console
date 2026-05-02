import { createContext, useContext } from 'react';

export type LogEntry = {
  id: string;
  timestamp: string;
  module: 'Market Intel' | 'Bug Bounty';
  inputSummary: string;
  outputType: string;
  status: 'Draft Generated';
};

export type ActivityContextType = {
  entries: LogEntry[];
  addEntry: (entry: Omit<LogEntry, 'id' | 'timestamp' | 'status'>) => void;
  clearEntries: () => void;
};

export const ActivityContext = createContext<ActivityContextType>({
  entries: [],
  addEntry: () => {},
  clearEntries: () => {},
});

export const useActivity = () => useContext(ActivityContext);
