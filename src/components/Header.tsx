import { ChevronLeft } from 'lucide-react';
import type { View } from '../types';
import { Logo } from './Logo';

export function Header({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  return (
    <header className="border-b border-gold-700/30 bg-ink-900/80 backdrop-blur sticky top-[44px] z-20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/20 blur-md rounded-full group-hover:bg-gold-400/30 transition" />
            <div className="relative w-12 h-12 rounded-md bg-ink-950 border border-gold-600/40 flex items-center justify-center">
              <Logo size={28} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono tracking-[0.3em] text-gold-400/80">FATHIYA · OPS</div>
            <div className="text-base font-semibold gold-gradient-text tracking-wide">المنشأة السيادية الذكية</div>
            <div className="text-[10px] font-mono tracking-[0.25em] text-gold-600/70">SOVEREIGN INTELLIGENCE LAB</div>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-gold-300/70">
            <span className="w-2 h-2 bg-gold-400 rounded-full pulse-dot" />
            <span>ONLINE · DRAFT MODE</span>
          </div>
          {view !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-xs text-gold-200/80 hover:text-gold-200 transition px-3 py-1.5 rounded-md border border-gold-700/40 hover:border-gold-500/60"
            >
              <span>الرئيسية</span>
              <ChevronLeft size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
