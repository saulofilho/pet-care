import React, { useState } from 'react';
import { Pet } from '../types';
import { AlertTriangle, Phone, MapPin, QrCode, ShieldAlert, Heart, Activity, Copy, Check, Printer, X, Share2, Stethoscope } from 'lucide-react';

interface Props {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
}

export const SosEmergencyModal: React.FC<Props> = ({ pet, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQrExpanded, setShowQrExpanded] = useState(false);

  if (!isOpen) return null;

  const urgentAllergies = pet.allergies.filter(a => a.severity === 'severe' || a.severity === 'moderate');

  const emergencySummaryText = `🚨 FICHA DE EMERGÊNCIA VETERINÁRIA - ${pet.name.toUpperCase()}
🐕 Raça: ${pet.breed} | Peso: ${pet.weightKg}kg | Idade: ${pet.ageYears}a ${pet.ageMonths}m
🩸 Tipo Sanguíneo: ${pet.bloodType || 'Não informado'} | Microchip: ${pet.microchipId || 'Não informado'}
⚠️ ALERGIAS GRAVES: ${pet.allergies.map(a => `${a.name} (${a.severity})`).join(', ') || 'Nenhuma registrada'}
💊 MEDICAMENTOS EM USO: ${pet.continuousMedications.join(', ') || 'Nenhum'}
🏥 Clínica 24h: ${pet.emergencyContact.clinic24h} - Tel: ${pet.emergencyContact.clinic24hPhone}
👤 Tutor: ${pet.emergencyContact.ownerName} - Tel: ${pet.emergencyContact.phone}
👨‍⚕️ Veterinário Titular: ${pet.emergencyContact.primaryVetName} - Tel: ${pet.emergencyContact.primaryVetPhone}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emergencySummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="sos-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="sos-modal-card" 
        className="bg-white dark:bg-slate-900 border-2 border-red-500/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
      >
        {/* Top Header - High Impact Red */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-md">
                  Acesso Rápido SOS
                </span>
                <span className="text-xs font-semibold text-rose-100">Prontuário de Emergência</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{pet.name} • {pet.breed}</h2>
            </div>
          </div>
          <button 
            id="close-sos-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Critical Alert Banner if Allergies exist */}
          {urgentAllergies.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/40 border-l-4 border-red-600 p-4 rounded-r-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-200 text-base">
                    ATENÇÃO: Alergias e Contraindicações Médicas
                  </h4>
                  <ul className="mt-1.5 space-y-1 text-red-800 dark:text-red-300 font-medium">
                    {urgentAllergies.map(a => (
                      <li key={a.id} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                        <strong>{a.name}:</strong> {a.treatment || 'Evitar administração'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Peso Atual</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                {pet.weightKg} kg
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Tipo Sanguíneo</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Heart className="w-4 h-4 text-rose-500" />
                {pet.bloodType || 'DEA 1.1'}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Microchip ID</span>
              <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 truncate mt-1 block">
                {pet.microchipId || '981020000349812'}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Castração</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                {pet.neutered ? 'Castrado(a) ✅' : 'Não castrado'}
              </span>
            </div>
          </div>

          {/* Emergency 24h Vet Direct Contact Box */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold">
                <Stethoscope className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span>Hospital Veterinário de Plantão 24h</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-xs font-bold rounded-full">
                Plantão Ativo
              </span>
            </div>
            <p className="font-bold text-base text-slate-900 dark:text-white">{pet.emergencyContact.clinic24h}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{pet.emergencyContact.clinic24hAddress}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a 
                href={`tel:${pet.emergencyContact.clinic24hPhone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                Ligar Agora ({pet.emergencyContact.clinic24hPhone})
              </a>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(pet.emergencyContact.clinic24hAddress)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-lg font-semibold text-xs transition-all"
              >
                <MapPin className="w-4 h-4" />
                Abrir Rota GPS
              </a>
            </div>
          </div>

          {/* Primary Vet & Owner Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Veterinário Titular
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{pet.emergencyContact.primaryVetName}</p>
              <a 
                href={`tel:${pet.emergencyContact.primaryVetPhone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                {pet.emergencyContact.primaryVetPhone}
              </a>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Tutor(a) Responsável
              </span>
              <p className="font-bold text-slate-900 dark:text-white">{pet.emergencyContact.ownerName}</p>
              <a 
                href={`tel:${pet.emergencyContact.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                {pet.emergencyContact.phone}
              </a>
            </div>
          </div>

          {/* Continuous Medications & Chronic Diseases */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
              Medicamentos Contínuos & Condições Crônicas
            </h4>
            {pet.continuousMedications.length > 0 ? (
              <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {pet.continuousMedications.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Nenhum medicamento contínuo no momento.</p>
            )}
          </div>

          {/* QR Code Identification Card Simulation */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Pet ID Digital Verificado
              </span>
              <h5 className="font-bold text-white text-base">QR Code de Prontuário Rápido</h5>
              <p className="text-xs text-slate-300 max-w-sm">
                Qualquer veterinário ou clínica pode escanear este QR Code para ler o histórico médico completo e exames em caso de resgate.
              </p>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-inner shrink-0 cursor-pointer" onClick={() => setShowQrExpanded(!showQrExpanded)}>
              <QrCode className="w-14 h-14 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <button
            id="copy-emergency-info-btn"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-600 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado para Área de Transferência!' : 'Copiar Texto para WhatsApp'}
          </button>

          <div className="flex items-center gap-2">
            <button
              id="print-emergency-card-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              Imprimir Ficha SOS
            </button>
            <button
              id="close-sos-bottom-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
