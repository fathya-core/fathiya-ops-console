import { useState } from 'react';
import { LineChart, Sparkles, TrendingUp, TrendingDown, XOctagon, Bell, Gauge, EyeOff, Loader2, Save, CheckCircle2, Database, ChevronRight, Download } from 'lucide-react';
import { Field, Input, Select, Textarea, SectionCard, PrimaryButton } from '../components/ui';
import { generateMarketIntel } from '../lib/mock';
import { supabase } from '../lib/supabase';
import { useActivity } from '../lib/activity';
import type { MarketIntelOutput, View } from '../types';

export function MarketIntel({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [asset, setAsset] = useState('');
  const [timeframe, setTimeframe] = useState('4H');
  const [marketContext, setMarketContext] = useState('نطاق عرضي');
  const [dataSource, setDataSource] = useState('Binance Spot');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [notes, setNotes] = useState('');
  const [output, setOutput] = useState<MarketIntelOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addEntry } = useActivity();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    await new Promise(r => setTimeout(r, 600));
    const generated = generateMarketIntel({ asset, timeframe, marketContext, dataSource, riskLevel, notes });
    setOutput(generated);

    addEntry({
      module: 'Market Intel',
      inputSummary: `${asset || 'N/A'} · ${timeframe} · ${marketContext} · ${dataSource} · risk:${riskLevel}`,
      outputType: 'Analysis Draft',
    });

    try {
      await supabase.from('market_intel_reports').insert({
        asset, timeframe, data_source: dataSource, risk_level: riskLevel,
        notes: [marketContext ? `سياق السوق: ${marketContext}` : '', notes].filter(Boolean).join('\n\n'),
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
      <PageHeader onNavigate={onNavigate} />

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gold-700/30 bg-ink-900/60 p-6 h-fit lg:sticky lg:top-40">
          <div className="flex items-center gap-2 pb-4 border-b border-gold-700/20">
            <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
              <Sparkles size={15} className="text-gold-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-100">مُدخلات التحليل</div>
              <div className="font-mono text-[10px] text-gold-600/80">INPUT · READ ONLY</div>
            </div>
          </div>

          <Field label="الأصل / زوج العملة" hint="ASSET">
            <Input required placeholder="BTC/USDT" value={asset} onChange={e => setAsset(e.target.value)} />
          </Field>

          <Field label="الإطار الزمني" hint="TIMEFRAME">
            <Select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
              <option>15M</option><option>1H</option><option>4H</option><option>1D</option>
              <option>1W</option><option>1M</option>
            </Select>
          </Field>

          <Field label="سياق السوق" hint="MARKET CONTEXT">
            <Select value={marketContext} onChange={e => setMarketContext(e.target.value)}>
              <option>اتجاه صاعد</option>
              <option>اتجاه هابط</option>
              <option>نطاق عرضي</option>
              <option>تقلب مرتفع</option>
              <option>حدث ماكرو مرتقب</option>
            </Select>
          </Field>

          <Field label="مصدر البيانات" hint="SOURCE">
            <Select value={dataSource} onChange={e => setDataSource(e.target.value)}>
              <option>Binance Spot</option><option>Binance Futures</option>
              <option>Coinbase</option><option>Kraken</option><option>On-chain</option>
            </Select>
          </Field>

          <Field label="مستوى المخاطرة" hint="RISK">
            <Select value={riskLevel} onChange={e => setRiskLevel(e.target.value)}>
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">مرتفع</option>
            </Select>
          </Field>

          <Field label="ملاحظات المحلل" hint="NOTES">
            <Textarea placeholder="سياق ماكرو، مشاهدات، افتراضات..." value={notes} onChange={e => setNotes(e.target.value)} />
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
            المخرجات مسودة للتحليل فقط. لا يتم تنفيذ أي أوامر تداول أو إرسال أي تنبيهات خارجية.
          </p>
        </form>

        <div className="min-h-[400px]">
          {!output && <EmptyState />}
          {output && <OutputPanel output={output} asset={asset} timeframe={timeframe} marketContext={marketContext} />}
        </div>
      </div>
    </div>
  );
}

function PageHeader({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="mb-10">
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs text-gold-300/80 hover:text-gold-200 transition mb-5 px-3 py-1.5 rounded-md border border-gold-700/30 hover:border-gold-500/50"
      >
        <ChevronRight size={14} />
        <span>العودة للوحة الرئيسية</span>
      </button>
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
        <LineChart size={14} />
        MODULE · 01 · MARKET INTEL
      </div>
      <h1 className="text-3xl font-bold gold-gradient-text mb-2">استخبارات السوق</h1>
      <p className="text-stone-400 text-sm max-w-2xl">
        صياغة فرضية تحليلية مركزية مع سيناريوهات معاكسة وشروط إبطال. لا تنفيذ — مسودة للمراجعة البشرية.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/30 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gold-600/5 border border-gold-600/30 flex items-center justify-center mb-4">
        <LineChart size={22} className="text-gold-400" />
      </div>
      <div className="text-stone-300 font-medium mb-1">بانتظار مدخلات التحليل</div>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
        املأ النموذج ثم اضغط "Analyze Draft" لعرض الفرضيات والسيناريوهات.
      </p>
    </div>
  );
}

function toMarkdown(output: MarketIntelOutput, asset: string, timeframe: string, context: string) {
  return `# Market Intel Draft — ${asset || 'N/A'}

- Timeframe: ${timeframe}
- Market Context: ${context}
- Generated: ${new Date().toISOString()}
- Status: Draft Only

## Core Thesis
${output.coreThesis}

## Bullish Scenario
${output.bullishScenario}

## Bearish Scenario
${output.bearishScenario}

## Invalidation Conditions
${output.invalidation.map((x, i) => `${i + 1}. ${x}`).join('\n')}

## Early Warning Signals
${output.earlyWarnings.map((x, i) => `${i + 1}. ${x}`).join('\n')}

## Confidence Score
${output.confidenceScore} / 100

## Hidden Risk
${output.hiddenRisk}

## Next Data Needed
${output.nextDataNeeded.map((x, i) => `${i + 1}. ${x}`).join('\n')}
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

function OutputPanel({ output, asset, timeframe, marketContext }: { output: MarketIntelOutput; asset: string; timeframe: string; marketContext: string }) {
  const conf = output.confidenceScore;
  const confColor: 'gold' | 'amber' | 'rose' = conf >= 70 ? 'gold' : conf >= 50 ? 'amber' : 'rose';
  const confColorHex = conf >= 70 ? '#e4c57f' : conf >= 50 ? '#fbbf24' : '#fb7185';

  const onExport = () => {
    const md = toMarkdown(output, asset, timeframe, marketContext);
    const safeAsset = (asset || 'market').replace(/[^a-z0-9]/gi, '_');
    downloadMarkdown(`market-intel_${safeAsset}_${Date.now()}.md`, md);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-gold-700/20 bg-ink-900/40 px-5 py-3">
        <div className="flex items-center gap-3">
          <Save size={14} className="text-gold-300" />
          <div className="text-xs text-stone-400">
            مسودة لـ <span className="text-stone-100 font-mono">{asset || 'N/A'}</span> · <span className="font-mono">{timeframe}</span>
          </div>
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

      <SectionCard title="الفرضية المركزية" tag="CORE THESIS" icon={<Sparkles size={14} />} accent="gold">
        {output.coreThesis}
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="السيناريو الصاعد" tag="BULLISH" icon={<TrendingUp size={14} />} accent="gold">
          {output.bullishScenario}
        </SectionCard>
        <SectionCard title="السيناريو الهابط" tag="BEARISH" icon={<TrendingDown size={14} />} accent="rose">
          {output.bearishScenario}
        </SectionCard>
      </div>

      <SectionCard title="شروط الإبطال" tag="INVALIDATION" icon={<XOctagon size={14} />} accent="rose">
        <ul className="space-y-2">
          {output.invalidation.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] text-rose-400/70 mt-1.5 shrink-0">[{String(i+1).padStart(2,'0')}]</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="إشارات إنذار مبكر" tag="EARLY WARNINGS" icon={<Bell size={14} />} accent="amber">
        <ul className="space-y-2">
          {output.earlyWarnings.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] text-amber-400/70 mt-1.5 shrink-0">[{String(i+1).padStart(2,'0')}]</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="درجة الثقة" tag="CONFIDENCE" icon={<Gauge size={14} />} accent={confColor}>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2a2318" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={confColorHex} strokeWidth="3"
                strokeDasharray={`${conf} 100`} strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-lg font-semibold text-stone-100">{conf}</span>
            </div>
          </div>
          <div className="text-sm text-stone-400 leading-6">
            الدرجة محسوبة بناءً على مستوى المخاطرة المُدخل وتماسك البنية. مؤشر تقديري — لا يُستخدم كأساس وحيد لأي قرار.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="المخاطرة الخفية" tag="HIDDEN RISK" icon={<EyeOff size={14} />} accent="slate">
        {output.hiddenRisk}
      </SectionCard>

      <SectionCard title="البيانات التالية المطلوبة" tag="NEXT DATA NEEDED" icon={<Database size={14} />} accent="gold">
        <ul className="space-y-2">
          {output.nextDataNeeded.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] text-gold-400/80 mt-1.5 shrink-0">[{String(i+1).padStart(2,'0')}]</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
