import React, { useState, useRef, useEffect } from 'react';
import { Pet, VetMessage, MedicalConsultation } from '../types';
import { Stethoscope, Send, AlertCircle, ShieldAlert, CheckCircle2, Clock, Image, Paperclip, Sparkles, MessageSquare, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  pet: Pet;
  messages: VetMessage[];
  onSaveMessages: (msgs: VetMessage[]) => void;
  onUpdatePet: (pet: Pet) => void;
  onAddPoints: (amount: number, reason: string) => void;
}

export const Vet24hChat: React.FC<Props> = ({
  pet,
  messages,
  onSaveMessages,
  onUpdatePet,
  onAddPoints,
}) => {
  const [inputText, setInputText] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'low' | 'medium' | 'emergency'>('low');
  const [isTyping, setIsTyping] = useState(false);
  const [savedToEhrId, setSavedToEhrId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: VetMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      urgencyLevel: urgencyLevel === 'emergency' ? 'emergency' : urgencyLevel === 'medium' ? 'medium' : 'low',
    };

    const updated = [...messages, userMsg];
    onSaveMessages(updated);
    const sentText = inputText.trim();
    setInputText('');
    setIsTyping(true);

    // Simulate smart Veterinary on-call responses
    setTimeout(() => {
      let vetResponse = '';
      let recommendationTitle = 'Orientações Clínicas Preliminares';
      let recommendationItems: string[] = [];

      if (sentText.toLowerCase().includes('vomit') || sentText.toLowerCase().includes('vômit') || sentText.toLowerCase().includes('enjoo')) {
        vetResponse = `Olá! Analisando o prontuário do ${pet.name} (${pet.breed}, ${pet.weightKg}kg): episódios de vômito exigem atenção especial para evitar desidratação. Como ele tem ${pet.allergies.map(a => a.name).join(', ') || 'nenhuma alergia grave registrada'}, certifique-se de que ele não ingeriu ossos, plantas tóxicas ou ração com frango.`;
        recommendationTitle = 'Conduta Imediata para Vômito:';
        recommendationItems = [
          'Jejum de água e ração por 2 a 3 horas para acalmar o estômago.',
          'Oferecer cubos de gelo ou água de coco em pequenas colheradas após o jejum.',
          'Se houver sangue, prostração ou repetição mais de 3 vezes, vá à emergência 24h imediatamente.',
        ];
      } else if (sentText.toLowerCase().includes('coceira') || sentText.toLowerCase().includes('pata') || sentText.toLowerCase().includes('pele') || sentText.toLowerCase().includes('alergia')) {
        vetResponse = `Entendido. Pelo histórico do ${pet.name}, ele já possui sensibilidade alimentar/contato registrada no prontuário. Nunca aplique pomadas humanas com corticoides sem dosagem exata.`;
        recommendationTitle = 'Cuidados Dermatológicos:';
        recommendationItems = [
          'Higienizar as patinhas com solução fisiológica morna e secar bem com toalha limpa.',
          'Evitar passeios em gramados úmidos ou áreas com produtos de limpeza de calçada.',
          'Manter o colar elizabetano ou roupinha se houver ferimento por lambedura.',
        ];
      } else if (urgencyLevel === 'emergency') {
        vetResponse = `🚨 ATENÇÃO DE EMERGÊNCIA: Em casos críticos, o tempo é essencial! Já localizei o Hospital Veterinário 24h mais próximo com vaga disponível: ${pet.emergencyContact.clinic24h} (${pet.emergencyContact.clinic24hPhone}). Telefone agora e avise que está a caminho!`;
        recommendationTitle = 'Procedimentos de Transporte de Emergência:';
        recommendationItems = [
          'Mantenha as vias aéreas do pet desobstruídas e a cabeça levemente elevada.',
          'Envolva o cão em um cobertor firme para evitar movimentos bruscos.',
          'Não forneça medicamentos por conta própria (especialmente Dipirona que é alérgeno dele!).',
        ];
      } else {
        vetResponse = `Obrigada pela mensagem! Estou acompanhando o caso do ${pet.name}. Seu estado geral é estável de acordo com os últimos exames no prontuário. Recomendo monitorar o apetite, nível de energia e fezes nas próximas 12 horas.`;
        recommendationTitle = 'Monitoramento Preventivo:';
        recommendationItems = [
          'Anotar qualquer alteração comportamental ou febre (focinho muito quente e seco com letargia).',
          'Manter hidratação abundante com água fresca.',
          'Caso os sintomas persistam, agendar consulta presencial para ausculta e palpação.',
        ];
      }

      const vetMsg: VetMessage = {
        id: `msg-vet-${Date.now()}`,
        sender: 'vet',
        vetName: 'Dra. Beatriz Albuquerque',
        vetCrmv: 'CRMV-SP 48.912',
        vetAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
        text: vetResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendationCard: {
          title: recommendationTitle,
          items: recommendationItems,
        },
      };

      setIsTyping(false);
      onSaveMessages([...updated, vetMsg]);
      onAddPoints(40, 'Teleorientação Veterinária realizada');
    }, 1200);
  };

  const handleSaveToMedicalRecord = (msg: VetMessage) => {
    const newCons: MedicalConsultation = {
      id: `cons-tele-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      veterinarian: msg.vetName || 'Plantão Veterinário AuAu Care',
      clinic: 'Teleorientação Vet 24h AuAu Care',
      reason: 'Teleorientação Emergencial / Dúvida Clínica',
      diagnosis: msg.text.slice(0, 150) + '...',
      prescriptions: msg.recommendationCard?.items || ['Monitoramento em casa'],
      cost: 0,
      notes: 'Orientação registrada via chat 24h integrado.',
    };

    onUpdatePet({
      ...pet,
      consultations: [newCons, ...pet.consultations],
    });
    setSavedToEhrId(msg.id);
    onAddPoints(80, 'Relatório de teleorientação salvo no Prontuário');
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div id="vet-24h-chat-container" className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
            <Stethoscope className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Plantão 24 Horas Ativo</span>
            </div>
            <h2 className="text-xl font-bold">Chat Direto com Médicos Veterinários</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${pet.emergencyContact.clinic24hPhone.replace(/\D/g, '')}`}
            className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Ligar Emergência 24h ({pet.emergencyContact.clinic24hPhone})</span>
          </a>
        </div>
      </div>

      {/* Triage Urgency Level Selector */}
      <div className="bg-white dark:bg-slate-800/90 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200">Classificação de Triagem:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUrgencyLevel('low')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              urgencyLevel === 'low'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 ring-2 ring-emerald-500'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
          >
            🟢 Dúvida / Comportamento
          </button>
          <button
            onClick={() => setUrgencyLevel('medium')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              urgencyLevel === 'medium'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ring-2 ring-amber-500'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
          >
            🟡 Sintoma Moderado
          </button>
          <button
            onClick={() => setUrgencyLevel('emergency')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              urgencyLevel === 'emergency'
                ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
            }`}
          >
            🔴 Urgência Crítica
          </button>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-[480px] flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Messages Stream */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {messages.map(msg => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="text-center my-2">
                  <div className="inline-block bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-4 py-2 rounded-xl max-w-lg">
                    {msg.text}
                  </div>
                </div>
              );
            }

            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <img
                    src={msg.vetAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80'}
                    alt="Veterinário"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50 shrink-0 mt-1"
                  />
                )}

                <div className="space-y-1.5">
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{msg.vetName}</span>
                      <span>({msg.vetCrmv})</span>
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Recommendation Card */}
                    {msg.recommendationCard && (
                      <div className="mt-3 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 text-slate-800 dark:text-slate-200 text-xs space-y-1.5">
                        <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                          {msg.recommendationCard.title}
                        </span>
                        <ul className="space-y-1 pl-3 list-disc">
                          {msg.recommendationCard.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSaveToMedicalRecord(msg)}
                        disabled={savedToEhrId === msg.id}
                        className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-2"
                      >
                        {savedToEhrId === msg.id ? 'Salvo no Prontuário ✅' : 'Salvar no Prontuário Digital'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span>Dra. Beatriz Albuquerque está digitando orientações...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
          <input
            type="text"
            placeholder="Descreva o que o seu cão está sentindo (ex: febre, vômito, coceira)..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
