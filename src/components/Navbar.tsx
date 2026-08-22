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
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md transition-transform hover:scale-105">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1">
                AuAu <span className="text-emerald-600 dark:text-emerald-400">Care</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-semibold uppercase tracking-wider">
                Bento Dog Health & Care
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : tab.highlight
                      ? 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Rewards Button */}
            <button
              onClick={() => onSelectTab('rewards')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{points} AuCoins</span>
            </button>

            {/* Critical SOS button */}
            <button
              id="navbar-sos-btn"
              onClick={onOpenSos}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm transition-transform active:scale-95"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>SOS 24h</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Horizontal Scroll */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
