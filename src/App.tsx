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

  const clearEntries = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem('fathiya.activityLog'); } catch { /* ignore */ }
  }, []);

  const ctx = useMemo(() => ({ entries, addEntry, clearEntries }), [entries, addEntry, clearEntries]);

  return (
    <ActivityContext.Provider value={ctx}>
      <div className="min-h-screen bg-ink-950 text-slate-200">
        <ControlBanner />
        <Header view={view} onNavigate={setView} />
        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'market' && <MarketIntel onNavigate={setView} />}
        {view === 'bounty' && <BugBounty onNavigate={setView} />}
        <footer className="mt-16 border-t border-gold-700/20">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="font-mono text-xs tracking-wider text-gold-600/70">SOVEREIGN INTELLIGENCE LAB · DRAFT-ONLY</div>
            <div className="text-xs text-stone-400 italic text-left sm:text-right">
              فتحية لا تنفذ قرارات. فتحية توسّع الوعي وتنتج مسودات قابلة للمراجعة.
            </div>
          </div>
        </footer>
      </div>
    </ActivityContext.Provider>
  );
}

export default App;
