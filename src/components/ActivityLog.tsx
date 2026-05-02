import { useState } from 'react';
import { ClipboardList, LineChart, Bug, Trash2, X, AlertTriangle } from 'lucide-react';
import { useActivity } from '../lib/activity';

export function ActivityLog() {
  const { entries, clearEntries } = useActivity();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleClear() {
    clearEntries();
    setConfirmOpen(false);
  }

  return (
    <>
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
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-gold-600/80">{entries.length} ENTRIES</div>
            {entries.length > 0 && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-300/80 hover:text-rose-200 transition px-2.5 py-1 rounded-md border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5"
              >
                <Trash2 size={11} />
                Clear Log
              </button>
            )}
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

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-ink-900 shadow-2xl shadow-rose-500/10 animate-fade-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-rose-400" />
                </div>
                <span className="text-sm font-semibold text-stone-100">تأكيد المسح</span>
              </div>
              <button onClick={() => setConfirmOpen(false)} className="text-stone-500 hover:text-stone-300 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-stone-300 leading-7 mb-1">
                سيتم حذف <span className="font-semibold text-stone-100">{entries.length}</span> إدخال من سجل النشاط المحلي.
              </p>
              <p className="text-xs text-stone-500">هذا الإجراء لا يمكن التراجع عنه. البيانات محلية فقط.</p>
            </div>
            <div className="px-5 pb-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-xs rounded-lg border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 text-xs rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-200 hover:bg-rose-500/20 hover:border-rose-400/60 transition font-medium"
              >
                نعم، امسح السجل
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
