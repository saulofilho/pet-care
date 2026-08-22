import React, { useState } from 'react';
import { Pet } from '../types';
import { ShieldAlert, Plus, PawPrint, ChevronDown, CheckCircle2, AlertCircle, Heart, Calendar, Award } from 'lucide-react';

interface Props {
  pets: Pet[];
  activePet: Pet;
  onSelectPet: (petId: string) => void;
  onAddNewPet: (newPet: Pet) => void;
  onOpenSos: () => void;
  points: number;
  tier: string;
}

export const PetProfileHeader: React.FC<Props> = ({
  pets,
  activePet,
  onSelectPet,
  onAddNewPet,
  onOpenSos,
  points,
  tier,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('10');
  const [newPetGender, setNewPetGender] = useState<'male' | 'female'>('male');

  const pendingVaccines = activePet.vaccines.filter(v => v.status === 'overdue' || v.status === 'due_soon');
  const pendingDeworming = activePet.dewormingHistory.filter(d => d.status === 'overdue' || d.status === 'due_soon');

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim() || !newPetBreed.trim()) return;

    const created: Pet = {
      id: `pet-${Date.now()}`,
      name: newPetName.trim(),
      breed: newPetBreed.trim(),
      ageYears: 1,
      ageMonths: 0,
      birthDate: new Date().toISOString().split('T')[0],
      gender: newPetGender,
      neutered: false,
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      weightKg: parseFloat(newPetWeight) || 10,
      weightHistory: [{ date: new Date().toISOString().split('T')[0], weightKg: parseFloat(newPetWeight) || 10 }],
      emergencyContact: {
        ownerName: activePet.emergencyContact.ownerName,
        phone: activePet.emergencyContact.phone,
        primaryVetName: activePet.emergencyContact.primaryVetName,
        primaryVetPhone: activePet.emergencyContact.primaryVetPhone,
        clinic24h: activePet.emergencyContact.clinic24h,
        clinic24hPhone: activePet.emergencyContact.clinic24hPhone,
        clinic24hAddress: activePet.emergencyContact.clinic24hAddress,
      },
      allergies: [],
      chronicConditions: [],
      continuousMedications: [],
      vaccines: [
        {
          id: `vac-${Date.now()}`,
          name: 'V10 Polivalente Canina',
          type: 'essential',
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'due_soon',
        },
      ],
      dewormingHistory: [],
      consultations: [],
      exams: [],
    };

    onAddNewPet(created);
    setNewPetName('');
    setNewPetBreed('');
    setShowAddModal(false);
  };

  return (
    <div id="pet-profile-header" className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Active Pet Selector & Avatar */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={activePet.avatar}
                alt={activePet.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/80 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  id="pet-selector-dropdown-btn"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{activePet.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {activePet.breed}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>{activePet.ageYears} anos e {activePet.ageMonths} meses</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{activePet.weightKg} kg</span>
                <span>•</span>
                <span>{activePet.gender === 'male' ? 'Macho' : 'Fêmea'} ({activePet.neutered ? 'Castrado' : 'Não castrado'})</span>
              </div>

              {/* Dropdown Menu for Pets */}
              {showDropdown && (
                <div 
                  id="pet-selector-dropdown-menu"
                  className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Seus Cãezinhos
                  </div>
                  {pets.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPet(p.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors ${
                        p.id === activePet.id ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="truncate">
                        <div className="text-sm font-bold truncate">{p.name}</div>
                        <div className="text-xs text-slate-400 truncate">{p.breed}</div>
                      </div>
                      {p.id === activePet.id && <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-600 shrink-0" />}
                    </button>
                  ))}

                  <div className="border-t border-slate-100 dark:border-slate-700 my-1 pt-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowAddModal(true);
                      }}
                      className="w-full px-3 py-2 text-left flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <Plus className="w-4 h-4" />
                      Cadastrar Novo Cão
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Status Badges + SOS Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Vaccine alert tag */}
            {pendingVaccines.length > 0 ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800/80">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{pendingVaccines.length} vacina(s) pendente(s)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vacinas 100% em dia</span>
              </div>
            )}

            {/* AuCoins & Tier Chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-800 dark:text-violet-300 text-xs font-bold border border-violet-200 dark:border-violet-800">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{points} AuCoins • {tier}</span>
            </div>

            {/* Critical SOS Emergency Button */}
            <button
              id="header-sos-emergency-btn"
              onClick={onOpenSos}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-md hover:shadow-red-500/25 transition-all transform active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>SOS EMERGÊNCIA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add New Pet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cadastrar Novo Cão</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nome do Pet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luke, Belinha, Pipoca"
                  value={newPetName}
                  onChange={e => setNewPetName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Raça</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Border Collie, SRD Caramelo, Pug"
                  value={newPetBreed}
                  onChange={e => setNewPetBreed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Peso Estimado (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPetWeight}
                    onChange={e => setNewPetWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Sexo</label>
                  <select
                    value={newPetGender}
                    onChange={e => setNewPetGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Salvar e Criar Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
