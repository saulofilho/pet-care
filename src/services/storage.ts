import { Pet, PlaceLocation, SocialPost, ParkMeetup, Product, UserRewards, VetMessage, RewardCoupon, Mission } from '../types';
import { INITIAL_PETS, MOCK_PLACES, MOCK_SOCIAL_POSTS, MOCK_PARK_MEETUPS, MOCK_PRODUCTS, INITIAL_USER_REWARDS, INITIAL_VET_MESSAGES, MOCK_REWARD_COUPONS, MOCK_MISSIONS } from '../mockData';

const KEYS = {
  PETS: 'auau_pets_v1',
  ACTIVE_PET_ID: 'auau_active_pet_id_v1',
  PLACES: 'auau_places_v1',
  POSTS: 'auau_posts_v1',
  MEETUPS: 'auau_meetups_v1',
  PRODUCTS: 'auau_products_v1',
  REWARDS: 'auau_rewards_v1',
  COUPONS: 'auau_coupons_v1',
  MISSIONS: 'auau_missions_v1',
  VET_CHAT: 'auau_vet_chat_v1',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Storage set error:', err);
  }
}

export const StorageService = {
  getPets(): Pet[] {
    return safeGet<Pet[]>(KEYS.PETS, INITIAL_PETS);
  },
  savePets(pets: Pet[]): void {
    safeSet(KEYS.PETS, pets);
  },
  getActivePetId(): string {
    const pets = this.getPets();
    const saved = safeGet<string>(KEYS.ACTIVE_PET_ID, pets[0]?.id || 'pet-1');
    return pets.some(p => p.id === saved) ? saved : pets[0]?.id || 'pet-1';
  },
  setActivePetId(id: string): void {
    safeSet(KEYS.ACTIVE_PET_ID, id);
  },
  updateActivePet(pet: Pet): void {
    const pets = this.getPets();
    const index = pets.findIndex(p => p.id === pet.id);
    if (index >= 0) {
      pets[index] = pet;
    } else {
      pets.push(pet);
    }
    this.savePets(pets);
  },
  getPlaces(): PlaceLocation[] {
    return safeGet<PlaceLocation[]>(KEYS.PLACES, MOCK_PLACES);
  },
  savePlaces(places: PlaceLocation[]): void {
    safeSet(KEYS.PLACES, places);
  },
  getPosts(): SocialPost[] {
    return safeGet<SocialPost[]>(KEYS.POSTS, MOCK_SOCIAL_POSTS);
  },
  savePosts(posts: SocialPost[]): void {
    safeSet(KEYS.POSTS, posts);
  },
  getMeetups(): ParkMeetup[] {
    return safeGet<ParkMeetup[]>(KEYS.MEETUPS, MOCK_PARK_MEETUPS);
  },
  saveMeetups(meetups: ParkMeetup[]): void {
    safeSet(KEYS.MEETUPS, meetups);
  },
  getProducts(): Product[] {
    return safeGet<Product[]>(KEYS.PRODUCTS, MOCK_PRODUCTS);
  },
  getRewards(): UserRewards {
    return safeGet<UserRewards>(KEYS.REWARDS, INITIAL_USER_REWARDS);
  },
  saveRewards(rewards: UserRewards): void {
    safeSet(KEYS.REWARDS, rewards);
  },
  getCoupons(): RewardCoupon[] {
    return safeGet<RewardCoupon[]>(KEYS.COUPONS, MOCK_REWARD_COUPONS);
  },
  getMissions(): Mission[] {
    return safeGet<Mission[]>(KEYS.MISSIONS, MOCK_MISSIONS);
  },
  saveMissions(missions: Mission[]): void {
    safeSet(KEYS.MISSIONS, missions);
  },
  getVetMessages(): VetMessage[] {
    return safeGet<VetMessage[]>(KEYS.VET_CHAT, INITIAL_VET_MESSAGES);
  },
  saveVetMessages(msgs: VetMessage[]): void {
    safeSet(KEYS.VET_CHAT, msgs);
  },
  addPoints(amount: number, reason?: string): UserRewards {
    const rewards = this.getRewards();
    const newBalance = rewards.pointsBalance + amount;
    const newTotal = rewards.totalPointsEarned + amount;
    
    let tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante' = 'Bronze';
    let tierProgress = 20;
    if (newTotal >= 3000) {
      tier = 'Diamante';
      tierProgress = 100;
    } else if (newTotal >= 1500) {
      tier = 'Ouro';
      tierProgress = Math.min(100, Math.round(((newTotal - 1500) / 1500) * 100));
    } else if (newTotal >= 600) {
      tier = 'Prata';
      tierProgress = Math.min(100, Math.round(((newTotal - 600) / 900) * 100));
    } else {
      tierProgress = Math.min(100, Math.round((newTotal / 600) * 100));
    }

    const updated: UserRewards = {
      ...rewards,
      pointsBalance: newBalance,
      totalPointsEarned: newTotal,
      tier,
      tierProgress,
    };
    this.saveRewards(updated);
    return updated;
  },
};
