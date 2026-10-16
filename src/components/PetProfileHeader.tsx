import React, { useState } from 'react';
import { Pet } from '../types';
import { ShieldAlert, Plus, ChevronDown, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { AddPetModal } from './AddPetModal';

interface Props {
  pets: Pet[];
  activePet: Pet;
  onSelectPet: (petId: string) => void;
  onAddNewPet: (newPet: Pet) => void;
  onOpenSos: () => void;
  onClearData?: () => void;
  points: number;
  tier: string;
}

export const PetProfileHeader: React.FC<Props> = ({
  pets,
  activePet,
  onSelectPet,
  onAddNewPet,
  onOpenSos,
  onClearData,
  points,
  tier,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const pendingVaccines = activePet.vaccines.filter(v => v.status === 'overdue' || v.status === 'due_soon');

  return (
    <div id="pet-profile-header" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Active Pet Selector & Avatar */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={activePet.avatar}
              alt={activePet.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-100 dark:border-slate-700 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>

          <div className="relative min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="pet-selector-dropdown-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 font-bold font-fredoka text-xl sm:text-2xl text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span className="truncate">{activePet.name}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 stroke-[2.5] shrink-0" />
              </button>

              <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200/60 dark:border-indigo-800">
                {activePet.breed}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              <span>{activePet.ageYears} anos {activePet.ageMonths > 0 ? `e ${activePet.ageMonths}m` : ''}</span>
              <span>•</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{activePet.weightKg} kg</span>
              <span>•</span>
              <span>{activePet.gender === 'male' ? 'Macho' : 'Fêmea'}</span>
              <span>•</span>
              <span>{activePet.neutered ? 'Castrado' : 'Não castrado'}</span>
              {activePet.microchipId && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    Chip: {activePet.microchipId}
                  </span>
                </>
              )}
            </div>

            {/* Dropdown Menu for Pets */}
            {showDropdown && (
              <div
                id="pet-selector-dropdown-menu"
                className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Meus Cãezinhos
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {pets.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPet(p.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2 flex items-center justify-between text-xs transition-colors ${
                        p.id === activePet.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                        <div className="truncate text-left">
                          <div className="font-bold truncate">{p.name}</div>
                          <div className="text-[11px] text-slate-400 truncate">{p.breed}</div>
                        </div>
                      </div>
                      {p.id === activePet.id && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700/80 my-1 pt-1 px-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      setShowAddModal(true);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Outro Cão</span>
                  </button>

                  {onClearData && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        if (window.confirm('Deseja realmente limpar todos os dados e começar do zero?')) {
                          onClearData();
                        }
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Limpar dados de teste</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Health Status & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {pendingVaccines.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
              <span>{pendingVaccines.length} vacina(s) requer atenção</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Vacinas em dia</span>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Cão</span>
          </button>
        </div>
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPet={onAddNewPet}
      />
    </div>
  );
};
