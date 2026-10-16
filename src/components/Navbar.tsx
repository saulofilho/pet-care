import React, { useState, useRef, useEffect } from 'react';
import { Pet } from '../types';
import {
  LayoutGrid,
  Syringe,
  Stethoscope,
  MapPin,
  Users,
  ShoppingBag,
  Award,
  MessageCircle,
  ShieldAlert,
  PawPrint,
  ChevronDown,
  Plus,
  Trash2,
  Menu,
  X,
  CheckCircle2,
} from 'lucide-react';

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
  pets: Pet[];
  activePet: Pet | null;
  onSelectPet: (petId: string) => void;
  onOpenAddPet: () => void;
  onClearData: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onOpenSos,
  pendingAlertsCount,
  points,
  tier,
  pets,
  activePet,
  onSelectPet,
  onOpenAddPet,
  onClearData,
}) => {
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPetDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryTabs = [
    {
      id: 'dashboard' as AppTab,
      label: 'Visão Geral',
      icon: LayoutGrid,
    },
    {
      id: 'vaccines' as AppTab,
      label: 'Vacinas',
      icon: Syringe,
      badge: pendingAlertsCount > 0 ? pendingAlertsCount : undefined,
    },
    {
      id: 'medical' as AppTab,
      label: 'Prontuário',
      icon: Stethoscope,
    },
    {
      id: 'map' as AppTab,
      label: 'Mapa Pet',
      icon: MapPin,
    },
    {
      id: 'social' as AppTab,
      label: 'Parques',
      icon: Users,
    },
    {
      id: 'marketplace' as AppTab,
      label: 'Lojinha',
      icon: ShoppingBag,
    },
    {
      id: 'vetChat' as AppTab,
      label: 'Plantão 24h',
      icon: MessageCircle,
      highlight: true,
    },
  ];

  const handleTabClick = (tabId: AppTab) => {
    onSelectTab(tabId);
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Top Header - Single Row, Clean & Fixed */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo Brand */}
            <div
              className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
              onClick={() => handleTabClick('dashboard')}
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105">
                <PawPrint className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight flex items-center gap-1 font-fredoka leading-none">
                  PET <span className="text-indigo-600">CARE</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-0.5">
                  Prontuário &amp; Saúde Canina
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Large Screens >= lg) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              {primaryTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative whitespace-nowrap ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Pet Switcher Dropdown (when pet exists) */}
              {activePet && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowPetDropdown(!showPetDropdown)}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <img
                      src={activePet.avatar}
                      alt={activePet.name}
                      className="w-7 h-7 rounded-xl object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                    />
                    <div className="text-left hidden sm:block max-w-[90px] truncate">
                      <span className="font-bold text-xs text-slate-900 dark:text-white block leading-tight truncate">
                        {activePet.name}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {activePet.breed}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showPetDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Meus Cães Cadastrados
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {pets.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              onSelectPet(p.id);
                              setShowPetDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                              p.id === activePet.id
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-lg object-cover" />
                              <span className="truncate">{p.name}</span>
                            </div>
                            {p.id === activePet.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                          </button>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-700/80 my-1 pt-1">
                        <button
                          onClick={() => {
                            setShowPetDropdown(false);
                            onOpenAddPet();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Cadastrar Novo Cão</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowPetDropdown(false);
                            if (window.confirm('Deseja realmente limpar todos os dados e começar do zero?')) {
                              onClearData();
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Limpar dados / Começar do zero</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rewards Points Pill */}
              <button
                onClick={() => handleTabClick('rewards')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-2xl text-xs font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100/80 transition-colors"
                title="Programa de Recompensas AuCoins"
              >
                <Award className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{points} <span className="hidden md:inline font-mono">AuCoins</span></span>
              </button>

              {/* SOS Emergency button */}
              <button
                id="navbar-sos-btn"
                onClick={onOpenSos}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
                <span className="font-bold">SOS<span className="hidden sm:inline"> 24H</span></span>
              </button>

              {/* Mobile Drawer Toggle (Screens < lg) */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                aria-label="Abrir menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Slide-Over) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col p-5 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <PawPrint className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white font-fredoka">
                  PET <span className="text-indigo-600">CARE</span>
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pet Info Card in Drawer */}
            {activePet && (
              <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={activePet.avatar}
                    alt={activePet.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                  />
                  <div className="truncate">
                    <span className="font-bold text-sm block truncate text-slate-900 dark:text-white">
                      {activePet.name}
                    </span>
                    <span className="text-xs text-slate-500 block truncate">
                      {activePet.breed} • {activePet.weightKg}kg
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenAddPet();
                  }}
                  className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  title="Cadastrar outro cão"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1.5 flex-1 py-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                Navegação
              </div>
              {primaryTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => handleTabClick('rewards')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  currentTab === 'rewards'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>AuCoins &amp; Prêmios</span>
                </div>
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                  {points} pts
                </span>
              </button>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  onOpenSos();
                }}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Emergência 24h (SOS)</span>
              </button>

              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  if (window.confirm('Deseja realmente limpar todos os dados e começar do zero?')) {
                    onClearData();
                  }
                }}
                className="w-full py-2 px-3 text-slate-500 hover:text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar dados de teste</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Screens < lg) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Início</span>
        </button>

        <button
          onClick={() => handleTabClick('vaccines')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors relative ${
            currentTab === 'vaccines'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            <Syringe className="w-4 h-4" />
            {pendingAlertsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.1 bg-rose-500 text-white text-[9px] font-black rounded-full animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </div>
          <span>Vacinas</span>
        </button>

        <button
          onClick={() => handleTabClick('medical')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentTab === 'medical'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Prontuário</span>
        </button>

        <button
          onClick={() => handleTabClick('map')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold transition-colors ${
            currentTab === 'map'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Mapa</span>
        </button>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};
