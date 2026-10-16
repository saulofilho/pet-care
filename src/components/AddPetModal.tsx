import React, { useState } from 'react';
import { Pet } from '../types';
import { X, PawPrint, Check, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Pet) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
];

export const AddPetModal: React.FC<Props> = ({ isOpen, onClose, onAddPet }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('SRD (Vira-lata)');
  const [ageYears, setAgeYears] = useState(2);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightKg, setWeightKg] = useState(12);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [neutered, setNeutered] = useState(true);
  const [microchipId, setMicrochipId] = useState('');
  const [bloodType, setBloodType] = useState('DEA 1.1 Positivo');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      breed: breed.trim(),
      ageYears: Number(ageYears) || 0,
      ageMonths: Number(ageMonths) || 0,
      birthDate: new Date(Date.now() - (Number(ageYears) || 1) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      gender,
      neutered,
      avatar,
      weightKg: Number(weightKg) || 10,
      weightHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          weightKg: Number(weightKg) || 10,
        },
      ],
      microchipId: microchipId.trim() || undefined,
      bloodType: bloodType || 'DEA 1.1 Positivo',
      emergencyContact: {
        ownerName: 'Tutor Responsável',
        phone: '(11) 99999-9999',
        primaryVetName: 'Clínico Geral',
        primaryVetPhone: '(11) 98765-4321',
        clinic24h: 'Hospital Veterinário 24h',
        clinic24hPhone: '(11) 3333-4444',
        clinic24hAddress: 'Clínica Mais Próxima',
      },
      allergies: [],
      chronicConditions: [],
      continuousMedications: [],
      vaccines: [],
      dewormingHistory: [],
      consultations: [],
      exams: [],
    };

    onAddPet(newPet);
    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white font-fredoka text-lg">
                Cadastrar Novo Pet
              </h3>
              <p className="text-xs text-slate-500">Adicione outro cãozinho à sua conta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
              Escolha a Foto
            </label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(av)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 ${
                    avatar === av ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                  {avatar === av && (
                    <span className="absolute top-0.5 right-0.5 bg-indigo-600 text-white rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Nome do Cão *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Luna, Rex, Toby"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Raça
              </label>
              <input
                type="text"
                required
                value={breed}
                onChange={e => setBreed(e.target.value)}
                placeholder="Ex: Golden, SRD"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Peso (Kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                required
                value={weightKg}
                onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Anos
              </label>
              <input
                type="number"
                min="0"
                value={ageYears}
                onChange={e => setAgeYears(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Meses
              </label>
              <input
                type="number"
                min="0"
                max="11"
                value={ageMonths}
                onChange={e => setAgeMonths(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Sexo
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="male">Macho</option>
                <option value="female">Fêmea</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
            >
              Salvar Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
