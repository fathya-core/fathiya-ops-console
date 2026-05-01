import { ClipboardList, LineChart, Bug } from 'lucide-react';
import { useActivity } from '../lib/activity';

export function ActivityLog() {
  const { entries } = useActivity();

  return (
    <section className="rounded-2xl border border-gold-700/30 bg-ink-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
            <ClipboardList size={15} className="text-gold-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold gold-gradient-text">سجل النشاط المحلي</h2>
            <div className="font-mono text-[10px] text-gold-600/80 tracking-wider">LOCAL ACTIVITY LOG</div>
          </div>
        </div>
        <div className="text-[11px] font-mono text-gold-600/80">
          {entries.length} ENTRIES
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="p-10 text-center">
          <div className="text-sm text-stone-400 mb-1">لا توجد إدخالات بعد</div>
          <div className="text-[11px] text-stone-500">كل عملية توليد مسودة ستُسجَّل هنا تلقائياً.</div>
        </div>
      ) : (
        <div className="divide-y divide-gold-700/10">
          {entries.slice().reverse().map((e) => {
            const Icon = e.module === 'Market Intel' ? LineChart : Bug;
            return (
              <div key={e.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gold-600/[0.03] transition">
                <div className="w-9 h-9 rounded-md border border-gold-600/30 bg-gold-600/5 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-100">{e.module}</span>
                    <span className="text-[10px] font-mono text-stone-600">·</span>
                    <span className="text-[11px] font-mono text-gold-300/80">{e.outputType}</span>
                  </div>
                  <div className="text-xs text-stone-400 truncate">{e.inputSummary}</div>
                </div>
                <div className="text-left shrink-0">
                  <div className="font-mono text-[10px] text-stone-500">{new Date(e.timestamp).toLocaleTimeString('en-GB')}</div>
                  <span className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {e.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
