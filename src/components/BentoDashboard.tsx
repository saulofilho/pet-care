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
    <div id="bento-grid-dashboard" className="space-y-5">
      {/* Bento Grid 12-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* BENTO CARD 1: Pet Identity Card (Span 4) */}
        <div className="col-span-1 md:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Perfil do Pet Ativo
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {pet.breed}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img
                  src={pet.avatar}
                  alt={pet.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/80 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {pet.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pet.ageYears} anos • {pet.gender === 'male' ? 'Macho' : 'Fêmea'} ({pet.neutered ? 'Castrado' : 'Não castrado'})
                </p>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/80 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Peso</span>
                <span className="text-sm font-black text-slate-800 dark:text-white">{pet.weightKg} kg</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Tipo Sangue</span>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">{pet.bloodType || 'DEA 1.1'}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-2xl">
                <span className="text-[10px] text-slate-400 block font-semibold">Microchip</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">Ativo</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => onSelectTab('medical')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Ver Prontuário Digital Completo</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: Vaccine & Preventative Alerts (Span 4) */}
        <div className="col-span-1 md:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5 text-emerald-600" />
                Agenda de Vacinação & Saúde
              </span>
              {pendingVaccines.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {pendingVaccines.length} Alerta(s)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Em Dia
                </span>
              )}
            </div>

            {/* Upcoming Vaccine Highlight */}
            {nextVaccine ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 mb-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{nextVaccine.name}</h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      Reforço: {new Date(nextVaccine.nextDueDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    calculateDaysLeft(nextVaccine.nextDueDate) < 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {calculateDaysLeft(nextVaccine.nextDueDate) < 0
                      ? `Atrasada ${Math.abs(calculateDaysLeft(nextVaccine.nextDueDate))}d`
                      : `em ${calculateDaysLeft(nextVaccine.nextDueDate)} dias`}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Next Deworming / Flea Protection */}
            {nextDeworming && (
              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="font-bold text-purple-900 dark:text-purple-200 block">{nextDeworming.productName}</span>
                    <span className="text-[11px] text-purple-700/80 dark:text-purple-300">
                      Próxima dose: {new Date(nextDeworming.nextDueDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onSelectTab('vaccines')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Syringe className="w-4 h-4" />
              <span>Gerenciar Vacinas & Lembretes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 3: SOS Emergency Tile (Span 4) */}
        <div className="col-span-1 md:col-span-4 rounded-3xl bg-gradient-to-br from-red-600 via-red-600 to-rose-700 text-white p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                Acesso Imediato SOS
              </span>
              <span className="text-[10px] font-bold text-rose-200 uppercase tracking-wide">
                Plantão 24 Horas
              </span>
            </div>

            <h3 className="text-xl font-black tracking-tight mb-2">
              Emergência Veterinária
            </h3>
            <p className="text-xs text-rose-100 leading-relaxed mb-4">
              Acesso em 1 clique ao hospital veterinário com UTI, tipo sanguíneo ({pet.bloodType || 'DEA 1.1'}), alergias críticas e ficha do tutor.
            </p>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 mb-2">
              <span className="text-[10px] uppercase font-bold text-rose-200 block">Hospital de Referência:</span>
              <p className="font-bold text-xs truncate text-white">{pet.emergencyContact.clinic24h}</p>
              <span className="text-[11px] text-rose-100 font-mono mt-0.5 block">
                Tel: {pet.emergencyContact.clinic24hPhone}
              </span>
            </div>
          </div>

          <div className="pt-3 relative z-10">
            <button
              id="bento-open-sos-btn"
              onClick={onOpenSos}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white text-red-700 hover:bg-rose-50 font-black text-xs shadow-lg transition-transform active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>ABRIR PRONTUÁRIO SOS AGORA</span>
            </button>
          </div>
        </div>

        {/* BENTO CARD 4: Explore Region: Map & Trainers (Span 8) */}
        <div className="col-span-1 md:col-span-8 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 p-6 flex flex-col justify-between transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                Explorar Região • Pet Shops, Vets & Adestradores
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-200">
                {places.length} locais próximos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Pet Shops & Banho</span>
                <span className="text-lg font-black text-indigo-950 dark:text-white">12 Lojas</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Rações e Farmácia</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Adestradores Pro</span>
                <span className="text-lg font-black text-indigo-950 dark:text-white">5 Treinadores</span>
                <span className="text-[10px] text-indigo-600 block mt-0.5">Comportamento canino</span>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[10px] text-slate-400 block font-semibold">Hospitais 24h</span>
                <span className="text-lg font-black text-rose-600 dark:text-rose-400">4 Plantões</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Prontos p/ emergência</span>
              </div>
            </div>

            {/* Featured place highlight card */}
            {featuredPlace && (
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{featuredPlace.name}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {featuredPlace.neighborhood} • {featuredPlace.distanceKm} km • ⭐ {featuredPlace.rating} ({featuredPlace.reviewsCount} avaliações)
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
                  {featuredPlace.isOpenNow ? 'Aberto Agora' : 'Fechado'}
                </span>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onSelectTab('map')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Abrir Mapa Interativo & Buscar Adestradores</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 5: Rewards & AuCoins (Span 4) */}
        <div className="col-span-1 md:col-span-4 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-400 to-yellow-500 text-amber-950 p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider bg-black/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-950" />
                AuCoins & Fidelidade
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-amber-950 text-amber-200">
                Nível {rewards.tier}
              </span>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-amber-900 block">Saldo Disponível:</span>
              <div className="text-3xl font-black tracking-tight text-amber-950 flex items-center gap-1.5">
                <span>{rewards.pointsBalance}</span>
                <span className="text-sm font-extrabold text-amber-900">AuCoins</span>
              </div>
            </div>

            {/* Streak & Mission */}
            <div className="bg-amber-950/10 rounded-2xl p-3.5 border border-amber-950/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Sequência Ativa:</span>
                <span className="flex items-center gap-1">🔥 {rewards.streakDays} dias seguidos</span>
              </div>
              <div className="text-[11px] text-amber-900">
                Troque seus pontos por descontos em rações, brinquedos e consultas!
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onSelectTab('rewards')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-amber-950 hover:bg-black text-amber-200 text-xs font-bold shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Ver Missões & Resgatar Prêmios</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 6: Social & Park Meetups (Span 6) */}
        <div className="col-span-1 md:col-span-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 p-6 flex flex-col justify-between transition-all hover:border-emerald-200 dark:hover:border-emerald-800">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                Encontros no Parque & Social
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200">
                {meetups.length} encontros marcados
              </span>
            </div>

            {nextMeetup && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{nextMeetup.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                    {nextMeetup.attendeesCount} cães confirmados
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{nextMeetup.parkName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{nextMeetup.date} • {nextMeetup.time}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-emerald-900/80 dark:text-emerald-300">
              Conecte-se com tutores da sua região, organize passeios em grupo e ajude na socialização do seu cão.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onSelectTab('social')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Ver Feed Social & Criar Encontro</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 7: Marketplace Showcase (Span 6) */}
        <div className="col-span-1 md:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                Marketplace de Rações & Brinquedos
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                Ganhe 1 AuCoin / R$ 1
              </span>
            </div>

            {topProduct && (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 mb-3">
                <img
                  src={topProduct.imageUrl}
                  alt={topProduct.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{topProduct.name}</h5>
                  <span className="text-xs text-slate-400 block">{topProduct.brand}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-black text-emerald-600">R$ {topProduct.price.toFixed(2)}</span>
                    {topProduct.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">R$ {topProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Produtos testados e aprovados para a raça {pet.breed}, com entrega rápida e pontos em dobro.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onSelectTab('marketplace')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>Explorar Catálogo de Produtos</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 8: Plantão Veterinário 24h (Span 12 - Full Width Banner) */}
        <div className="col-span-1 md:col-span-12 rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <MessageCircle className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  Veterinários Conectados Agora
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">
                Dúvidas sobre a saúde do {pet.name}? Fale com o Plantão 24h
              </h3>
              <p className="text-xs text-indigo-200 max-w-2xl mt-0.5">
                Orientação preliminar com triagem inteligente, integração direta ao prontuário médico e direcionamento clínico com CRMV ativo.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('vetChat')}
            className="w-full md:w-auto px-6 py-3 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs shadow-lg transition-transform active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-indigo-600" />
            <span>INICIAR CHAT DE PLANTÃO</span>
          </button>
        </div>

      </div>
    </div>
  );
};
