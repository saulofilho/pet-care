import React, { useState, useEffect } from 'react';
import { Pet, PlaceLocation, SocialPost, ParkMeetup, Product, UserRewards, VetMessage, RewardCoupon, Mission } from './types';
import { StorageService } from './services/storage';
import { Navbar, AppTab } from './components/Navbar';
import { PetProfileHeader } from './components/PetProfileHeader';
import { BentoDashboard } from './components/BentoDashboard';
import { VaccineSchedule } from './components/VaccineSchedule';
import { MedicalRecord } from './components/MedicalRecord';
import { NearbyMap } from './components/NearbyMap';
import { SocialParkMeetups } from './components/SocialParkMeetups';
import { Marketplace } from './components/Marketplace';
import { RewardsSystem } from './components/RewardsSystem';
import { Vet24hChat } from './components/Vet24hChat';
import { SosEmergencyModal } from './components/SosEmergencyModal';
import { MessageCircle, Sparkles, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard');
  const [pets, setPets] = useState<Pet[]>(() => StorageService.getPets());
  const [activePetId, setActivePetId] = useState<string>(() => StorageService.getActivePetId());
  const [places, setPlaces] = useState<PlaceLocation[]>(() => StorageService.getPlaces());
  const [posts, setPosts] = useState<SocialPost[]>(() => StorageService.getPosts());
  const [meetups, setMeetups] = useState<ParkMeetup[]>(() => StorageService.getMeetups());
  const [products] = useState<Product[]>(() => StorageService.getProducts());
  const [rewards, setRewards] = useState<UserRewards>(() => StorageService.getRewards());
  const [coupons] = useState<RewardCoupon[]>(() => StorageService.getCoupons());
  const [missions, setMissions] = useState<Mission[]>(() => StorageService.getMissions());
  const [vetMessages, setVetMessages] = useState<VetMessage[]>(() => StorageService.getVetMessages());
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active pet reference
  const activePet = pets.find(p => p.id === activePetId) || pets[0];

  // Check for overdue vaccines or health alerts
  const overdueVaccines = activePet?.vaccines.filter(v => v.status === 'overdue') || [];
  const overdueDeworming = activePet?.dewormingHistory.filter(d => new Date(d.nextDueDate).getTime() < Date.now()) || [];
  const hasOverdueAlerts = overdueVaccines.length > 0 || overdueDeworming.length > 0;
  const overdueCount = overdueVaccines.length + overdueDeworming.length;

  const handleSelectPet = (petId: string) => {
    setActivePetId(petId);
    StorageService.setActivePetId(petId);
  };

  const handleAddNewPet = (newPet: Pet) => {
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    setActivePetId(newPet.id);
    StorageService.savePets(updatedPets);
    StorageService.setActivePetId(newPet.id);
    handleAddPoints(200, `Novo cãozinho ${newPet.name} cadastrado`);
  };

  const handleUpdateActivePet = (updatedPet: Pet) => {
    const updatedPets = pets.map(p => (p.id === updatedPet.id ? updatedPet : p));
    setPets(updatedPets);
    StorageService.savePets(updatedPets);
  };

  const handleAddPoints = (amount: number, reason: string) => {
    const updated = StorageService.addPoints(amount, reason);
    setRewards(updated);
    setToastMessage(`🎉 +${amount} AuCoins! ${reason}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSavePosts = (newPosts: SocialPost[]) => {
    setPosts(newPosts);
    StorageService.savePosts(newPosts);
  };

  const handleSaveMeetups = (newMeetups: ParkMeetup[]) => {
    setMeetups(newMeetups);
    StorageService.saveMeetups(newMeetups);
  };

  const handleSaveRewards = (newRewards: UserRewards) => {
    setRewards(newRewards);
    StorageService.saveRewards(newRewards);
  };

  const handleSaveMissions = (newMissions: Mission[]) => {
    setMissions(newMissions);
    StorageService.saveMissions(newMissions);
  };

  const handleSaveVetMessages = (newMessages: VetMessage[]) => {
    setVetMessages(newMessages);
    StorageService.saveVetMessages(newMessages);
  };

  // Pending vaccine and deworming alerts count
  const pendingVaccines = activePet?.vaccines.filter(v => v.status === 'overdue' || v.status === 'due_soon') || [];
  const pendingDeworming = activePet?.dewormingHistory.filter(d => d.status === 'overdue' || d.status === 'due_soon') || [];
  const totalPendingAlerts = pendingVaccines.length + pendingDeworming.length;

  if (!activePet) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar with Bento Links, Points, SOS Button */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSos={() => setIsSosOpen(true)}
        pendingAlertsCount={totalPendingAlerts}
        points={rewards.pointsBalance}
        tier={rewards.tier}
      />

      {/* Pet Header with Switching, Quick Health Chips, SOS */}
      <PetProfileHeader
        pets={pets}
        activePet={activePet}
        onSelectPet={handleSelectPet}
        onAddNewPet={handleAddNewPet}
        onOpenSos={() => setIsSosOpen(true)}
        points={rewards.pointsBalance}
        tier={rewards.tier}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Switching */}
        {currentTab === 'dashboard' && (
          <BentoDashboard
            pet={activePet}
            places={places}
            posts={posts}
            meetups={meetups}
            products={products}
            rewards={rewards}
            vetMessages={vetMessages}
            onSelectTab={setCurrentTab}
            onOpenSos={() => setIsSosOpen(true)}
            onAddPoints={handleAddPoints}
            onUpdatePet={handleUpdateActivePet}
          />
        )}

        {currentTab === 'vaccines' && (
          <VaccineSchedule
            pet={activePet}
            onUpdatePet={handleUpdateActivePet}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === 'medical' && (
          <MedicalRecord
            pet={activePet}
            onUpdatePet={handleUpdateActivePet}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === 'map' && (
          <NearbyMap
            places={places}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === 'social' && (
          <SocialParkMeetups
            pet={activePet}
            posts={posts}
            meetups={meetups}
            onSavePosts={handleSavePosts}
            onSaveMeetups={handleSaveMeetups}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === 'marketplace' && (
          <Marketplace
            products={products}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === 'rewards' && (
          <RewardsSystem
            rewards={rewards}
            coupons={coupons}
            missions={missions}
            onSaveRewards={handleSaveRewards}
            onSaveMissions={handleSaveMissions}
            onAddPoints={handleAddPoints}
          />
        )}

        {currentTab === 'vetChat' && (
          <Vet24hChat
            pet={activePet}
            messages={vetMessages}
            onSaveMessages={handleSaveVetMessages}
            onUpdatePet={handleUpdateActivePet}
            onAddPoints={handleAddPoints}
          />
        )}
      </main>

      {/* Floating Plantão Vet 24h FAB */}
      {currentTab !== 'vetChat' && (
        <button
          id="floating-vet-fab-btn"
          onClick={() => setCurrentTab('vetChat')}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 group ${
            hasOverdueAlerts
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white ring-4 ring-red-500/40 shadow-red-500/30'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
          title={
            hasOverdueAlerts
              ? `Ação Urgente: ${overdueCount} alerta(s) de vacina ou saúde vencidos! Toque para falar com o Plantão 24h.`
              : 'Falar com Veterinário de Plantão 24h'
          }
        >
          <div className="relative">
            {hasOverdueAlerts ? (
              <>
                <ShieldAlert className="w-5 h-5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 ring-2 ring-white border border-red-200"></span>
                </span>
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-600 animate-ping"></span>
              </>
            )}
          </div>
          <span className="text-xs font-bold whitespace-nowrap pr-1 flex items-center gap-1.5">
            {hasOverdueAlerts ? (
              <>
                <span>Ação Urgente ({overdueCount})</span>
                <span className="hidden sm:inline opacity-90 text-[11px] font-medium">• Plantão 24h</span>
              </>
            ) : (
              <span>Plantão Vet 24h</span>
            )}
          </span>
        </button>
      )}

      {/* SOS Emergency Modal */}
      <SosEmergencyModal
        pet={activePet}
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} AuAu Care • Bento Grid Dog Health & Care System</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSosOpen(true)} className="text-red-600 font-bold hover:underline">
              Ficha SOS de Emergência
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('rewards')} className="hover:underline">
              Programa AuCoins
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('vetChat')} className="hover:underline">
              Plantão Veterinário 24h
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
