import { ChevronLeft } from 'lucide-react';
import type { View } from '../types';
import { Logo } from './Logo';

export function Header({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  return (
    <header className="border-b border-gold-700/30 bg-ink-900/80 backdrop-blur sticky top-[44px] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 sm:gap-3 group min-w-0"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-gold-500/20 blur-md rounded-full group-hover:bg-gold-400/30 transition" />
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-md bg-ink-950 border border-gold-600/40 flex items-center justify-center">
              <Logo size={20} />
            </div>
          </div>
          <div className="text-right min-w-0">
            <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-gold-400/80 truncate">FATHIYA · OPS</div>
            <div className="text-sm sm:text-base font-semibold gold-gradient-text tracking-wide truncate">المنشأة السيادية الذكية</div>
            <div className="hidden sm:block text-[10px] font-mono tracking-[0.25em] text-gold-600/70">SOVEREIGN INTELLIGENCE LAB</div>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gold-300/70">
            <span className="w-2 h-2 bg-gold-400 rounded-full pulse-dot" />
            <span className="hidden md:inline">ONLINE · DRAFT MODE</span>
            <span className="md:hidden">DRAFT</span>
          </div>
          <span className="sm:hidden w-2 h-2 bg-gold-400 rounded-full pulse-dot" />
          {view !== 'home' && (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1 sm:gap-1.5 text-xs text-gold-200/80 hover:text-gold-200 transition px-2 sm:px-3 py-1.5 rounded-md border border-gold-700/40 hover:border-gold-500/60"
            >
              <span className="hidden sm:inline">الرئيسية</span>
              <ChevronLeft size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
