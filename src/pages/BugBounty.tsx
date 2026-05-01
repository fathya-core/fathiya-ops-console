import { useState } from 'react';
import { Bug, Map, AlertTriangle, CheckSquare, FileText, ClipboardList, Loader2, Sparkles, CheckCircle2, ShieldCheck, ShieldOff, ChevronRight, Download } from 'lucide-react';
import { Field, Input, Textarea, SectionCard, PrimaryButton } from '../components/ui';
import { generateBugBounty } from '../lib/mock';
import { supabase } from '../lib/supabase';
import { useActivity } from '../lib/activity';
import type { BugBountyOutput, View } from '../types';

export function BugBounty({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [programName, setProgramName] = useState('');
  const [policyUrl, setPolicyUrl] = useState('');
  const [allowedScope, setAllowedScope] = useState('');
  const [forbiddenScope, setForbiddenScope] = useState('');
  const [assets, setAssets] = useState('');
  const [notes, setNotes] = useState('');
  const [output, setOutput] = useState<BugBountyOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addEntry } = useActivity();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await new Promise(r => setTimeout(r, 600));
    const generated = generateBugBounty({ programName, policyUrl, allowedScope, forbiddenScope, assets, notes });
    setOutput(generated);

    const assetCount = assets.split(/[\n,]/).filter(s => s.trim()).length;
    addEntry({
      module: 'Bug Bounty',
      inputSummary: `${programName || 'Unnamed'} · assets:${assetCount}`,
      outputType: 'Report Draft',
    });

    try {
      await supabase.from('bug_bounty_reports').insert({
        program_name: programName,
        policy_url: policyUrl,
        allowed_scope: allowedScope,
        forbidden_scope: forbiddenScope,
        assets,
        notes,
        output: generated,
      });
      setSaved(true);
    } catch {
      // drafts stay local if db unavailable
    }
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-12">
      <div className="mb-10">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-gold-300/80 hover:text-gold-200 transition mb-5 px-3 py-1.5 rounded-md border border-gold-700/30 hover:border-gold-500/50"
        >
          <ChevronRight size={14} />
          <span>العودة للوحة الرئيسية</span>
        </button>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
          <Bug size={14} />
          MODULE · 02 · BUG BOUNTY
        </div>
        <h1 className="text-3xl font-bold gold-gradient-text mb-2">مكافآت الثغرات</h1>
        <p className="text-stone-400 text-sm max-w-2xl">
          تخطيط تحليلي: خرائط نطاق، جرد أصول، فرضيات، وقوائم تحقق. لا فحص ولا استغلال — مسودة تقرير فقط.
        </p>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gold-700/30 bg-ink-900/60 p-6 h-fit lg:sticky lg:top-40">
          <div className="flex items-center gap-2 pb-4 border-b border-gold-700/20">
            <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
              <ClipboardList size={15} className="text-gold-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-100">مُدخلات البرنامج</div>
              <div className="font-mono text-[10px] text-gold-600/80">INPUT · READ ONLY</div>
            </div>
          </div>

          <Field label="اسم البرنامج" hint="PROGRAM">
            <Input required placeholder="Acme Security Program" value={programName} onChange={e => setProgramName(e.target.value)} />
          </Field>
          <Field label="رابط السياسة" hint="POLICY URL">
            <Input type="url" placeholder="https://example.com/security" value={policyUrl} onChange={e => setPolicyUrl(e.target.value)} />
          </Field>
          <Field label="النطاق المسموح" hint="IN-SCOPE">
            <Textarea placeholder="*.example.com&#10;api.example.com" value={allowedScope} onChange={e => setAllowedScope(e.target.value)} />
          </Field>
          <Field label="النطاق الممنوع" hint="OUT-OF-SCOPE">
            <Textarea placeholder="billing.example.com&#10;internal.example.com" value={forbiddenScope} onChange={e => setForbiddenScope(e.target.value)} />
          </Field>
          <Field label="الأصول" hint="ASSETS">
            <Textarea placeholder="app.example.com&#10;android.apk" value={assets} onChange={e => setAssets(e.target.value)} />
          </Field>
          <Field label="ملاحظات" hint="NOTES">
            <Textarea placeholder="قيود وقت الاختبار، ملاحظات تقنية..." value={notes} onChange={e => setNotes(e.target.value)} />
          </Field>

          <div className="flex items-center gap-3 pt-2">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing</> : <><Sparkles size={16} /> Analyze Draft</>}
            </PrimaryButton>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gold-300">
                <CheckCircle2 size={14} /> محفوظة
              </span>
            )}
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed border-t border-gold-700/20 pt-4">
            لن يتم إرسال أي طلب شبكي نحو الأصول، ولا تنفيذ أي فحص أو استغلال. المخرجات نصية فقط.
          </p>
        </form>

        <div className="min-h-[400px]">
          {!output && <EmptyState />}
          {output && <OutputPanel output={output} programName={programName} />}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/30 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gold-600/5 border border-gold-600/30 flex items-center justify-center mb-4">
        <Bug size={22} className="text-gold-400" />
      </div>
      <div className="text-stone-300 font-medium mb-1">بانتظار بيانات البرنامج</div>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
        أدخل نطاق البرنامج والأصول ثم اضغط "توليد مسودة تقرير".
      </p>
    </div>
  );
}

