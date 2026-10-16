import React from 'react';
import { LayoutGrid, Syringe, Stethoscope, MapPin, Users, ShoppingBag, Award, MessageCircle, ShieldAlert, PawPrint } from 'lucide-react';

export type AppTab =
  | 'dashboard'
  | 'vaccines'
  | 'medical'
  | 'map'
  | 'social'
  | 'marketplace'
  | 'rewards'
  | 'vetChat';

interface Props {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenSos: () => void;
  pendingAlertsCount: number;
  points: number;
  tier: string;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenSos,
  pendingAlertsCount,
  points,
  tier,
}) => {
  const tabs = [
    {
      id: 'dashboard' as AppTab,
      label: 'Visão Geral Bento',
      icon: LayoutGrid,
    },
    {
      id: 'vaccines' as AppTab,
      label: 'Vacinas & Alertas',
      icon: Syringe,
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : undefined,
    },
    {
      id: 'medical' as AppTab,
      label: 'Prontuário Digital',
      icon: Stethoscope,
    },
    {
      id: 'map' as AppTab,
      label: 'Pet Shops & Adestradores',
      icon: MapPin,
    },
    {
      id: 'social' as AppTab,
      label: 'Parques & Social',
      icon: Users,
    },
    {
      id: 'marketplace' as AppTab,
      label: 'Marketplace',
      icon: ShoppingBag,
    },
    {
      id: 'rewards' as AppTab,
      label: 'AuCoins & Prêmios',
      icon: Award,
    },
    {
      id: 'vetChat' as AppTab,
      label: 'Plantão Vet 24h',
      icon: MessageCircle,
      highlight: true,
    },
  ];

  return (
    <header className="bg-white/95 dark:bg-[#2d3436]/95 backdrop-blur-md border-b-3 border-[#2d3436] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#fab1a0] border-2 sm:border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] flex items-center justify-center text-[#2d3436] font-bold transition-transform hover:scale-105">
              <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl text-[#2d3436] dark:text-white tracking-tight flex items-center gap-1 font-fredoka leading-none">
                AUAU <span className="text-[#fab1a0]">CARE</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 block font-mono-code font-bold uppercase tracking-wider mt-0.5">
                Bento Dog System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-[#f1f2f6] dark:bg-[#1e272e] p-1.5 rounded-2xl border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436]">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative whitespace-nowrap ${
                    isActive
                      ? 'bg-[#fab1a0] text-[#2d3436] border-2 border-[#2d3436] shadow-[1px_1px_0px_#2d3436]'
                      : tab.highlight
                      ? 'text-[#2d3436] dark:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#2d3436] dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 bg-[#eb4d4b] text-white text-[10px] font-extrabold rounded-md border border-[#2d3436] animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Rewards Button */}
            <button
              onClick={() => onSelectTab('rewards')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-[#55efc4] text-[#2d3436] rounded-xl text-xs font-bold border-2 sm:border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] hover:translate-y-[-1px] transition-transform"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2d3436] stroke-[2.5]" />
              <span className="font-mono-code font-bold text-[11px] sm:text-xs">{points} <span className="hidden sm:inline">AuCoins</span></span>
            </button>

            {/* Critical SOS button */}
            <button
              id="navbar-sos-btn"
              onClick={onOpenSos}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#eb4d4b] hover:bg-[#d63031] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border-2 sm:border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span className="whitespace-nowrap font-bold">SOS<span className="hidden sm:inline"> EMERGÊNCIA</span></span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Horizontal Scroll */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t-2 border-[#2d3436] no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 border-[#2d3436] shrink-0 ${
                  isActive
                    ? 'bg-[#fab1a0] text-[#2d3436] shadow-[2px_2px_0px_#2d3436]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-[#eb4d4b]"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
