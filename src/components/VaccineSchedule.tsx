import React, { useState } from 'react';
import { Pet, Vaccine, Deworming } from '../types';
import { Calendar, CheckCircle2, AlertTriangle, Clock, Plus, ShieldCheck, Bug, Syringe, Sparkles, FileText, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  pet: Pet;
  onUpdatePet: (updatedPet: Pet) => void;
  onAddPoints: (amount: number, reason: string) => void;
}

export const VaccineSchedule: React.FC<Props> = ({ pet, onUpdatePet, onAddPoints }) => {
  const [activeTab, setActiveTab] = useState<'vaccines' | 'deworming'>('vaccines');
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showAddDewormingModal, setShowAddDewormingModal] = useState(false);

  // Add Vaccine Form State
  const [vacName, setVacName] = useState('V10 Polivalente Canina');
  const [vacType, setVacType] = useState<'essential' | 'recommended' | 'optional'>('essential');
  const [vacDateAdministered, setVacDateAdministered] = useState(new Date().toISOString().split('T')[0]);
  const [vacNextDueDate, setVacNextDueDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [vacBatch, setVacBatch] = useState('');
  const [vacVet, setVacVet] = useState('Dra. Mariana Prado');
  const [vacClinic, setVacClinic] = useState('Clínica VetCare');

  // Add Deworming Form State
  const [dewProduct, setDewProduct] = useState('Bravecto Comprimido Mastigável');
  const [dewType, setDewType] = useState<'dewormer' | 'flea_tick' | 'all_in_one'>('flea_tick');
  const [dewDateAdministered, setDewDateAdministered] = useState(new Date().toISOString().split('T')[0]);
  const [dewFrequency, setDewFrequency] = useState(3);

  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleApplyDose = (vaccineId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const nextYearStr = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updatedVaccines = pet.vaccines.map(v => {
      if (v.id === vaccineId) {
        return {
          ...v,
          dateAdministered: todayStr,
          nextDueDate: nextYearStr,
          status: 'up_to_date' as const,
        };
      }
      return v;
    });

    const updated = { ...pet, vaccines: updatedVaccines };
    onUpdatePet(updated);
    onAddPoints(100, 'Vacina registrada no prontuário');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const handleSaveNewVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    const days = calculateDaysLeft(vacNextDueDate);
    let status: 'up_to_date' | 'due_soon' | 'overdue' = 'up_to_date';
    if (days < 0) status = 'overdue';
    else if (days <= 30) status = 'due_soon';

    const newVac: Vaccine = {
      id: `vac-${Date.now()}`,
      name: vacName,
      type: vacType,
      dateAdministered: vacDateAdministered,
      nextDueDate: vacNextDueDate,
      status,
      batchNumber: vacBatch || `LOTE-${Math.floor(10000 + Math.random() * 90000)}`,
      administeredBy: vacVet,
      clinic: vacClinic,
    };

    const updated = { ...pet, vaccines: [newVac, ...pet.vaccines] };
    onUpdatePet(updated);
    onAddPoints(150, 'Nova vacina cadastrada');
    setShowAddVaccineModal(false);
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleSaveNewDeworming = (e: React.FormEvent) => {
    e.preventDefault();
    const adminDate = new Date(dewDateAdministered);
    const nextDate = new Date(adminDate);
    nextDate.setMonth(nextDate.getMonth() + dewFrequency);
    const nextDueDateStr = nextDate.toISOString().split('T')[0];

    const days = calculateDaysLeft(nextDueDateStr);
    let status: 'up_to_date' | 'due_soon' | 'overdue' = 'up_to_date';
    if (days < 0) status = 'overdue';
    else if (days <= 15) status = 'due_soon';

    const newDew: Deworming = {
      id: `dew-${Date.now()}`,
      productName: dewProduct,
      type: dewType,
      dateAdministered: dewDateAdministered,
      nextDueDate: nextDueDateStr,
      frequencyMonths: dewFrequency,
      weightAtTime: pet.weightKg,
      status,
    };

    const updated = { ...pet, dewormingHistory: [newDew, ...pet.dewormingHistory] };
    onUpdatePet(updated);
    onAddPoints(80, 'Antipulgas/Vermífugo registrado');
    setShowAddDewormingModal(false);
    confetti({ particleCount: 40, spread: 45 });
  };

  const overdueVaccines = pet.vaccines.filter(v => v.status === 'overdue');
  const dueSoonVaccines = pet.vaccines.filter(v => v.status === 'due_soon');

  return (
    <div id="vaccine-schedule-container" className="space-y-6">
      {/* Overview Cards & Urgent Alerts */}
      {(overdueVaccines.length > 0 || dueSoonVaccines.length > 0) && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
                Lembretes Automáticos de Proteção Canina
              </h3>
              <p className="text-xs text-amber-900 dark:text-amber-300">
                Manter a imunização do seu cão em dia previne doenças graves como Parvovirose, Cinomose, Leptospirose e Raiva.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {overdueVaccines.map(v => (
                  <span
                    key={v.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg border border-red-300 dark:border-red-800"
                  >
                    🚨 <strong>{v.name}:</strong> Vencida há {Math.abs(calculateDaysLeft(v.nextDueDate))} dias
                  </span>
                ))}
                {dueSoonVaccines.map(v => (
                  <span
                    key={v.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-700"
                  >
                    ⏳ <strong>{v.name}:</strong> Vence em {calculateDaysLeft(v.nextDueDate)} dias
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs (Vacinas vs Vermífugos/Antipulgas) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="tab-vaccines-btn"
            onClick={() => setActiveTab('vaccines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'vaccines'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Syringe className="w-4 h-4" />
            <span>Vacinas ({pet.vaccines.length})</span>
          </button>

          <button
            id="tab-deworming-btn"
            onClick={() => setActiveTab('deworming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'deworming'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>Antipulgas & Vermífugos ({pet.dewormingHistory.length})</span>
          </button>
        </div>

        {/* Action Add Button */}
        <div>
          {activeTab === 'vaccines' ? (
            <button
              id="add-vaccine-btn"
              onClick={() => setShowAddVaccineModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nova Vacina</span>
            </button>
          ) : (
            <button
              id="add-deworming-btn"
              onClick={() => setShowAddDewormingModal(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Antipulgas / Vermífugo</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab: Vaccines List */}
      {activeTab === 'vaccines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pet.vaccines.map(vac => {
            const daysLeft = calculateDaysLeft(vac.nextDueDate);
            const isOverdue = daysLeft < 0;
            const isDueSoon = daysLeft >= 0 && daysLeft <= 30;

            return (
              <div
                key={vac.id}
                id={`vaccine-card-${vac.id}`}
                className={`p-5 rounded-2xl border transition-all bg-white dark:bg-slate-800/90 shadow-xs flex flex-col justify-between ${
                  isOverdue
                    ? 'border-red-300 dark:border-red-900 ring-1 ring-red-400/30'
                    : isDueSoon
                    ? 'border-amber-300 dark:border-amber-900 ring-1 ring-amber-400/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{vac.name}</h4>
                        {vac.type === 'essential' && (
                          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Obrigatória
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {vac.clinic || 'Clínica Veterinária'} • {vac.administeredBy || 'Veterinário(a)'}
                      </span>
                    </div>

                    {isOverdue ? (
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 text-xs font-bold rounded-lg shrink-0">
                        Atrasada
                      </span>
                    ) : isDueSoon ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold rounded-lg shrink-0">
                        Próxima dose
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Em dia
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block mb-0.5">Última Aplicação:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {vac.dateAdministered ? new Date(vac.dateAdministered).toLocaleDateString('pt-BR') : 'Não informada'}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block mb-0.5">Próximo Reforço:</span>
                      <span className={`font-bold ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-amber-600' : 'text-slate-700 dark:text-slate-200'}`}>
                        {new Date(vac.nextDueDate).toLocaleDateString('pt-BR')} ({isOverdue ? `Atrasada ${Math.abs(daysLeft)}d` : `em ${daysLeft}d`})
                      </span>
                    </div>
                  </div>

                  {vac.batchNumber && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Lote: <strong className="font-mono text-slate-700 dark:text-slate-300">{vac.batchNumber}</strong></span>
                    </div>
                  )}

                  {vac.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-700/40 p-2 rounded-lg mb-3">
                      "{vac.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Proteção anual garantida</span>
                  <button
                    onClick={() => handleApplyDose(vac.id)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Registrar Reforço Aplicado
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Deworming and Flea/Tick history */}
      {activeTab === 'deworming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pet.dewormingHistory.map(dew => {
            const daysLeft = calculateDaysLeft(dew.nextDueDate);
            const isOverdue = daysLeft < 0;

            return (
              <div
                key={dew.id}
                id={`deworming-card-${dew.id}`}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        <Bug className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{dew.productName}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {dew.type === 'flea_tick'
                            ? 'Antipulgas & Carrapatos'
                            : dew.type === 'dewormer'
                            ? 'Vermífugo Intestinal'
                            : 'Tratamento Completo'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isOverdue
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {isOverdue ? 'Renovação Necessária' : 'Proteção Ativa'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block mb-0.5">Última Dose:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {new Date(dew.dateAdministered).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block mb-0.5">Próxima Aplicação:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {new Date(dew.nextDueDate).toLocaleDateString('pt-BR')} ({daysLeft > 0 ? `em ${daysLeft} dias` : 'Vencido'})
                      </span>
                    </div>
                  </div>

                  {dew.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic mb-2">
                      {dew.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Frequência: a cada {dew.frequencyMonths} meses</span>
                  <span className="font-bold text-emerald-600">Peso no registro: {dew.weightAtTime || pet.weightKg} kg</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Vaccine */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Registrar Vacina no Prontuário</h3>
              </div>
              <button onClick={() => setShowAddVaccineModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewVaccine} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nome da Vacina</label>
                <select
                  value={vacName}
                  onChange={e => setVacName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white"
                >
                  <option value="V10 Polivalente Canina (Nobivac / Vanguard)">V10 Polivalente Canina (Essencial)</option>
                  <option value="Antirrábica Canina (Defensor / Rabisin)">Antirrábica Canina (Essencial)</option>
                  <option value="Gripe Canina / Tosse dos Canis (Bronchi-Shield)">Gripe Canina / Tosse dos Canis (Recomendada)</option>
                  <option value="Giardíase Canina (GiardiaVax)">Giardíase Canina (GiardiaVax)</option>
                  <option value="Leishmaniose Canina (Leish-Tec)">Leishmaniose Canina (Leish-Tec)</option>
                  <option value="Outra Vacina Específica">Outra Vacina...</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data de Aplicação</label>
                  <input
                    type="date"
                    required
                    value={vacDateAdministered}
                    onChange={e => setVacDateAdministered(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Próximo Reforço</label>
                  <input
                    type="date"
                    required
                    value={vacNextDueDate}
                    onChange={e => setVacNextDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Veterinário(a)</label>
                  <input
                    type="text"
                    value={vacVet}
                    onChange={e => setVacVet(e.target.value)}
                    placeholder="Ex: Dr. Silva (CRMV 1234)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Número do Lote</label>
                  <input
                    type="text"
                    value={vacBatch}
                    onChange={e => setVacBatch(e.target.value)}
                    placeholder="Ex: LOTE-88219"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Clínica / Hospital</label>
                <input
                  type="text"
                  value={vacClinic}
                  onChange={e => setVacClinic(e.target.value)}
                  placeholder="Ex: Hospital Veterinário VetCare"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddVaccineModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Salvar Vacina (+150 AuCoins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Deworming */}
      {showAddDewormingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Registrar Antipulgas / Vermífugo</h3>
              </div>
              <button onClick={() => setShowAddDewormingModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewDeworming} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={dewProduct}
                  onChange={e => setDewProduct(e.target.value)}
                  placeholder="Ex: Bravecto, Nexgard Spectra, Simparic, Drontal Plus"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data da Dose</label>
                  <input
                    type="date"
                    required
                    value={dewDateAdministered}
                    onChange={e => setDewDateAdministered(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Duração da Proteção</label>
                  <select
                    value={dewFrequency}
                    onChange={e => setDewFrequency(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  >
                    <option value={1}>1 mês (Ex: Nexgard / Simparic)</option>
                    <option value={3}>3 meses (Ex: Bravecto)</option>
                    <option value={4}>4 meses (Ex: Vermífugos semestrais)</option>
                    <option value={6}>6 meses</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDewormingModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Salvar Registro (+80 AuCoins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