function toMarkdown(output: BugBountyOutput, programName: string) {
  return `# Bug Bounty Draft — ${programName || 'Unnamed Program'}

- Generated: ${new Date().toISOString()}
- Status: Draft Only (no real testing performed)

## Scope Map
### In-Scope
${output.scopeMap.in.map(s => `- ${s}`).join('\n')}

### Out-of-Scope
${output.scopeMap.out.map(s => `- ${s}`).join('\n')}

## Allowed Assets
${output.assetInventory.map(a => `- ${a.name} (${a.type}) — priority: ${a.priority}`).join('\n')}

## Forbidden Assets
${output.scopeMap.out.map(s => `- ${s}`).join('\n')}

## Vulnerability Hypotheses
${output.vulnHypotheses.map((v, i) => `${i + 1}. **${v.title}** — severity: ${v.severity}\n   ${v.rationale}`).join('\n\n')}

## Safe Test Checklist
${output.safeChecklist.map((c, i) => `- [ ] ${c}`).join('\n')}

## Evidence Template
\`\`\`
${output.evidenceTemplate}
\`\`\`

## Draft Report
${output.reportDraft}
`;
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function OutputPanel({ output, programName }: { output: BugBountyOutput; programName: string }) {
  const onExport = () => {
    const md = toMarkdown(output, programName);
    const safe = (programName || 'program').replace(/[^a-z0-9]/gi, '_');
    downloadMarkdown(`bug-bounty_${safe}_${Date.now()}.md`, md);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-gold-700/20 bg-ink-900/40 px-5 py-3">
        <div className="text-xs text-stone-400">
          مسودة لبرنامج <span className="text-stone-100 font-medium">{programName || 'غير مسمى'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 transition px-3 py-1.5 rounded-md border border-gold-600/30 hover:border-gold-400/60 bg-gold-600/5"
          >
            <Download size={13} />
            Export Draft
          </button>
          <span className="font-mono text-[10px] tracking-[0.3em] text-gold-600/80">DRAFT OUTPUT</span>
        </div>
      </div>

      <SectionCard title="خريطة النطاق" tag="SCOPE MAP" icon={<Map size={14} />} accent="gold">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-mono text-gold-300/90 mb-2 flex items-center gap-1.5"><ShieldCheck size={12} /> IN-SCOPE</div>
            <ul className="space-y-1.5">
              {output.scopeMap.in.map((s, i) => (
                <li key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gold-600/5 border border-gold-600/20 font-mono text-xs text-stone-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-mono text-rose-400/80 mb-2 flex items-center gap-1.5"><ShieldOff size={12} /> OUT-OF-SCOPE</div>
            <ul className="space-y-1.5">
              {output.scopeMap.out.map((s, i) => (
                <li key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-500/5 border border-rose-500/15 font-mono text-xs text-stone-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الأصول المسموحة" tag="ALLOWED ASSETS" icon={<ShieldCheck size={14} />} accent="gold">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-mono text-gold-600/80 text-right">
                <th className="pb-2 font-normal">الاسم</th>
                <th className="pb-2 font-normal">النوع</th>
                <th className="pb-2 font-normal">الأولوية</th>
              </tr>
            </thead>
            <tbody>
              {output.assetInventory.map((a, i) => (
                <tr key={i} className="border-t border-gold-700/10">
                  <td className="py-2.5 font-mono text-xs text-stone-200">{a.name}</td>
                  <td className="py-2.5 text-stone-400">{a.type}</td>
                  <td className="py-2.5">
                    <span className={`inline-block px-2 py-0.5 text-[11px] rounded font-medium ${
                      a.priority === 'عالية' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                      a.priority === 'متوسطة' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                      'bg-gold-600/10 text-gold-300 border border-gold-600/20'
                    }`}>{a.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="الأصول الممنوعة" tag="FORBIDDEN ASSETS" icon={<ShieldOff size={14} />} accent="rose">
        <ul className="space-y-2">
          {output.scopeMap.out.map((s, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-md bg-rose-500/5 border border-rose-500/15 font-mono text-xs text-stone-200">
              <ShieldOff size={13} className="text-rose-400 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="فرضيات الثغرات" tag="HYPOTHESES" icon={<AlertTriangle size={14} />} accent="amber">
        <div className="space-y-3">
          {output.vulnHypotheses.map((v, i) => (
            <div key={i} className="rounded-lg border border-gold-700/15 bg-ink-950/40 p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="font-medium text-stone-100">{v.title}</div>
                <span className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded ${
                  v.severity === 'عالية' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                  v.severity === 'متوسطة' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                  'bg-gold-600/10 text-gold-300 border border-gold-600/20'
                }`}>{v.severity}</span>
              </div>
              <p className="text-xs text-stone-400 leading-6">{v.rationale}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="قائمة الفحص الآمن" tag="SAFE CHECKLIST" icon={<CheckSquare size={14} />} accent="gold">
        <ul className="space-y-2">
          {output.safeChecklist.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckSquare size={14} className="text-gold-400 mt-1 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="قالب الأدلة" tag="EVIDENCE TEMPLATE" icon={<FileText size={14} />} accent="slate">
        <pre className="font-mono text-xs text-stone-300 bg-ink-950/60 border border-gold-700/15 rounded-lg p-4 overflow-auto whitespace-pre-wrap leading-6">
{output.evidenceTemplate}
        </pre>
      </SectionCard>

      <SectionCard title="مسودة التقرير" tag="REPORT DRAFT" icon={<FileText size={14} />} accent="gold">
        <pre className="font-mono text-xs text-stone-300 bg-ink-950/60 border border-gold-700/15 rounded-lg p-4 overflow-auto whitespace-pre-wrap leading-6">
{output.reportDraft}
        </pre>
      </SectionCard>
    </div>
  );
}
