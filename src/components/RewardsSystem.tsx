import React, { useState } from 'react';
import { UserRewards, RewardCoupon, Mission } from '../types';
import { Award, Gift, Sparkles, CheckCircle2, Zap, Trophy, Tag, Copy, Check, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  rewards: UserRewards;
  coupons: RewardCoupon[];
  missions: Mission[];
  onSaveRewards: (rewards: UserRewards) => void;
  onSaveMissions: (missions: Mission[]) => void;
  onAddPoints: (amount: number, reason: string) => void;
}

export const RewardsSystem: React.FC<Props> = ({
  rewards,
  coupons,
  missions,
  onSaveRewards,
  onSaveMissions,
  onAddPoints,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleRedeemCoupon = (coupon: RewardCoupon) => {
    if (rewards.pointsBalance < coupon.pointsCost) {
      alert(`Você precisa de ${coupon.pointsCost} AuCoins para resgatar este benefício. Seu saldo atual é ${rewards.pointsBalance}.`);
      return;
    }

    const updatedRewards: UserRewards = {
      ...rewards,
      pointsBalance: rewards.pointsBalance - coupon.pointsCost,
      redeemedCoupons: [
        {
          couponId: coupon.id,
          code: coupon.code,
          title: coupon.title,
          redeemedAt: new Date().toLocaleDateString('pt-BR'),
        },
        ...rewards.redeemedCoupons,
      ],
    };

    onSaveRewards(updatedRewards);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleCompleteMission = (mission: Mission) => {
    if (mission.isCompleted) return;

    const updatedMissions = missions.map(m =>
      m.id === mission.id ? { ...m, isCompleted: true } : m
    );
    onSaveMissions(updatedMissions);
    onAddPoints(mission.points, `Missão concluída: ${mission.title}`);
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Diamante':
        return 'from-cyan-500 to-blue-600';
      case 'Ouro':
        return 'from-amber-400 to-yellow-600';
      case 'Prata':
        return 'from-slate-300 to-slate-500';
      case 'Bronze':
      default:
        return 'from-amber-700 to-orange-800';
    }
  };

  return (
    <div id="rewards-system-container" className="space-y-6">
      {/* Gamification Level & Streak Card */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div 
          className="absolute right-0 bottom-0 opacity-10 pointer-events-none"
          style={{ transform: 'scale(2.5)' }}
        >
          <Trophy className="w-32 h-32 text-amber-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${getTierBadgeColor(rewards.tier)} text-white shadow-sm flex items-center gap-1.5`}>
                <Award className="w-4 h-4" />
                Nível {rewards.tier}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {rewards.streakDays} dias de ofensiva
              </span>
            </div>

            <h2 className="text-3xl font-black">{rewards.pointsBalance} <span className="text-xl font-bold text-violet-200">AuCoins</span></h2>
            <p className="text-xs text-violet-200 max-w-md">
              Você já acumulou um total de {rewards.totalPointsEarned} pontos na sua jornada de cuidados caninos.
            </p>
          </div>

          {/* Tier Progress Bar */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 min-w-[280px] space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-violet-200">Progresso para o próximo nível</span>
              <span className="text-amber-300">{rewards.tierProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${rewards.tierProgress}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-violet-300 block text-right">
              Faltam poucos pontos para desbloquear cupons Diamante
            </span>
          </div>
        </div>
      </div>

      {/* Daily Missions */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Missões & Conquistas Caninas</h3>
          </div>
          <span className="text-xs text-slate-500">Acumule pontos cuidando do seu pet</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {missions.map(mission => (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                mission.isCompleted
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold text-xs sm:text-sm ${mission.isCompleted ? 'text-emerald-900 dark:text-emerald-300 line-through' : 'text-slate-900 dark:text-white'}`}>
                    {mission.title}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                    +{mission.points} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{mission.description}</p>
              </div>

              <button
                onClick={() => handleCompleteMission(mission)}
                disabled={mission.isCompleted}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  mission.isCompleted
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800'
                }`}
              >
                {mission.isCompleted ? 'Concluída ✅' : 'Completar'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog & Redeemable Coupons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Resgatar Benefícios & Cupons</h3>
          </div>
          <span className="text-xs text-slate-500">Troque seus AuCoins por descontos reais</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map(coupon => {
            const canAfford = rewards.pointsBalance >= coupon.pointsCost;

            return (
              <div
                key={coupon.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {coupon.category === 'shop' ? 'Marketplace' : coupon.category === 'bath' ? 'Pet Shop' : coupon.category === 'trainer' ? 'Adestrador' : 'Clínica Vet'}
                    </span>
                    <span className="text-xs font-black text-violet-700 dark:text-violet-400">
                      {coupon.pointsCost} pts
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{coupon.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{coupon.discountDescription}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleRedeemCoupon(coupon)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                      canAfford
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Resgatar Cupom' : `Faltam ${coupon.pointsCost - rewards.pointsBalance} pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Wallet of Redeemed Coupons */}
      {rewards.redeemedCoupons.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Meus Cupons Resgatados & Prontos para Uso</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rewards.redeemedCoupons.map((rc, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-between gap-3 shadow-xs"
              >
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rc.title}</h5>
                  <span className="text-[10px] text-slate-400">Resgatado em {rc.redeemedAt}</span>
                </div>

                <button
                  onClick={() => handleCopyCode(rc.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-xs font-mono font-bold hover:opacity-90 transition-opacity"
                >
                  {copiedCode === rc.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{rc.code}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
