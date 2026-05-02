import { useState } from 'react';
import {
  ListChecks, ChevronRight, Lock, Download, Eye, X,
  ShieldCheck, ShieldX, LineChart, Bug, Clock, AlertTriangle,
} from 'lucide-react';
import { useBridge } from '../lib/bridge';
import { useAudit } from '../lib/audit';
import type { FathiyaBridgePayload, View } from '../types';

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ApprovalQueue({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { payloads, clearPayloads } = useBridge();
  const { addAuditEntry } = useAudit();
  const [selected, setSelected] = useState<FathiyaBridgePayload | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function onExportJson(p: FathiyaBridgePayload) {
    const ts = Date.now();
    const mod = p.source_module.toUpperCase();
    downloadJson(`FATHIYA_PAYLOAD_${mod}_${ts}.json`, p);
    addAuditEntry({
      actor: 'user',
      event_type: 'exported_json',
      module: p.source_module === 'market_intel' ? 'market_intel' : 'bug_bounty',
      risk_level: p.risk_level,
      summary: `Exported JSON payload for "${p.title}"`,
    });
  }

  const statusOrder: Record<string, number> = { pending_approval: 0, draft: 1, blocked: 2, approved: 3, executed: 4 };

  const sorted = [...payloads].sort((a, b) => {
    const so = (statusOrder[a.execution_status] ?? 9) - (statusOrder[b.execution_status] ?? 9);
    if (so !== 0) return so;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-12">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-gold-300/80 hover:text-gold-200 transition mb-5 px-3 py-1.5 rounded-md border border-gold-700/30 hover:border-gold-500/50"
        >
          <ChevronRight size={14} />
          العودة للوحة الرئيسية
        </button>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
              <ListChecks size={14} />
              BRIDGE LAYER · APPROVAL QUEUE
            </div>
            <h1 className="text-3xl font-bold gold-gradient-text mb-2">طابور الموافقة</h1>
            <p className="text-stone-400 text-sm max-w-2xl">
              كل Payload تم توليده ينتظر هنا. لا تنفيذ دون موافقة بشرية صريحة خارج هذه المنصة.
            </p>
          </div>
          {payloads.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="text-[11px] font-mono text-rose-300/70 hover:text-rose-200 transition px-3 py-1.5 rounded-md border border-rose-500/20 hover:border-rose-500/40"
            >
              مسح الطابور
            </button>
          )}
        </div>
      </div>

      {payloads.length === 0 ? (
        <EmptyQueueState />
      ) : (
        <div className="space-y-3">
          {sorted.map((p) => (
            <PayloadRow
              key={p.id}
              payload={p}
              onView={() => setSelected(p)}
              onExport={() => onExportJson(p)}
            />
          ))}
        </div>
      )}

      {/* View modal */}
      {selected && (
        <PayloadModal payload={selected} onClose={() => setSelected(null)} onExport={() => onExportJson(selected)} />
      )}

      {/* Clear confirm */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-ink-900 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-rose-400" />
                </div>
                <span className="text-sm font-semibold text-stone-100">تأكيد المسح</span>
              </div>
              <button onClick={() => setConfirmClear(false)} className="text-stone-500 hover:text-stone-300 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-stone-300 leading-7 mb-1">
                سيتم حذف <span className="font-semibold text-stone-100">{payloads.length}</span> Payload من الطابور.
              </p>
              <p className="text-xs text-stone-500">هذا الإجراء لا يمكن التراجع عنه.</p>
            </div>
            <div className="px-5 pb-5 flex items-center justify-end gap-3">
              <button onClick={() => setConfirmClear(false)} className="px-4 py-2 text-xs rounded-lg border border-stone-700 text-stone-300 hover:border-stone-500 transition">
                إلغاء
              </button>
              <button
                onClick={() => { clearPayloads(); setConfirmClear(false); }}
                className="px-4 py-2 text-xs rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-200 hover:bg-rose-500/20 transition font-medium"
              >
                نعم، امسح
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PayloadRow({
  payload: p, onView, onExport,
}: { payload: FathiyaBridgePayload; onView: () => void; onExport: () => void }) {
  const ModIcon = p.source_module === 'market_intel' ? LineChart : Bug;
  const qPassed = p.quality_gate.passed;

  const riskColors: Record<string, string> = {
    low: 'text-gold-300 bg-gold-600/10 border-gold-600/25',
    medium: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
    high: 'text-rose-300 bg-rose-500/10 border-rose-500/25',
    red_zone: 'text-rose-200 bg-rose-500/15 border-rose-500/40',
  };

  return (
    <div className="rounded-xl border border-gold-700/20 bg-ink-900/50 px-5 py-4 hover:border-gold-600/30 transition">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Module icon */}
        <div className="w-10 h-10 rounded-lg border border-gold-600/30 bg-gold-600/5 flex items-center justify-center shrink-0">
          <ModIcon size={16} className="text-gold-400" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-sm font-medium text-stone-100 truncate">{p.title}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap text-[11px]">
            <span className="font-mono text-stone-500">
              {new Date(p.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="font-mono text-gold-600/80">{p.action_type}</span>
            <span className="font-mono text-stone-500">{p.target_system}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${riskColors[p.risk_level] ?? riskColors.medium}`}>
            {p.risk_level.toUpperCase()}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
            qPassed ? 'bg-gold-600/10 text-gold-200 border-gold-600/25' : 'bg-rose-500/10 text-rose-200 border-rose-500/25'
          }`}>
            {qPassed ? <ShieldCheck size={10} /> : <ShieldX size={10} />}
            {qPassed ? 'QG OK' : 'QG FAIL'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border bg-amber-500/10 text-amber-200 border-amber-500/25">
            <Clock size={10} />
            {p.execution_status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onView}
            className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 transition px-2.5 py-1.5 rounded-md border border-gold-600/30 hover:border-gold-400/60 bg-gold-600/5"
          >
            <Eye size={13} />
            View
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 transition px-2.5 py-1.5 rounded-md border border-gold-600/30 hover:border-gold-400/60 bg-gold-600/5"
          >
            <Download size={13} />
            JSON
          </button>

          {/* Locked Execute button */}
          <div className="group relative">
            <div className="pointer-events-none absolute -top-9 right-0 z-20 whitespace-nowrap rounded-md border border-rose-500/30 bg-ink-950 px-2.5 py-1.5 text-[11px] font-mono text-rose-200 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              مقفل — يتطلب أمرًا صريحًا
              <span className="absolute -bottom-1 right-3 w-2 h-2 rotate-45 bg-ink-950 border-b border-r border-rose-500/30" />
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex items-center gap-1.5 text-xs text-rose-300/50 cursor-not-allowed px-2.5 py-1.5 rounded-md border border-rose-500/20 bg-rose-500/5 opacity-60"
            >
              <Lock size={13} />
              Execute
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-stone-500 leading-5 truncate pl-14">
        {p.payload_preview}
      </div>
    </div>
  );
}

function PayloadModal({ payload: p, onClose, onExport }: {
  payload: FathiyaBridgePayload;
  onClose: () => void;
  onExport: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-ink-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-gold-700/30 bg-ink-900 shadow-2xl shadow-gold-600/10 mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/20">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-gold-400/80 mb-0.5">BRIDGE PAYLOAD</div>
            <div className="text-sm font-semibold text-stone-100 truncate max-w-[400px]">{p.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 transition px-3 py-1.5 rounded-md border border-gold-600/30 hover:border-gold-400/60 bg-gold-600/5"
            >
              <Download size={13} /> Export JSON
            </button>
            <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 text-sm">
          <MetaGrid p={p} />

          <div>
            <div className="font-mono text-[10px] text-gold-600/80 mb-2">PAYLOAD PREVIEW</div>
            <div className="text-stone-300 leading-6 bg-ink-950/60 rounded-lg border border-gold-700/15 px-4 py-3">
              {p.payload_preview}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] text-gold-600/80 mb-2">QUALITY GATE</div>
            <div className={`rounded-lg border px-4 py-3 ${p.quality_gate.passed ? 'border-gold-600/25 bg-gold-600/5' : 'border-rose-500/25 bg-rose-500/5'}`}>
              <div className={`flex items-center gap-2 text-sm font-medium mb-2 ${p.quality_gate.passed ? 'text-gold-200' : 'text-rose-200'}`}>
                {p.quality_gate.passed ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                {p.quality_gate.passed ? 'Passed' : 'Failed'}
              </div>
              {p.quality_gate.warnings.length > 0 && (
                <ul className="space-y-1">
                  {p.quality_gate.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-stone-400">{w}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] text-gold-600/80 mb-2">DRAFT MARKDOWN (EXCERPT)</div>
            <pre className="font-mono text-xs text-stone-400 bg-ink-950/60 border border-gold-700/15 rounded-lg p-4 overflow-auto max-h-48 whitespace-pre-wrap leading-5">
{p.draft_markdown.slice(0, 800)}{p.draft_markdown.length > 800 ? '\n…(truncated)' : ''}
            </pre>
          </div>

          <div className="border border-rose-500/20 rounded-lg px-4 py-3 bg-rose-500/5 flex items-center gap-3">
            <Lock size={14} className="text-rose-400 shrink-0" />
            <span className="text-xs text-rose-200">requires_human_confirmation: true · execution_status: {p.execution_status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaGrid({ p }: { p: FathiyaBridgePayload }) {
  const fields = [
    { label: 'ID', value: p.id.slice(0, 16) + '…' },
    { label: 'Source Module', value: p.source_module },
    { label: 'Action Type', value: p.action_type },
    { label: 'Risk Level', value: p.risk_level },
    { label: 'Target System', value: p.target_system },
    { label: 'Timestamp', value: new Date(p.timestamp).toLocaleString('en-GB') },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {fields.map(f => (
        <div key={f.label} className="bg-ink-950/50 rounded-lg border border-gold-700/15 px-3 py-2">
          <div className="font-mono text-[9px] text-gold-600/70 mb-0.5 uppercase tracking-wider">{f.label}</div>
          <div className="text-xs text-stone-200 font-mono truncate">{f.value}</div>
        </div>
      ))}
    </div>
  );
}

function EmptyQueueState() {
  return (
    <div className="rounded-2xl border border-dashed border-gold-700/25 bg-ink-900/30 flex flex-col items-center justify-center p-16 text-center">
      <div className="w-14 h-14 rounded-full bg-gold-600/5 border border-gold-600/25 flex items-center justify-center mb-4">
        <ListChecks size={22} className="text-gold-400" />
      </div>
      <div className="text-stone-300 font-medium mb-1">الطابور فارغ</div>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
        بعد توليد مسودة من Market Intel أو Bug Bounty، سيظهر Payload هنا بانتظار الموافقة.
      </p>
    </div>
  );
}
