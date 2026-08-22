import React, { useState } from 'react';
import { Pet, MedicalConsultation, MedicalExam, AllergyAndCondition } from '../types';
import { Stethoscope, FileText, AlertTriangle, Pill, Activity, Plus, Download, Printer, CheckCircle2, ShieldAlert, Sparkles, Scale, ExternalLink, Calendar, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  pet: Pet;
  onUpdatePet: (updatedPet: Pet) => void;
  onAddPoints: (amount: number, reason: string) => void;
}

export const MedicalRecord: React.FC<Props> = ({ pet, onUpdatePet, onAddPoints }) => {
  const [subSection, setSubSection] = useState<'consultations' | 'exams' | 'allergies' | 'weight' | 'medications'>('consultations');
  const [showAddConsultation, setShowAddConsultation] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [selectedExamForModal, setSelectedExamForModal] = useState<MedicalExam | null>(null);

  // New Consultation state
  const [consVet, setConsVet] = useState('');
  const [consClinic, setConsClinic] = useState('');
  const [consReason, setConsReason] = useState('');
  const [consDiagnosis, setConsDiagnosis] = useState('');
  const [consPrescriptions, setConsPrescriptions] = useState('');
  const [consCost, setConsCost] = useState('');

  // New Exam state
  const [examTitle, setExamTitle] = useState('');
  const [examCategory, setExamCategory] = useState<MedicalExam['category']>('blood');
  const [examLab, setExamLab] = useState('');
  const [examSummary, setExamSummary] = useState('');
  const [examStatus, setExamStatus] = useState<MedicalExam['status']>('normal');

  // New Allergy state
  const [allergyName, setAllergyName] = useState('');
  const [allergySeverity, setAllergySeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [allergyType, setAllergyType] = useState<'food' | 'medication' | 'environmental'>('medication');
  const [allergyTreatment, setAllergyTreatment] = useState('');

  // New Weight state
  const [newWeightValue, setNewWeightValue] = useState('');

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consReason.trim()) return;

    const newCons: MedicalConsultation = {
      id: `cons-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      veterinarian: consVet || pet.emergencyContact.primaryVetName,
      clinic: consClinic || 'Clínica Veterinária',
      reason: consReason,
      diagnosis: consDiagnosis || 'Avaliação clínica sem alterações graves',
      prescriptions: consPrescriptions ? consPrescriptions.split('\n').filter(p => p.trim()) : [],
      cost: parseFloat(consCost) || undefined,
    };

    const updated = { ...pet, consultations: [newCons, ...pet.consultations] };
    onUpdatePet(updated);
    onAddPoints(120, 'Consulta adicionada ao prontuário');
    setShowAddConsultation(false);
    setConsReason('');
    setConsDiagnosis('');
    setConsPrescriptions('');
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    const newEx: MedicalExam = {
      id: `ex-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: examTitle,
      category: examCategory,
      laboratory: examLab || 'Laboratório Diagnóstico Vet',
      resultsSummary: examSummary,
      status: examStatus,
      fileName: `${examTitle.replace(/\s+/g, '_')}_${pet.name}.pdf`,
    };

    const updated = { ...pet, exams: [newEx, ...pet.exams] };
    onUpdatePet(updated);
    onAddPoints(100, 'Exame anexado ao prontuário');
    setShowAddExam(false);
    setExamTitle('');
    setExamSummary('');
    confetti({ particleCount: 35, spread: 45 });
  };

  const handleSaveAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergyName.trim()) return;

    const newAll: AllergyAndCondition = {
      id: `alg-${Date.now()}`,
      name: allergyName,
      severity: allergySeverity,
      type: allergyType,
      treatment: allergyTreatment,
    };

    const updated = { ...pet, allergies: [...pet.allergies, newAll] };
    onUpdatePet(updated);
    onAddPoints(60, 'Alérgeno registrado com segurança');
    setShowAddAllergy(false);
    setAllergyName('');
    setAllergyTreatment('');
  };

  const handleDeleteAllergy = (id: string) => {
    const updated = { ...pet, allergies: pet.allergies.filter(a => a.id !== id) };
    onUpdatePet(updated);
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightValue);
    if (!val || val <= 0) return;

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      weightKg: val,
    };

    const updated = {
      ...pet,
      weightKg: val,
      weightHistory: [...pet.weightHistory, newEntry],
    };
    onUpdatePet(updated);
    onAddPoints(50, 'Peso atualizado');
    setShowAddWeight(false);
    setNewWeightValue('');
  };

  return (
    <div id="medical-record-container" className="space-y-6">
      {/* Top Banner with Pet Health Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
              Prontuário Digital Centralizado
            </span>
            <span className="text-xs text-slate-300 font-mono">ID: {pet.microchipId || 'MICRO-88219'}</span>
          </div>
          <h2 className="text-2xl font-black">{pet.name} ({pet.breed})</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Histórico completo de consultas, exames, laudos e contraindicações disponível em nuvem e pronto para compartilhamento com clínicas e hospitais 24h.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Prontuário
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSubSection('consultations')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            subSection === 'consultations'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Consultas ({pet.consultations.length})</span>
        </button>

        <button
          onClick={() => setSubSection('exams')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            subSection === 'exams'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Exames & Laudos ({pet.exams.length})</span>
        </button>

        <button
          onClick={() => setSubSection('allergies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            subSection === 'allergies'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Alergias & Restrições ({pet.allergies.length})</span>
        </button>

        <button
          onClick={() => setSubSection('weight')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            subSection === 'weight'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Curva de Peso ({pet.weightKg} kg)</span>
        </button>
      </div>

      {/* SECTION: Consultations */}
      {subSection === 'consultations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Histórico de Atendimentos Veterinários</h3>
            <button
              onClick={() => setShowAddConsultation(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Consulta</span>
            </button>
          </div>

          {pet.consultations.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
              <Stethoscope className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-200">Nenhuma consulta registrada ainda</p>
              <p className="text-xs text-slate-500 mt-1">Registre visitas ao veterinário para manter histórico de diagnósticos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pet.consultations.map(cons => (
                <div
                  key={cons.id}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-100 dark:border-slate-700 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white">{cons.reason}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {cons.clinic} • {cons.veterinarian}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(cons.date).toLocaleDateString('pt-BR')}</span>
                      {cons.cost && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md">R$ {cons.cost.toFixed(2)}</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Diagnóstico Clínico</span>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cons.diagnosis}</p>
                  </div>

                  {cons.prescriptions.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl space-y-1">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-blue-500" />
                        Prescrições e Medicamentos Indicados:
                      </span>
                      <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc">
                        {cons.prescriptions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cons.notes && (
                    <p className="text-xs text-slate-500 italic">Observações: {cons.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION: Exams */}
      {subSection === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Laudos & Exames Laboratoriais</h3>
            <button
              onClick={() => setShowAddExam(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Anexar Exame</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pet.exams.map(exam => (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exam.title}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{exam.laboratory}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        exam.status === 'normal'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {exam.status === 'normal' ? 'Normal / Sem alterações' : 'Alterado'}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/40 p-3 rounded-xl my-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold block mb-1 text-slate-800 dark:text-slate-200">Resumo do Laudo:</span>
                    <p>{exam.resultsSummary}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{new Date(exam.date).toLocaleDateString('pt-BR')}</span>
                  <button
                    onClick={() => setSelectedExamForModal(exam)}
                    className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visualizar Laudo Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Allergies */}
      {subSection === 'allergies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Alergias e Restrições Farmacológicas</h3>
            <button
              onClick={() => setShowAddAllergy(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Alergia / Alerta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pet.allergies.map(alg => (
              <div
                key={alg.id}
                className="bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                      <h4 className="font-bold text-sm text-red-950 dark:text-red-200">{alg.name}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteAllergy(alg.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-red-900 dark:text-red-300">
                    <div>
                      <span className="font-bold">Gravidade: </span>
                      <span className="uppercase font-semibold tracking-wider">{alg.severity}</span>
                    </div>
                    {alg.treatment && (
                      <p className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-lg border border-red-100 dark:border-red-900/40">
                        <strong>Protocolo/Alternativa:</strong> {alg.treatment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Weight Curve */}
      {subSection === 'weight' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Evolução do Peso Corporal</h3>
              <p className="text-xs text-slate-500">Acompanhamento contínuo para prevenção de sobrepeso e desnutrição.</p>
            </div>
            <button
              onClick={() => setShowAddWeight(true)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nova Pesagem</span>
            </button>
          </div>

          {/* Simple Visual Bar Chart representation of Weight */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Curva Histórica de Peso (kg)</h4>
            <div className="flex items-end gap-3 h-48 pt-6 border-b border-slate-200 dark:border-slate-700 pb-2">
              {pet.weightHistory.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(20, (item.weightKg / 40) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.weightKg} kg</span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-teal-300 transition-all shadow-xs"
                    ></div>
                    <span className="text-[10px] text-slate-400 truncate w-full text-center">
                      {new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Consultation */}
      {showAddConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Registrar Consulta Veterinária</h3>
              <button onClick={() => setShowAddConsultation(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveConsultation} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Motivo do Atendimento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Check-up anual, dor na pata, coceira"
                  value={consReason}
                  onChange={e => setConsReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Diagnóstico e Avaliação</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Estado clínico saudável, sem alterações em ausculta cardíaca."
                  value={consDiagnosis}
                  onChange={e => setConsDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Prescrições / Medicamentos (um por linha)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Meloxicam 1mg - 1 comp ao dia por 5 dias"
                  value={consPrescriptions}
                  onChange={e => setConsPrescriptions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Veterinário(a)</label>
                  <input
                    type="text"
                    placeholder="Dra. Mariana Prado"
                    value={consVet}
                    onChange={e => setConsVet(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Valor da Consulta (R$)</label>
                  <input
                    type="number"
                    placeholder="220.00"
                    value={consCost}
                    onChange={e => setConsCost(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddConsultation(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Salvar Consulta (+120 AuCoins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Exam */}
      {showAddExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Anexar Exame ao Prontuário</h3>
              <button onClick={() => setShowAddExam(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveExam} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Título do Exame</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hemograma Completo, Ultrassom Abdominal"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Categoria</label>
                  <select
                    value={examCategory}
                    onChange={e => setExamCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  >
                    <option value="blood">Sangue / Bioquímico</option>
                    <option value="xray">Raio-X Digital</option>
                    <option value="ultrasound">Ultrassonografia</option>
                    <option value="urine">Urina / Fezes</option>
                    <option value="cardiac">Cardiológico</option>
                    <option value="other">Outro Exame</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Resultado Geral</label>
                  <select
                    value={examStatus}
                    onChange={e => setExamStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  >
                    <option value="normal">Normal (Sem alterações)</option>
                    <option value="altered">Alterado (Necessita atenção)</option>
                    <option value="critical">Crítico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Resumo do Laudo / Conclusão</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Hemácias e plaquetas normais. Creatinina e ureia estáveis."
                  value={examSummary}
                  onChange={e => setExamSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddExam(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Salvar Exame (+100 AuCoins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Allergy */}
      {showAddAllergy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Adicionar Alergia ou Restrição</h3>
              <button onClick={() => setShowAddAllergy(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveAllergy} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Substância ou Medicamento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dipirona Sódica, Frango, Grama molhada"
                  value={allergyName}
                  onChange={e => setAllergyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Tipo</label>
                  <select
                    value={allergyType}
                    onChange={e => setAllergyType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  >
                    <option value="medication">Medicamento (Crítico)</option>
                    <option value="food">Alimentar</option>
                    <option value="environmental">Ambiental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Gravidade</label>
                  <select
                    value={allergySeverity}
                    onChange={e => setAllergySeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  >
                    <option value="severe">Severa / Anafilática</option>
                    <option value="moderate">Moderada</option>
                    <option value="mild">Leve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Substituição / Conduta Indicada</label>
                <input
                  type="text"
                  placeholder="Ex: Usar Meloxicam ou Tramadol sob prescrição"
                  value={allergyTreatment}
                  onChange={e => setAllergyTreatment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAllergy(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm"
                >
                  Salvar Alergia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Weight Entry */}
      {showAddWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Registrar Peso Atual</h3>
            <form onSubmit={handleSaveWeight} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Peso (em kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ex: 32.5"
                  value={newWeightValue}
                  onChange={e => setNewWeightValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWeight(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Salvar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Exam Preview Modal */}
      {selectedExamForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">Laudo Diagnóstico Oficial</span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedExamForModal.title}</h3>
              </div>
              <button onClick={() => setSelectedExamForModal(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-lg">
                <span>Laboratório: <strong>{selectedExamForModal.laboratory}</strong></span>
                <span>Data: <strong>{new Date(selectedExamForModal.date).toLocaleDateString('pt-BR')}</strong></span>
              </div>
              <div>
                <span className="font-bold block mb-1">Conclusão do Médico Veterinário / Patologista:</span>
                <p className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border leading-relaxed">
                  {selectedExamForModal.resultsSummary}
                </p>
              </div>
              <div className="text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Arquivo Digital: {selectedExamForModal.fileName}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedExamForModal(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
