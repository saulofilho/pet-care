import React from 'react';
import { Pet, PlaceLocation, SocialPost, ParkMeetup, Product, UserRewards, VetMessage } from '../types';
import { AppTab } from './Navbar';
import {
  Sparkles,
  ShieldAlert,
  Syringe,
  Bug,
  Stethoscope,
  MapPin,
  Users,
  ShoppingBag,
  Award,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Phone,
  Compass,
  Star,
  Activity,
  Heart,
  Calendar,
  Zap,
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
  onUpdatePet: (pet: Pet) => void;
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
  const pendingVaccines = pet.vaccines.filter(v => v.status === 'overdue' || v.status === 'due_soon');
  const nextVaccine = pet.vaccines[0];
  const nextDeworming = pet.dewormingHistory[0];
  const nextMeetup = meetups[0];
  const topProduct = products[0];
  const featuredPlace = places[0];

  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div id="bento-grid-dashboard" className="space-y-6">
      {/* Top Welcome / Header Bar from Variation 12 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#2d3436] p-4 rounded-3xl border-3 border-[#2d3436] shadow-[4px_4px_0px_#2d3436]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#74b9ff] border-2 border-[#2d3436] flex items-center justify-center font-bold text-lg">
            🐕
          </div>
          <div>
            <span className="neo-tag">Bento Dog System v2.0</span>
            <p className="text-xs sm:text-sm font-bold text-[#2d3436] dark:text-white mt-0.5">
              Bem-vindo de volta! Monitoramento em tempo real do {pet.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 bg-[#eb4d4b] hover:bg-[#d63031] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
            <span>🚨 SOS EMERGÊNCIA</span>
          </button>
        </div>
      </div>

      {/* Bento Grid 12-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* BENTO CARD 1: Pet Hero Profile Card (Span 8 - from Variation 12) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 neo-bento-card bg-[#74b9ff] text-[#2d3436] p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={pet.avatar}
                alt={pet.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-[#2d3436] shadow-[4px_4px_0px_#2d3436] -rotate-3 transition-transform hover:rotate-0"
              />
              <span className="absolute -bottom-2 -right-2 bg-[#55efc4] text-[#2d3436] p-1 rounded-xl border-2 border-[#2d3436] shadow-[1px_1px_0px_#2d3436]">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="neo-tag">{pet.breed}</span>
                <span className="text-xs font-bold font-mono-code bg-white/80 px-2 py-0.5 rounded-lg border border-[#2d3436]">
                  {pet.gender === 'male' ? 'Macho' : 'Fêmea'} • {pet.neutered ? 'Castrado' : 'Não Castrado'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-fredoka text-[#2d3436] tracking-tight leading-none mb-1">
                {pet.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#2d3436]/80 mb-3 sm:mb-4">
                {pet.ageYears} anos • Microchip Ativo • Vacinas sob monitoramento
              </p>

              {/* Stat Boxes 3-column grid from Variation 12 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <div className="bg-white p-2 sm:p-2.5 rounded-2xl border-2 sm:border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] text-center">
                  <span className="font-bold text-sm sm:text-lg block text-[#2d3436] font-mono-code truncate">{pet.weightKg}kg</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">Peso</span>
                </div>
                <div className="bg-[#fab1a0] p-2 sm:p-2.5 rounded-2xl border-2 sm:border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] text-center">
                  <span className="font-bold text-sm sm:text-lg block text-[#2d3436] font-mono-code truncate">{pet.bloodType || 'DEA 1.1+'}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#2d3436]/80">Sangue</span>
                </div>
                <div className="bg-white p-2 sm:p-2.5 rounded-2xl border-2 sm:border-3 border-[#2d3436] shadow-[2px_2px_0px_#2d3436] text-center">
                  <span className="font-bold text-sm sm:text-lg block text-[#2d3436] font-mono-code truncate">Ativo</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">Microchip</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t-2 border-[#2d3436]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#2d3436]/90 flex items-center gap-1.5 text-center sm:text-left">
              <Stethoscope className="w-4 h-4 stroke-[2.5] shrink-0" />
              <span>Prontuário sincronizado com consultas e exames</span>
            </span>
            <button
              onClick={() => onSelectTab('medical')}
              className="w-full sm:w-auto neo-btn bg-white hover:bg-slate-50 text-[#2d3436] px-4 py-2 text-xs flex items-center justify-center gap-2"
            >
              <span>Ver Prontuário Digital</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: AuCoins Balance & Wallet (Span 4 - from Variation 12) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 neo-bento-card bg-[#55efc4] text-[#2d3436] p-5 sm:p-6 flex flex-col justify-between text-center relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="neo-tag bg-white text-[#2d3436]">Carteira AuCoins</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#2d3436] text-[#55efc4] font-mono-code">
                Nível {rewards.tier}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-black font-mono-code my-1 sm:my-2 text-[#2d3436] tracking-tight">
              {rewards.pointsBalance}
            </div>
            <div className="text-xs sm:text-sm font-bold text-[#2d3436]/80 uppercase tracking-wide">
              AuCoins Disponíveis
            </div>

            <div className="my-3 bg-white/70 p-2.5 rounded-2xl border-2 border-[#2d3436] text-xs font-bold text-[#2d3436] flex items-center justify-center gap-1.5">
              <span>🔥</span>
              <span>{rewards.streakDays} dias de sequência ativa!</span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('rewards')}
            className="w-full neo-btn bg-white hover:bg-slate-50 text-[#2d3436] py-2.5 sm:py-3 text-xs flex items-center justify-center gap-2 mt-2"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Resgatar Pontos & Ver Prêmios</span>
          </button>
        </div>

        {/* BENTO CARD 3: Vaccine Agenda with Alert Status (Span 4 - from Variation 12) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 neo-bento-card bg-white dark:bg-[#2d3436] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="neo-tag">Saúde</span>
              {pendingVaccines.length > 0 ? (
                <span className="text-xs font-black text-[#eb4d4b] font-mono-code uppercase animate-pulse">
                  Atenção: Atrasada!
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 font-mono-code">
                  Tudo em dia
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-fredoka text-[#2d3436] dark:text-white mb-3">
              Agenda de Vacinas
            </h3>

            {/* List item styled in Neo-brutalist border style from Variation 12 */}
            {nextVaccine ? (
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-[#f8f9fa] dark:bg-slate-800 rounded-2xl border-2 border-[#2d3436] mb-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-[#2d3436]"
                  style={{
                    backgroundColor: calculateDaysLeft(nextVaccine.nextDueDate) < 0 ? '#eb4d4b' : '#55efc4',
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#2d3436] dark:text-white truncate">
                    {nextVaccine.name}
                  </div>
                  <div className="text-[11px] font-mono-code text-slate-500 dark:text-slate-400">
                    Reforço: {new Date(nextVaccine.nextDueDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <span className="text-[10px] font-bold font-mono-code px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-[#2d3436] shrink-0">
                  {calculateDaysLeft(nextVaccine.nextDueDate) < 0 ? 'Vencida' : `${calculateDaysLeft(nextVaccine.nextDueDate)}d`}
                </span>
              </div>
            ) : null}

            {nextDeworming && (
              <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-[#f8f9fa] dark:bg-slate-800 rounded-2xl border-2 border-[#2d3436] text-xs">
                <div className="w-3.5 h-3.5 rounded-full shrink-0 bg-[#a29bfe] border border-[#2d3436]" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#2d3436] dark:text-white truncate">
                    {nextDeworming.productName}
                  </div>
                  <div className="text-[11px] font-mono-code text-slate-500 dark:text-slate-400">
                    Próxima dose: {new Date(nextDeworming.nextDueDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onSelectTab('vaccines')}
            className="w-full neo-btn bg-[#2d3436] hover:bg-black text-white py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
          >
            <Syringe className="w-4 h-4 text-[#fab1a0]" />
            <span>Abrir Calendário de Vacinas</span>
          </button>
        </div>

        {/* BENTO CARD 4: Urgent SOS Emergency Card (Span 4 - from Variation 12 urgent-card) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 neo-bento-card bg-[#fd79a8] text-[#2d3436] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="neo-tag bg-white text-[#eb4d4b]">Alerta SOS</span>
              <span className="text-xs font-bold font-mono-code bg-[#2d3436] text-white px-2 py-0.5 rounded-md">
                24 HORAS
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-fredoka text-[#2d3436] mb-2">
              Emergência 24h
            </h3>
            <p className="text-xs font-medium text-[#2d3436]/90 leading-relaxed mb-3">
              O Hospital {pet.emergencyContact.clinic24h} possui o prontuário do {pet.name} e suporte imediato para {pet.bloodType || 'DEA 1.1 Positivo'}.
            </p>

            <div className="bg-white/80 p-2.5 rounded-2xl border-2 border-[#2d3436] text-xs space-y-1">
              <span className="font-bold block truncate">📞 {pet.emergencyContact.clinic24hPhone}</span>
              <span className="text-[11px] text-slate-600 block truncate">📍 {pet.emergencyContact.clinic24hAddress}</span>
            </div>
          </div>

          <button
            id="bento-open-sos-btn"
            onClick={onOpenSos}
            className="w-full neo-btn bg-white hover:bg-slate-50 text-[#2d3436] py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
          >
            <ShieldAlert className="w-4 h-4 text-[#eb4d4b] stroke-[2.5]" />
            <span>Ficha SOS Completa</span>
          </button>
        </div>

        {/* BENTO CARD 5: Map & Pet Shops (Span 4 - from Variation 12 green card) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 neo-bento-card bg-[#55efc4] text-[#2d3436] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="neo-tag bg-white text-[#2d3436]">Mapa</span>
              <span className="text-xs font-bold font-mono-code">
                {places.length} locais
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-fredoka text-[#2d3436] mb-3">
              Pet Shops & Adestradores
            </h3>

            {featuredPlace && (
              <div className="p-3 bg-white rounded-2xl border-2 border-[#2d3436] mb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-xs truncate">{featuredPlace.name}</div>
                  <span className="text-[10px] font-mono-code font-bold bg-[#74b9ff] text-[#2d3436] px-1.5 py-0.5 rounded border border-[#2d3436] shrink-0">
                    {featuredPlace.distanceKm}km
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 truncate">
                  {featuredPlace.neighborhood} • ⭐ {featuredPlace.rating} ({featuredPlace.reviewsCount})
                </div>
              </div>
            )}

            <div className="text-xs font-semibold text-[#2d3436]/80">
              Encontre clínicas 24h, adestradores certificados e parques pet friendly na sua região.
            </div>
          </div>

          <button
            onClick={() => onSelectTab('map')}
            className="w-full neo-btn bg-[#2d3436] hover:bg-black text-white py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
          >
            <MapPin className="w-4 h-4 text-[#55efc4]" />
            <span>Ver Mapa Interativo</span>
          </button>
        </div>

        {/* BENTO CARD 6: Social & Park Meetups (Span 6) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 neo-bento-card bg-white dark:bg-[#2d3436] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="neo-tag">Parques & Social</span>
              <span className="text-xs font-bold font-mono-code text-slate-500">
                {meetups.length} encontros
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-fredoka text-[#2d3436] dark:text-white mb-2">
              Encontros de Cães no Parque
            </h3>

            {nextMeetup && (
              <div className="p-3 sm:p-3.5 bg-[#f8f9fa] dark:bg-slate-800 rounded-2xl border-2 border-[#2d3436] mb-3">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <h4 className="font-bold text-xs text-[#2d3436] dark:text-white truncate">{nextMeetup.title}</h4>
                  <span className="text-[10px] font-mono-code font-bold bg-[#55efc4] text-[#2d3436] px-1.5 py-0.5 rounded border border-[#2d3436] shrink-0">
                    {nextMeetup.attendeesCount} cães
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  📍 {nextMeetup.parkName} • {nextMeetup.date} às {nextMeetup.time}
                </p>
              </div>
            )}

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Marque passeios coletivos com tutores da região e estimule a socialização saudável do {pet.name}.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('social')}
            className="w-full neo-btn bg-[#74b9ff] hover:bg-[#68a7e8] text-[#2d3436] py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
          >
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span>Ver Feed Social & Organizar Encontro</span>
          </button>
        </div>

        {/* BENTO CARD 7: Marketplace Pet & Lojinha (Span 6) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-6 neo-bento-card bg-white dark:bg-[#2d3436] p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="neo-tag">Lojinha Pet</span>
              <span className="text-xs font-bold font-mono-code text-emerald-600 dark:text-emerald-400">
                Ganhe AuCoins
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-fredoka text-[#2d3436] dark:text-white mb-2">
              Marketplace de Rações & Brinquedos
            </h3>

            {topProduct && (
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] dark:bg-slate-800 rounded-2xl border-2 border-[#2d3436] mb-3">
                <img
                  src={topProduct.imageUrl}
                  alt={topProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-[#2d3436] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-[#2d3436] dark:text-white truncate">{topProduct.name}</h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black font-mono-code text-[#2d3436] dark:text-white">
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

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Produtos com entrega rápida e pontos AuCoins creditados automaticamente na sua carteira.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('marketplace')}
            className="w-full neo-btn bg-[#fab1a0] hover:bg-[#f79f8c] text-[#2d3436] py-2.5 text-xs flex items-center justify-center gap-2 mt-4"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>Explorar Lojinha & Rações</span>
          </button>
        </div>

        {/* BENTO CARD 8: Plantão Vet 24h Full Width Banner (Span 12 - from Variation 12 bottom card) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 neo-bento-card bg-[#2d3436] text-white p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#55efc4] border border-white"></div>
              <span className="neo-tag bg-[#55efc4] text-[#2d3436]">AO VIVO</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-fredoka text-white tracking-tight mb-1">
              Dúvidas Clínicas? Plantão Vet 24h
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Fale agora com veterinários reais e integrados ao prontuário médico e histórico de exames do {pet.name}.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('vetChat')}
            className="w-full md:w-auto neo-btn bg-[#fd79a8] hover:bg-[#e056fd] text-[#2d3436] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2.5 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>Iniciar Chat Agora</span>
          </button>
        </div>

      </div>
    </div>
  );
};
