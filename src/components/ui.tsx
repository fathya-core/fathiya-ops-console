import { ReactNode } from 'react';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-stone-200">{label}</span>
        {hint && <span className="text-[11px] font-mono text-gold-600/80">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-ink-950 border border-gold-700/20 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/10 transition"
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...props}
      className="w-full bg-ink-950 border border-gold-700/20 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/10 transition"
    >
      {props.children}
    </select>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-ink-950 border border-gold-700/20 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/10 transition resize-y min-h-[90px]"
    />
  );
}

export function SectionCard({
  title, tag, icon, children, accent = 'gold',
}: {
  title: string;
  tag?: string;
  icon?: ReactNode;
  children: ReactNode;
  accent?: 'gold' | 'amber' | 'rose' | 'slate' | 'sky' | 'emerald';
}) {
  const accentColors = {
    gold: 'text-gold-400 border-gold-600/30 bg-gold-600/5',
    sky: 'text-gold-400 border-gold-600/30 bg-gold-600/5',
    emerald: 'text-gold-300 border-gold-600/30 bg-gold-600/5',
    amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    rose: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    slate: 'text-stone-300 border-stone-700 bg-stone-800/30',
  }[accent];

  return (
    <div className="rounded-xl border border-gold-700/20 bg-ink-900/50 overflow-hidden animate-fade-up">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gold-700/10">
        <div className="flex items-center gap-2.5">
          {icon && <div className={`w-7 h-7 rounded-md border flex items-center justify-center ${accentColors}`}>{icon}</div>}
          <h3 className="text-sm font-semibold text-stone-100">{title}</h3>
        </div>
        {tag && <span className="font-mono text-[10px] tracking-[0.25em] text-gold-600/80">{tag}</span>}
      </div>
      <div className="p-5 text-sm leading-7 text-stone-300">{children}</div>
    </div>
  );
}

export function PrimaryButton({
  children, disabled, onClick, type = 'button',
}: { children: ReactNode; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:from-gold-200 hover:via-gold-300 hover:to-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold-600/20 hover:shadow-gold-400/30"
    >
      {children}
    </button>
  );
}
