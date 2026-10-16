import React from 'react';
import { Pet, PlaceLocation, SocialPost, ParkMeetup, Product, UserRewards, VetMessage } from '../types';
import { AppTab } from './Navbar';
import {
  ShieldAlert,
  Syringe,
  Stethoscope,
  MapPin,
  Users,
  ShoppingBag,
  Award,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Phone,
  Sparkles,
  Plus,
} from 'lucide-react';

interface Props {
  pet: Pet;
  places: PlaceLocation[];
  posts: SocialPost[];
  meetups: ParkMeetup[];
  products: Product[];
  rewards: UserRewards;
  vetMessages: VetMessage[];
  onSelectTab: (tab: AppTab) => void;
  onOpenSos: () => void;
  onAddPoints: (amount: number, reason: string) => void;
  onUpdatePet: (updatedPet: Pet) => void;
}

export const BentoDashboard: React.FC<Props> = ({
  pet,
  places,
  posts,
  meetups,
  products,
  rewards,
  vetMessages,
  onSelectTab,
  onOpenSos,
  onAddPoints,
  onUpdatePet,
}) => {
  // Vaccinations logic
  const pendingVaccines = pet.vaccines.filter(v => v.status === 'overdue' || v.status === 'due_soon');
  const sortedVaccines = [...pet.vaccines].sort(
    (a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
  );
  const nextVaccine = sortedVaccines[0];

  const sortedDeworming = [...pet.dewormingHistory].sort(
    (a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime()
  );
  const nextDeworming = sortedDeworming[0];

  const featuredPlace = places[0];
  const nextMeetup = meetups[0];
  const topProduct = products[0];

  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div id="bento-grid-dashboard" className="space-y-5 sm:space-y-6">
      {/* Top Welcome / Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl shrink-0 border border-indigo-100 dark:border-indigo-800">
            🐕
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
              Bento Pet System
            </span>
            <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5 truncate">
              Prontuário em tempo real • <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{pet.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('vaccines')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Adicionar Vacina</span>
          </button>

          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            <span>Ficha SOS 24h</span>
          </button>
        </div>
      </div>

      {/* Bento Grid 12-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* BENTO CARD 1: Pet Hero Profile Card (Span 8) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white p-5 sm:p-7 rounded-3xl shadow-sm border border-indigo-400/30 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
            <div className="relative shrink-0">
              <img
                src={pet.avatar}
                alt={pet.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white/90 shadow-lg"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-400 text-slate-900 p-1 rounded-xl shadow-md border-2 border-white">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/20">
                  {pet.breed}
                </span>
                <span className="text-xs font-medium bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded-lg">
                  {pet.gender === 'male' ? 'Macho' : 'Fêmea'} • {pet.neutered ? 'Castrado' : 'Não Castrado'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold font-fredoka text-white tracking-tight leading-tight mb-1 truncate">
                {pet.name}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-indigo-100 mb-4">
                {pet.ageYears} anos {pet.ageMonths > 0 ? `e ${pet.ageMonths} meses` : ''} • Prontuário digital ativo
              </p>

              {/* Stat Boxes */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white/15 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/20 text-center">
                  <span className="font-extrabold text-base sm:text-xl block text-white font-mono truncate">
                    {pet.weightKg} kg
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Peso
                  </span>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/20 text-center">
                  <span className="font-extrabold text-base sm:text-xl block text-white font-mono truncate">
                    {pet.bloodType || 'DEA 1.1+'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Sangue
                  </span>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/20 text-center">
                  <span className="font-extrabold text-base sm:text-xl block text-white font-mono truncate">
                    {pet.microchipId ? 'Ativo' : 'Não Inf.'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200">
                    Microchip
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5 text-center sm:text-left">
              <Stethoscope className="w-4 h-4 shrink-0" />
              <span>Histórico de consultas, peso e vacinas sincronizado</span>
            </span>
            <button
              onClick={() => onSelectTab('medical')}
              className="w-full sm:w-auto bg-white hover:bg-indigo-50 text-indigo-900 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Ver Prontuário Completo</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: AuCoins Balance & Wallet (Span 4) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-emerald-400/30 flex flex-col justify-between text-center relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Carteira AuCoins
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-black/20 text-white font-mono">
                Nível {rewards.tier}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black font-mono my-2 text-white tracking-tight">
              {rewards.pointsBalance}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              AuCoins Disponíveis
            </div>

            <div className="my-3 bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 text-xs font-bold flex items-center justify-center gap-1.5">
              <span>🔥</span>
              <span>{rewards.streakDays} dias de sequência ativa de cuidados!</span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('rewards')}
            className="w-full bg-white hover:bg-emerald-50 text-emerald-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-2 shadow-sm transition-all"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Resgatar Prêmios &amp; Descontos</span>
          </button>
        </div>

        {/* BENTO CARD 3: Vaccine Agenda with Alert Status (Span 4) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                Imunização
              </span>
              {pendingVaccines.length > 0 ? (
                <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono uppercase animate-pulse">
                  {pendingVaccines.length} Requer Atenção
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  Em Dia
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold font-fredoka text-slate-900 dark:text-white mb-3">
              Agenda de Vacinas
            </h3>

            {nextVaccine ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: calculateDaysLeft(nextVaccine.nextDueDate) < 0 ? '#e11d48' : '#10b981',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-800 dark:text-white truncate">
                      {nextVaccine.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Reforço: {new Date(nextVaccine.nextDueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shrink-0 ${
                    calculateDaysLeft(nextVaccine.nextDueDate) < 0
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}>
                    {calculateDaysLeft(nextVaccine.nextDueDate) < 0 ? 'Vencida' : `${calculateDaysLeft(nextVaccine.nextDueDate)}d`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-indigo-50/60 dark:bg-slate-800/60 rounded-2xl border border-dashed border-indigo-200 dark:border-slate-700 text-center py-4 mb-2.5">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Nenhuma vacina registrada ainda.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Cadastre as doses para acompanhar os alertas.
                </p>
              </div>
            )}

            {nextDeworming && (
              <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-violet-500" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-slate-800 dark:text-white truncate">
                    {nextDeworming.productName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Próxima dose: {new Date(nextDeworming.nextDueDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTab('vaccines')}
            className="w-full bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 shadow-sm transition-all"
          >
            <Syringe className="w-4 h-4 text-indigo-400" />
            <span>Gerenciar Calendário de Vacinas</span>
          </button>
        </div>

        {/* BENTO CARD 4: Urgent SOS Emergency Card (Span 4) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-gradient-to-br from-rose-500 to-red-600 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-rose-400/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                Emergência 24h
              </span>
              <span className="text-xs font-bold font-mono bg-black/20 text-white px-2 py-0.5 rounded-md">
                PLANTÃO VET
              </span>
            </div>

            <h3 className="text-lg font-bold font-fredoka text-white mb-1.5">
              Hospital Veterinário 24h
            </h3>
            <p className="text-xs font-medium text-rose-100 leading-relaxed mb-3">
              Hospital de referência para emergências do {pet.name}. Suporte imediato para o tipo sanguíneo {pet.bloodType || 'DEA 1.1+'}.
            </p>

            <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs space-y-1">
              <span className="font-bold block truncate">
                🏥 {pet.emergencyContact.clinic24h}
              </span>
              <span className="block truncate text-rose-100 font-mono">
                📞 {pet.emergencyContact.clinic24hPhone}
              </span>
            </div>
          </div>

          <button
            id="bento-open-sos-btn"
            onClick={onOpenSos}
            className="w-full bg-white hover:bg-rose-50 text-rose-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 shadow-sm transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-rose-600 stroke-[2.5]" />
            <span>Abrir Ficha de Emergência SOS</span>
          </button>
        </div>

        {/* BENTO CARD 5: Map & Pet Shops (Span 4) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                Geolocalização
              </span>
              <span className="text-xs font-bold font-mono text-slate-500">
                {places.length} locais
              </span>
            </div>

            <h3 className="text-lg font-bold font-fredoka text-slate-900 dark:text-white mb-2">
              Pet Shops &amp; Clínicas
            </h3>

            {featuredPlace && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-xs text-slate-800 dark:text-white truncate">
                    {featuredPlace.name}
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full shrink-0">
                    {featuredPlace.distanceKm} km
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">
                  {featuredPlace.neighborhood} • ⭐ {featuredPlace.rating} ({featuredPlace.reviewsCount} avaliações)
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Encontre pet shops, farmácias veterinárias, adestradores e clínicas 24h na sua região.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('map')}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Explorar Mapa Interativo</span>
          </button>
        </div>

        {/* BENTO CARD 6: Social & Park Meetups (Span 6) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                Comunidade Canina
              </span>
              <span className="text-xs font-bold font-mono text-slate-500">
                {meetups.length} encontros
              </span>
            </div>

            <h3 className="text-lg font-bold font-fredoka text-slate-900 dark:text-white mb-2">
              Passeios &amp; Encontros no Parque
            </h3>

            {nextMeetup ? (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-3">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white truncate">
                    {nextMeetup.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full shrink-0">
                    {nextMeetup.attendeesCount} cães confirmados
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  📍 {nextMeetup.parkName} • {nextMeetup.date} às {nextMeetup.time}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center py-4 mb-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Nenhum passeio agendado no momento.
                </p>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conecte-se com outros tutores da sua vizinhança e proporcione momentos divertidos de socialização.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('social')}
            className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <Users className="w-4 h-4" />
            <span>Ver Feed Social &amp; Encontros</span>
          </button>
        </div>

        {/* BENTO CARD 7: Marketplace Pet & Lojinha (Span 6) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                Lojinha Pet
              </span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                + Ganhe AuCoins
              </span>
            </div>

            <h3 className="text-lg font-bold font-fredoka text-slate-900 dark:text-white mb-2">
              Rações Premium &amp; Cuidados
            </h3>

            {topProduct && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 mb-3">
                <img
                  src={topProduct.imageUrl}
                  alt={topProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-white truncate">
                    {topProduct.name}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                      R$ {topProduct.price.toFixed(2)}
                    </span>
                    {topProduct.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        R$ {topProduct.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Produtos de nutrição e farmácia com entrega expressa e bônus em pontos na sua carteira.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('marketplace')}
            className="w-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-4 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explorar Lojinha &amp; Ofertas</span>
          </button>
        </div>

        {/* BENTO CARD 8: Plantão Vet 24h Full Width Banner (Span 12) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                AO VIVO • PLANTÃO 24H
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-fredoka text-white tracking-tight mb-1">
              Dúvidas Clínicas? Fale com o Veterinário de Plantão
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Orientações veterinárias instantâneas integradas ao histórico clínico, peso e exames do {pet.name}.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('vetChat')}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0 shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Iniciar Atendimento Agora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
