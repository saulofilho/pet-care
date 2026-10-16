import React, { useState } from 'react';
import { Pet } from '../types';
import { PawPrint, Heart, Sparkles, Check, Camera, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onRegisterPet: (pet: Pet) => void;
  onLoadDemoData: () => void;
}

const PRESET_AVATARS = [
  {
    name: 'Golden',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bulldog',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Vira-lata Caramelo',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Shih Tzu',
    url: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pastor / Border',
    url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Poodle / Fofinho',
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
  },
];

const POPULAR_BREEDS = [
  'SRD (Vira-lata)',
  'Golden Retriever',
  'Shih Tzu',
  'Bulldog Francês',
  'Spitz Alemão (Lulu)',
  'Yorkshire Terrier',
  'Poodle',
  'Labrador Retriever',
  'Beagle',
  'Dachshund (Teckel)',
  'Pastor Alemão',
  'Border Collie',
  'Pinscher',
  'Pug',
  'Rottweiler',
  'Pitbull / American Bully',
  'Maltês',
  'Outra Raça',
];

export const PetOnboarding: React.FC<Props> = ({ onRegisterPet, onLoadDemoData }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('SRD (Vira-lata)');
  const [customBreed, setCustomBreed] = useState('');
  const [ageYears, setAgeYears] = useState(2);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightKg, setWeightKg] = useState(12.5);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [neutered, setNeutered] = useState(true);
  const [microchipId, setMicrochipId] = useState('');
  const [bloodType, setBloodType] = useState('DEA 1.1 Positivo');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [primaryVet, setPrimaryVet] = useState('');
  const [clinic24h, setClinic24h] = useState('');
  const [clinic24hPhone, setClinic24hPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalBreed = breed === 'Outra Raça' && customBreed.trim() ? customBreed.trim() : breed;
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: name.trim(),
      breed: finalBreed,
      ageYears: Number(ageYears) || 0,
      ageMonths: Number(ageMonths) || 0,
      birthDate: new Date(Date.now() - (Number(ageYears) || 1) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      gender,
      neutered,
      avatar: finalAvatar,
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
        ownerName: ownerName.trim() || 'Tutor Responsável',
        phone: ownerPhone.trim() || '(11) 99999-9999',
        primaryVetName: primaryVet.trim() || 'Clínico Veterinário',
        primaryVetPhone: '(11) 98765-4321',
        clinic24h: clinic24h.trim() || 'Hospital Veterinário 24h',
        clinic24hPhone: clinic24hPhone.trim() || '(11) 3333-4444',
        clinic24hAddress: 'Clínica Veterinária Mais Próxima',
      },
      allergies: [],
      chronicConditions: [],
      continuousMedications: [],
      vaccines: [],
      dewormingHistory: [],
      consultations: [],
      exams: [],
    };

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onRegisterPet(newPet);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
          <PawPrint className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-fredoka tracking-tight">
            PET <span className="text-indigo-600">CARE</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Prontuário Digital &amp; Gestão de Saúde Canina</p>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-6 sm:p-8 text-white relative">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Cadastro Inicial
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-fredoka tracking-tight">
              Cadastre seu Pet no PET CARE
            </h2>
            <p className="text-sm text-indigo-100 mt-1 max-w-lg leading-relaxed">
              Preencha os dados reais do seu cãozinho para começar a gerenciar vacinas, consultas, exames e emergências 24h.
            </p>
          </div>
          <div className="absolute right-4 bottom-2 text-7xl opacity-15 select-none pointer-events-none">
            🐕
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Escolha a Foto ou Avatar do Cãozinho
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PRESET_AVATARS.map((av, idx) => {
                const isSelected = selectedAvatar === av.url && !customAvatarUrl;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setSelectedAvatar(av.url);
                      setCustomAvatarUrl('');
                    }}
                    className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="url"
                placeholder="Ou cole o link de uma foto do seu pet (URL opcional)"
                value={customAvatarUrl}
                onChange={e => setCustomAvatarUrl(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Nome do Pet *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Thor, Pipoca, Mel, Bob"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Raça *
              </label>
              <select
                value={breed}
                onChange={e => setBreed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {POPULAR_BREEDS.map(b => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {breed === 'Outra Raça' && (
                <input
                  type="text"
                  placeholder="Especifique a raça"
                  value={customBreed}
                  onChange={e => setCustomBreed(e.target.value)}
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              )}
            </div>
          </div>

          {/* Age, Weight, Gender */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Idade (Anos)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={ageYears}
                onChange={e => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-center"
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
                onChange={e => setAgeMonths(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Peso (Kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="120"
                required
                value={weightKg}
                onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Sexo
              </label>
              <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2 text-xs font-bold ${
                    gender === 'male'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Macho
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2 text-xs font-bold ${
                    gender === 'female'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Fêmea
                </button>
              </div>
            </div>
          </div>

          {/* Neutered & Microchip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">Castrado?</span>
                <span className="text-[11px] text-slate-500">Procedimento cirúrgico</span>
              </div>
              <button
                type="button"
                onClick={() => setNeutered(!neutered)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  neutered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {neutered ? 'Sim, castrado' : 'Não castrado'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Número do Microchip (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: 981020000349812"
                value={microchipId}
                onChange={e => setMicrochipId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
          </div>

          {/* Emergency & Tutor Info */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Contato do Tutor &amp; Emergência (Opcional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Seu Nome (Tutor)
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Telefone de Contato
                </label>
                <input
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={ownerPhone}
                  onChange={e => setOwnerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Cadastrar Pet &amp; Abrir Prontuário</span>
            </button>

            <button
              type="button"
              onClick={onLoadDemoData}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Carregar dados de exemplo (Demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
