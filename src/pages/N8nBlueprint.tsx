import {
  Workflow, ChevronRight, ArrowLeft, CheckCircle2, Clock, Lock,
  Package, ShieldCheck, Database, Users, GitBranch, Receipt,
} from 'lucide-react';
import type { View } from '../types';

type NodeStatus = 'mock' | 'disabled';

type WorkflowNode = {
  id: number;
  icon: typeof Package;
  titleEn: string;
  titleAr: string;
  description: string;
  status: NodeStatus;
  type: 'trigger' | 'process' | 'gate' | 'wait' | 'route' | 'output';
};

const nodes: WorkflowNode[] = [
  {
    id: 1,
    icon: Package,
    titleEn: 'Receive FATHIYA Payload',
    titleAr: 'استقبال الـ Payload',
    description: 'استقبال Bridge Payload من محركات Market Intel أو Bug Bounty. التحقق من صحة البنية قبل المتابعة.',
    status: 'mock',
    type: 'trigger',
  },
  {
    id: 2,
    icon: ShieldCheck,
    titleEn: 'Validate Quality Gate',
    titleAr: 'التحقق من Quality Gate',
    description: 'التأكد من أن Quality Gate اجتاز الفحص، وأن المخرج لا يحتوي مصطلحات ممنوعة، وأن حدود الحكم موجودة.',
    status: 'mock',
    type: 'gate',
  },
  {
    id: 3,
    icon: Database,
    titleEn: 'Store Audit Log',
    titleAr: 'تخزين سجل التدقيق',
    description: 'تسجيل الحدث في Audit Log مع timestamp، المصدر، مستوى الخطر، وحالة Quality Gate.',
    status: 'mock',
    type: 'process',
  },
  {
    id: 4,
    icon: Users,
    titleEn: 'Wait for Human Approval',
    titleAr: 'انتظار الموافقة البشرية',
    description: 'الـ Payload يتوقف هنا. لا تنفيذ دون موافقة بشرية صريحة وأمر واضح خارج هذه المنصة.',
    status: 'disabled',
    type: 'wait',
  },
  {
    id: 5,
    icon: GitBranch,
    titleEn: 'Route to Target System',
    titleAr: 'توجيه للنظام الهدف',
    description: 'بعد الموافقة: توجيه الـ Payload نحو n8n، GitHub، Zapier، أو Email وفق الإعدادات. معطّل حالياً.',
    status: 'disabled',
    type: 'route',
  },
  {
    id: 6,
    icon: Receipt,
    titleEn: 'Return Execution Receipt',
    titleAr: 'إيصال التنفيذ',
    description: 'إرجاع إيصال تنفيذ موقّت يحتوي حالة العملية، النظام الهدف، والـ timestamp. معطّل حالياً.',
    status: 'disabled',
    type: 'output',
  },
];

const typeStyles: Record<WorkflowNode['type'], string> = {
  trigger: 'border-gold-600/40 bg-gold-600/5',
  process: 'border-gold-700/30 bg-ink-900/60',
  gate: 'border-amber-500/30 bg-amber-500/5',
  wait: 'border-stone-700/50 bg-stone-800/20',
  route: 'border-stone-700/50 bg-stone-800/20',
  output: 'border-stone-700/50 bg-stone-800/20',
};

const typeIconColors: Record<WorkflowNode['type'], string> = {
  trigger: 'text-gold-400',
  process: 'text-gold-300',
  gate: 'text-amber-400',
  wait: 'text-stone-400',
  route: 'text-stone-400',
  output: 'text-stone-400',
};

