import { Mail, Webhook, Github, Workflow, Send, TrendingUp, Lock, AlertOctagon } from 'lucide-react';

const actions: { icon: typeof Mail; label: string; sub: string }[] = [
  { icon: Mail, label: 'Send Email', sub: 'إرسال بريد إلكتروني' },
  { icon: Webhook, label: 'Trigger Webhook', sub: 'تشغيل Webhook' },
  { icon: Github, label: 'Modify GitHub', sub: 'تعديل على GitHub' },
  { icon: Workflow, label: 'Run n8n Workflow', sub: 'تشغيل سير عمل n8n' },
  { icon: Send, label: 'Submit Bug Report', sub: 'إرسال بلاغ ثغرة' },
  { icon: TrendingUp, label: 'Execute Trade', sub: 'تنفيذ صفقة تداول' },
];

export function RedZone() {
  return (
    <section className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-ink-900/60 to-ink-900/60 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <AlertOctagon size={15} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-100">المنطقة الحمراء</h2>
            <div className="font-mono text-[10px] text-rose-300/80 tracking-wider">RED ZONE · LOCKED</div>
          </div>
        </div>
        <span className="text-[11px] font-mono text-rose-300/80 inline-flex items-center gap-1.5">
          <Lock size={11} /> EXPLICIT COMMAND REQUIRED
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs text-stone-400 mb-5 leading-6">
          كل الإجراءات الخارجية مُقفلة. يتطلب تنفيذها أمراً بشرياً صريحاً خارج هذه الواجهة.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((a) => (
            <div key={a.label} className="group relative">
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-9 right-1/2 translate-x-1/2 z-20 whitespace-nowrap rounded-md border border-rose-500/30 bg-ink-950 px-2.5 py-1.5 text-[11px] font-mono text-rose-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                مقفل — يتطلب أمرًا صريحًا
                <span className="absolute -bottom-1 right-1/2 translate-x-1/2 w-2 h-2 rotate-45 bg-ink-950 border-b border-r border-rose-500/30" />
              </div>

              <button
                type="button"
                disabled
                aria-disabled="true"
                className="w-full text-right rounded-lg border border-stone-800 bg-ink-950/60 p-4 opacity-80 cursor-not-allowed hover:border-rose-500/40 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-md bg-rose-500/5 border border-rose-500/20 flex items-center justify-center">
                    <a.icon size={15} className="text-rose-300/80" />
                  </div>
                  <Lock size={14} className="text-rose-400/80" />
                </div>
                <div className="text-sm font-medium text-stone-200">{a.label}</div>
                <div className="text-[11px] text-stone-500 mb-3">{a.sub}</div>
                <div className="text-[11px] font-mono text-rose-300/80 border-t border-stone-800/80 pt-2.5">
                  Locked — requires explicit command.
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
