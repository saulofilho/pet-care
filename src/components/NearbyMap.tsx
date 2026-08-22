import React, { useState } from 'react';
import { PlaceLocation } from '../types';
import { MapPin, Navigation, Phone, MessageCircle, Star, Search, Filter, ShieldCheck, GraduationCap, Clock, Award, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  places: PlaceLocation[];
  onAddPoints: (amount: number, reason: string) => void;
}

export const NearbyMap: React.FC<Props> = ({ places, onAddPoints }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'petshop' | 'vet24h' | 'trainer' | 'dogpark'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxRadiusKm, setMaxRadiusKm] = useState(15);
  const [activePlace, setActivePlace] = useState<PlaceLocation | null>(places[0] || null);
  const [bookingSuccessPlaceId, setBookingSuccessPlaceId] = useState<string | null>(null);

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory === 'all' || place.type === selectedCategory;
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.trainerDetails && place.trainerDetails.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesRadius = place.distanceKm <= maxRadiusKm;
    return matchesCategory && matchesSearch && matchesRadius;
  });

  const handleBookTrainerOrService = (place: PlaceLocation) => {
    setBookingSuccessPlaceId(place.id);
    onAddPoints(80, `Avaliação agendada com ${place.name}`);
    setTimeout(() => setBookingSuccessPlaceId(null), 4000);
  };

  const getPinColor = (type: PlaceLocation['type']) => {
    switch (type) {
      case 'vet24h':
        return 'bg-red-600 text-white';
      case 'trainer':
        return 'bg-indigo-600 text-white';
      case 'dogpark':
        return 'bg-emerald-600 text-white';
      case 'petshop':
      default:
        return 'bg-amber-500 text-white';
    }
  };

  const getCategoryLabel = (type: PlaceLocation['type']) => {
    switch (type) {
      case 'vet24h':
        return 'Clínica 24h';
      case 'trainer':
        return 'Adestrador';
      case 'dogpark':
        return 'Parque Pet';
      case 'petshop':
      default:
        return 'Pet Shop';
    }
  };

  return (
    <div id="nearby-map-container" className="space-y-6">
      {/* Search & Radius Filter Bar */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, bairro, ração, adestrador ou especialidade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-700/60 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Radius Slider */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/40 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Raio:</span>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={maxRadiusKm}
              onChange={e => setMaxRadiusKm(parseInt(e.target.value))}
              className="w-24 accent-emerald-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 min-w-[45px] text-right">
              {maxRadiusKm} km
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Todos ({places.length})
          </button>
          <button
            onClick={() => setSelectedCategory('petshop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'petshop'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Pet Shops & Farmácias
          </button>
          <button
            onClick={() => setSelectedCategory('trainer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'trainer'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Adestradores Profissionais
          </button>
          <button
            onClick={() => setSelectedCategory('vet24h')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'vet24h'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Hospitais & Clínicas 24h
          </button>
          <button
            onClick={() => setSelectedCategory('dogpark')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'dogpark'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Parques Pet Friendly
          </button>
        </div>
      </div>

      {/* Interactive Map Layout & Radar View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Stage (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden relative shadow-lg border border-slate-700 min-h-[380px] flex flex-col justify-between p-4">
          {/* Map Grid Decorative Layer */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          ></div>

          {/* Top Map HUD */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-semibold">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>São Paulo - SP • GPS Ativo</span>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-emerald-400">
              {filteredPlaces.length} locais encontrados no raio de {maxRadiusKm}km
            </div>
          </div>

          {/* Interactive Pins on Map Canvas */}
          <div className="relative z-10 my-auto h-52 w-full flex items-center justify-center">
            {/* User Center Pin */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-ping"></span>
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-lg ring-4 ring-white/30 z-20">
                🐕
              </div>
              <span className="absolute -bottom-5 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-md whitespace-nowrap">
                Você e seu pet
              </span>
            </div>

            {/* Floating Dynamic Markers */}
            {filteredPlaces.map((pl, idx) => {
              // Distribute pins visually around center
              const angle = (idx * (360 / Math.max(1, filteredPlaces.length))) * (Math.PI / 180);
              const distance = 70 + (idx % 3) * 35;
              const posX = Math.cos(angle) * distance;
              const posY = Math.sin(angle) * (distance * 0.7);
              const isSelected = activePlace?.id === pl.id;

              return (
                <button
                  key={pl.id}
                  onClick={() => setActivePlace(pl)}
                  style={{
                    transform: `translate(${posX}px, ${posY}px)`,
                  }}
                  className={`absolute z-20 p-1.5 rounded-xl shadow-lg transition-all transform hover:scale-110 flex items-center gap-1.5 ${getPinColor(
                    pl.type
                  )} ${isSelected ? 'ring-4 ring-white scale-110' : 'opacity-90'}`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold whitespace-nowrap max-w-[90px] truncate">{pl.name}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Map Active Place Snippet */}
          {activePlace && (
            <div className="relative z-10 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={activePlace.image} alt={activePlace.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {getCategoryLabel(activePlace.type)} • {activePlace.distanceKm} km
                  </span>
                  <h4 className="font-bold text-sm text-white truncate max-w-[200px] sm:max-w-xs">{activePlace.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{activePlace.rating}</span>
                    <span className="text-slate-400">({activePlace.reviewCount} avaliações)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(activePlace.address + ' ' + activePlace.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Traçar Rota</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Directory List of Places & Trainers (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
              <MapPin className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Nenhum local encontrado no raio selecionado</p>
              <p className="text-xs text-slate-500 mt-1">Aumente o raio de busca ou experimente outra categoria.</p>
            </div>
          ) : (
            filteredPlaces.map(place => {
              const isSelected = activePlace?.id === place.id;
              const isBooked = bookingSuccessPlaceId === place.id;

              return (
                <div
                  key={place.id}
                  id={`place-item-${place.id}`}
                  onClick={() => setActivePlace(place)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-800/90 shadow-xs ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-3">
                    <img src={place.image} alt={place.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {place.categoryTitle}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                          {place.distanceKm} km
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{place.name}</h4>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{place.rating}</span>
                        </div>
                        <span>•</span>
                        <span className="truncate">{place.neighborhood}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{place.openHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialized Trainer Info if Available */}
                  {place.trainerDetails && (
                    <div className="mt-3 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-3 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between text-indigo-950 dark:text-indigo-200">
                        <div className="flex items-center gap-1.5 font-bold">
                          <GraduationCap className="w-4 h-4 text-indigo-600" />
                          <span>{place.trainerDetails.experienceYears} anos de experiência</span>
                        </div>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          R$ {place.trainerDetails.hourlyRate.toFixed(2)}/aula
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {place.trainerDetails.specialties.map((spec, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded-md text-[10px] font-semibold text-slate-700 dark:text-slate-300 border">
                            {spec}
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                        "{place.trainerDetails.bio}"
                      </p>
                    </div>
                  )}

                  {/* Contact / Route Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${place.phone.replace(/\D/g, '')}`}
                        onClick={e => e.stopPropagation()}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1"
                        title="Ligar"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      {place.whatsapp && (
                        <a
                          href={`https://wa.me/55${place.whatsapp}?text=${encodeURIComponent('Olá! Encontrei seu perfil no aplicativo AuAu Care e gostaria de tirar uma dúvida sobre atendimento para meu cão.')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 text-xs font-semibold flex items-center gap-1"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleBookTrainerOrService(place);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isBooked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900'
                      }`}
                    >
                      {isBooked ? 'Agendado! (+80 pts)' : place.type === 'trainer' ? 'Agendar Avaliação' : 'Ver Serviços'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
