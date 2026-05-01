import { useCallback, useMemo, useState } from 'react';
import { ControlBanner } from './components/ControlBanner';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { MarketIntel } from './pages/MarketIntel';
import { BugBounty } from './pages/BugBounty';
import { ActivityContext, LogEntry } from './lib/activity';
import type { View } from './types';

function App() {
  const [view, setView] = useState<View>('home');
  const [entries, setEntries] = useState<LogEntry[]>(() => {
    try {
      const raw = localStorage.getItem('fathiya.activityLog');
      return raw ? (JSON.parse(raw) as LogEntry[]) : [];
    } catch {
      return [];
    }
  });

  const addEntry = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp' | 'status'>) => {
    setEntries((prev) => {
      const next: LogEntry[] = [
        ...prev,
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          status: 'Draft Generated',
        },
      ];
      try {
        localStorage.setItem('fathiya.activityLog', JSON.stringify(next));
      } catch {
        // ignore storage quota / unavailability
      }
      return next;
    });
  }, []);

  const ctx = useMemo(() => ({ entries, addEntry }), [entries, addEntry]);

  return (
    <ActivityContext.Provider value={ctx}>
      <div className="min-h-screen bg-ink-950 text-slate-200">
        <ControlBanner />
        <Header view={view} onNavigate={setView} />
        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'market' && <MarketIntel onNavigate={setView} />}
        {view === 'bounty' && <BugBounty onNavigate={setView} />}
        <footer className="mt-16 border-t border-gold-700/20">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gold-600/70">
            <div className="font-mono tracking-wider">SOVEREIGN INTELLIGENCE LAB · DRAFT-ONLY</div>
            <div>لا تنفيذ فعلي · الإجراءات الخارجية بانتظار تأكيد بشري</div>
          </div>
        </footer>
      </div>
    </ActivityContext.Provider>
  );
}

export default App;
