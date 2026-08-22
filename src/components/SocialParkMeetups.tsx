import React, { useState } from 'react';
import { Pet, SocialPost, ParkMeetup } from '../types';
import { Users, Heart, MessageSquare, Plus, MapPin, Calendar, Clock, Sparkles, Share2, Send, CheckCircle2, Image } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  pet: Pet;
  posts: SocialPost[];
  meetups: ParkMeetup[];
  onSavePosts: (posts: SocialPost[]) => void;
  onSaveMeetups: (meetups: ParkMeetup[]) => void;
  onAddPoints: (amount: number, reason: string) => void;
}

export const SocialParkMeetups: React.FC<Props> = ({
  pet,
  posts,
  meetups,
  onSavePosts,
  onSaveMeetups,
  onAddPoints,
}) => {
  const [activeSection, setActiveSection] = useState<'meetups' | 'feed'>('meetups');
  const [showCreateMeetupModal, setShowCreateMeetupModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // New Post state
  const [postCaption, setPostCaption] = useState('');
  const [postLocation, setPostLocation] = useState('Parque Ibirapuera');
  const [postTag, setPostTag] = useState<SocialPost['tag']>('parque');

  // New Meetup state
  const [meetupTitle, setMeetupTitle] = useState('');
  const [meetupPark, setMeetupPark] = useState('Parque Ibirapuera (Portão 6)');
  const [meetupDate, setMeetupDate] = useState('Sábado, 05 de Setembro');
  const [meetupTime, setMeetupTime] = useState('15:00 às 17:30');
  const [meetupTarget, setMeetupTarget] = useState('Todos os portes e raças');
  const [meetupDesc, setMeetupDesc] = useState('');

  // Comment input state
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleToggleLike = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const hasLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked,
          likes: hasLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    });
    onSavePosts(updated);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              author: pet.emergencyContact.ownerName,
              petName: pet.name,
              avatar: pet.avatar,
              text,
              timestamp: 'Agora mesmo',
            },
          ],
        };
      }
      return p;
    });

    onSavePosts(updated);
    setCommentInputs({ ...commentInputs, [postId]: '' });
    onAddPoints(20, 'Comentário na comunidade');
  };

  const handleToggleJoinMeetup = (meetupId: string) => {
    const updated = meetups.map(m => {
      if (m.id === meetupId) {
        const isJoined = !m.isJoined;
        let participants = [...m.participants];
        if (isJoined) {
          participants.push({
            id: `p-${pet.id}`,
            ownerName: pet.emergencyContact.ownerName,
            petName: pet.name,
            petBreed: pet.breed,
            avatar: pet.avatar,
          });
          onAddPoints(100, `Presença confirmada no ${m.title}`);
          confetti({ particleCount: 50, spread: 55, origin: { y: 0.6 } });
        } else {
          participants = participants.filter(p => p.id !== `p-${pet.id}`);
        }
        return { ...m, isJoined, participants };
      }
      return m;
    });

    onSaveMeetups(updated);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postCaption.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorPet: {
        name: pet.name,
        breed: pet.breed,
        avatar: pet.avatar,
        ownerName: pet.emergencyContact.ownerName,
      },
      locationName: postLocation,
      timestamp: 'Agora mesmo',
      imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      caption: postCaption,
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: [],
      tag: postTag,
    };

    onSavePosts([newPost, ...posts]);
    onAddPoints(80, 'Publicação no feed');
    setShowCreatePostModal(false);
    setPostCaption('');
    confetti({ particleCount: 40, spread: 45 });
  };

  const handleCreateMeetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetupTitle.trim() || !meetupDesc.trim()) return;

    const newMeetup: ParkMeetup = {
      id: `meet-${Date.now()}`,
      title: meetupTitle,
      parkName: meetupPark,
      address: 'Área pet friendly cercada do parque',
      city: 'São Paulo - SP',
      date: meetupDate,
      time: meetupTime,
      organizer: {
        name: pet.emergencyContact.ownerName,
        petName: pet.name,
        avatar: pet.avatar,
      },
      targetBreedOrSize: meetupTarget,
      description: meetupDesc,
      participants: [
        {
          id: `p-${pet.id}`,
          ownerName: pet.emergencyContact.ownerName,
          petName: pet.name,
          petBreed: pet.breed,
          avatar: pet.avatar,
        },
      ],
      isJoined: true,
      status: 'upcoming',
    };

    onSaveMeetups([newMeetup, ...meetups]);
    onAddPoints(150, 'Novo encontro no parque criado');
    setShowCreateMeetupModal(false);
    setMeetupTitle('');
    setMeetupDesc('');
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div id="social-park-meetups-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20">
              Cãomunidade AuAu Care
            </span>
          </div>
          <h2 className="text-2xl font-black">Encontros no Parque & Rede Social</h2>
          <p className="text-xs text-emerald-100 max-w-xl">
            Conecte seu cão a outros aumigos da região, marque passeios em grupo e compartilhe momentos inesquecíveis.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowCreateMeetupModal(true)}
            className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Criar Encontro no Parque</span>
          </button>
          <button
            onClick={() => setShowCreatePostModal(true)}
            className="bg-emerald-900/60 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <Image className="w-4 h-4" />
            <span>Novo Post</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveSection('meetups')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'meetups'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Encontros nos Parques ({meetups.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('feed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'feed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Feed dos Aumigos ({posts.length})</span>
        </button>
      </div>

      {/* SECTION: Park Meetups */}
      {activeSection === 'meetups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {meetups.map(meetup => (
            <div
              key={meetup.id}
              id={`meetup-card-${meetup.id}`}
              className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {meetup.targetBreedOrSize}
                  </span>
                  {meetup.isJoined && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Presença Confirmada
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-snug">
                  {meetup.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{meetup.parkName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{meetup.date} • {meetup.time}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/40 p-3 rounded-xl">
                  {meetup.description}
                </p>

                {/* Attendees list */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {meetup.participants.length} cãezinhos confirmados
                    </span>
                    <span className="text-slate-400">Organizado por {meetup.organizer.name} ({meetup.organizer.petName})</span>
                  </div>

                  <div className="flex items-center -space-x-2 overflow-hidden py-1">
                    {meetup.participants.map(part => (
                      <img
                        key={part.id}
                        src={part.avatar}
                        alt={part.petName}
                        title={`${part.petName} (${part.petBreed}) - Tutor: ${part.ownerName}`}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(meetup.parkName + ' ' + meetup.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Ver Parque no GPS
                </a>

                <button
                  onClick={() => handleToggleJoinMeetup(meetup.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                    meetup.isJoined
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {meetup.isJoined ? 'Cancelar Presença' : 'Confirmar Presença com meu Pet (+100 pts)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION: Social Feed */}
      {activeSection === 'feed' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map(post => (
            <div
              key={post.id}
              id={`feed-post-${post.id}`}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorPet.avatar}
                    alt={post.authorPet.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {post.authorPet.name} <span className="text-xs font-normal text-slate-400">({post.authorPet.breed})</span>
                    </h4>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      <span>{post.locationName}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  #{post.tag}
                </span>
              </div>

              {/* Post Image if exists */}
              {post.imageUrl && (
                <div className="w-full bg-slate-900 max-h-96 overflow-hidden">
                  <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Post Body & Actions */}
              <div className="p-4 space-y-3 text-sm">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs sm:text-sm">
                  {post.caption}
                </p>

                {/* Like and comment counters */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/80">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      post.hasLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-600' : ''}`} />
                    <span>{post.likes} aumigos curtiram</span>
                  </button>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} comentários</span>
                  </span>
                </div>

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 pt-2 bg-slate-50 dark:bg-slate-700/40 p-3 rounded-xl">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex items-start gap-2 text-xs">
                        <img src={comment.avatar} alt={comment.petName} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200 mr-1.5">{comment.petName}:</span>
                          <span className="text-slate-600 dark:text-slate-300">{comment.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder={`Comentar como ${pet.name}...`}
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-700 text-slate-800 dark:text-white"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Meetup */}
      {showCreateMeetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Organizar Encontro no Parque</h3>
              <button onClick={() => setShowCreateMeetupModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateMeetup} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Título do Encontro</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tarde de Brincadeiras no Parcão"
                  value={meetupTitle}
                  onChange={e => setMeetupTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Parque / Local</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Parque Ibirapuera, Parque Villa-Lobos"
                  value={meetupPark}
                  onChange={e => setMeetupPark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Data</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sábado, 12 de Setembro"
                    value={meetupDate}
                    onChange={e => setMeetupDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Horário</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 15:30 às 18:00"
                    value={meetupTime}
                    onChange={e => setMeetupTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Público Alvo (Raça ou Porte)</label>
                <input
                  type="text"
                  placeholder="Ex: Todos os cães dóceis, Golden Retrievers, Filhotes"
                  value={meetupTarget}
                  onChange={e => setMeetupTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Descrição e Recomendações</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tragam petiscos, água e brinquedos!"
                  value={meetupDesc}
                  onChange={e => setMeetupDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateMeetupModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Criar Encontro (+150 AuCoins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Post */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Publicar Foto no Feed</h3>
              <button onClick={() => setShowCreatePostModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Legenda / O que seu cãozinho aprontou hoje?</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Dia de banho e passeio no parque! Amamos a coleira nova!"
                  value={postCaption}
                  onChange={e => setPostCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Localização</label>
                  <input
                    type="text"
                    value={postLocation}
                    onChange={e => setPostLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Categoria / Tag</label>
                  <select
                    value={postTag}
                    onChange={e => setPostTag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-slate-800 dark:text-white text-xs"
                  >
                    <option value="parque">#parque</option>
                    <option value="socializacao">#socializacao</option>
                    <option value="passeio">#passeio</option>
                    <option value="conquista">#conquista</option>
                    <option value="dica">#dica</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Publicar (+80 AuCoins)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