export function N8nBlueprint({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-14 pb-12">
      {/* Page header */}
      <div className="mb-10">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-gold-300/80 hover:text-gold-200 transition mb-5 px-3 py-1.5 rounded-md border border-gold-700/30 hover:border-gold-500/50"
        >
          <ChevronRight size={14} />
          العودة للوحة الرئيسية
        </button>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
          <Workflow size={14} />
          BRIDGE LAYER · n8n BLUEPRINT
        </div>
        <h1 className="text-3xl font-bold gold-gradient-text mb-2">مخطط n8n Bridge</h1>
        <p className="text-stone-400 text-sm max-w-2xl leading-7">
          هذا المخطط يوضّح تصميم سير العمل المستقبلي بين فتحية ونظام n8n الخارجي.
          كل العقد في وضع Mock/Disabled — لا تنفيذ فعلي في هذه المرحلة.
        </p>
      </div>

      {/* Doctrine banner */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 mb-10 flex items-start gap-3">
        <Lock size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <div>
          <div className="text-sm font-medium text-amber-200 mb-1">مبدأ التنفيذ المؤجّل</div>
          <p className="text-xs text-stone-400 leading-6">
            كل عقدة في هذا المخطط تمثّل خطوة مستقبلية. الخطوات 4–6 معطّلة ومقفلة حتى يتوفر
            نظام موافقة بشري صريح خارج هذه الواجهة. فتحية لا تنفذ — فتحية تُعدّ وتنتظر.
          </p>
        </div>
      </div>

      {/* Workflow nodes */}
      <div className="relative">
        {/* Connector line */}
        <div className="absolute top-0 bottom-0 right-[27px] w-px bg-gold-700/20 z-0 hidden sm:block" />

        <div className="space-y-4 relative z-10">
          {nodes.map((node, idx) => (
            <WorkflowCard key={node.id} node={node} index={idx} isLast={idx === nodes.length - 1} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-10 rounded-xl border border-gold-700/20 bg-ink-900/40 p-5">
        <div className="font-mono text-[10px] text-gold-600/80 mb-3 tracking-wider">LEGEND</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm border border-gold-600/40 bg-gold-600/5" />
            <span className="text-stone-400">Mock — محاكاة محلية</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm border border-stone-700/50 bg-stone-800/20" />
            <span className="text-stone-400">Disabled — معطّل / ينتظر الموافقة</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-rose-400" />
            <span className="text-stone-400">مقفل — يتطلب أمراً صريحاً</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ node, index, isLast }: { node: WorkflowNode; index: number; isLast: boolean }) {
  const isDisabled = node.status === 'disabled';
  const iconColor = isDisabled ? 'text-stone-500' : typeIconColors[node.type];

  return (
    <div className="flex items-start gap-4 sm:gap-5">
      {/* Step circle */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className={`w-14 h-14 rounded-xl border flex items-center justify-center relative z-10 ${typeStyles[node.type]} ${isDisabled ? 'opacity-50' : ''}`}>
          <node.icon size={20} className={iconColor} />
        </div>
        {!isLast && (
          <div className="flex-1 w-px bg-gold-700/15 mt-1 mb-0 min-h-[16px]" />
        )}
      </div>

      {/* Card body */}
      <div className={`flex-1 rounded-xl border p-5 mb-4 transition ${typeStyles[node.type]} ${isDisabled ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-[10px] text-gold-600/70">STEP {String(index + 1).padStart(2, '0')}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                isDisabled
                  ? 'bg-stone-800/40 border-stone-700/40 text-stone-500'
                  : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
              }`}>
                {isDisabled ? 'DISABLED' : 'MOCK'}
              </span>
            </div>
            <div className="text-sm font-semibold text-stone-100">{node.titleAr}</div>
            <div className="font-mono text-[11px] text-stone-500">{node.titleEn}</div>
          </div>
          {isDisabled ? (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-300/70 shrink-0">
              <Lock size={12} />
              Locked
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300/80 shrink-0">
              <Clock size={12} />
              Mock
            </div>
          )}
        </div>
        <p className="text-xs text-stone-400 leading-6">{node.description}</p>
        {isDisabled && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-rose-300/60 font-mono">
            <Lock size={11} />
            مقفل — يتطلب أمراً صريحًا
          </div>
        )}
        {!isDisabled && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gold-600/60 font-mono">
            <CheckCircle2 size={11} />
            جاهز للتفعيل عند ربط النظام الخارجي
          </div>
        )}
      </div>

      {/* Arrow connector (desktop) */}
      {!isLast && (
        <div className="hidden sm:flex items-center pt-6 shrink-0 opacity-20">
          <ArrowLeft size={14} className="text-gold-400" />
        </div>
      )}
    </div>
  );
}
