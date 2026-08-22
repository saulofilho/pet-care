export type PetSpecies = 'dog' | 'cat';

export interface Vaccine {
  id: string;
  name: string;
  type: 'essential' | 'recommended' | 'optional';
  dateAdministered?: string;
  nextDueDate: string;
  status: 'up_to_date' | 'due_soon' | 'overdue' | 'scheduled';
  administeredBy?: string;
  batchNumber?: string;
  clinic?: string;
  notes?: string;
}

export interface Deworming {
  id: string;
  productName: string;
  type: 'dewormer' | 'flea_tick' | 'all_in_one';
  dateAdministered: string;
  nextDueDate: string;
  weightAtTime?: number;
  frequencyMonths: number;
  status: 'up_to_date' | 'due_soon' | 'overdue';
  notes?: string;
}

export interface MedicalConsultation {
  id: string;
  date: string;
  veterinarian: string;
  clinic: string;
  reason: string;
  diagnosis: string;
  prescriptions: string[];
  notes?: string;
  cost?: number;
  followUpDate?: string;
}

export interface MedicalExam {
  id: string;
  date: string;
  title: string;
  category: 'blood' | 'xray' | 'ultrasound' | 'biopsy' | 'urine' | 'cardiac' | 'other';
  laboratory: string;
  resultsSummary: string;
  status: 'normal' | 'altered' | 'critical';
  fileUrl?: string;
  fileName?: string;
}

export interface AllergyAndCondition {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  type: 'food' | 'medication' | 'environmental';
  treatment?: string;
}

export interface WeightRecord {
  date: string;
  weightKg: number;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  birthDate: string;
  gender: 'male' | 'female';
  neutered: boolean;
  avatar: string;
  weightKg: number;
  weightHistory: WeightRecord[];
  microchipId?: string;
  bloodType?: string;
  pedigree?: string;
  emergencyContact: {
    ownerName: string;
    phone: string;
    secondaryPhone?: string;
    primaryVetName: string;
    primaryVetPhone: string;
    clinic24h: string;
    clinic24hPhone: string;
    clinic24hAddress: string;
  };
  allergies: AllergyAndCondition[];
  chronicConditions: string[];
  continuousMedications: string[];
  vaccines: Vaccine[];
  dewormingHistory: Deworming[];
  consultations: MedicalConsultation[];
  exams: MedicalExam[];
}

export interface PlaceLocation {
  id: string;
  name: string;
  type: 'petshop' | 'vet24h' | 'trainer' | 'dogpark' | 'hotel';
  categoryTitle: string;
  address: string;
  neighborhood: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  isOpenNow: boolean;
  openHours: string;
  phone: string;
  whatsapp?: string;
  image: string;
  tags: string[];
  latitude: number;
  longitude: number;
  trainerDetails?: {
    specialties: string[];
    experienceYears: number;
    hourlyRate: number;
    certifications: string[];
    bio: string;
  };
  services?: string[];
}

export interface SocialPost {
  id: string;
  authorPet: {
    name: string;
    breed: string;
    avatar: string;
    ownerName: string;
  };
  locationName: string;
  timestamp: string;
  imageUrl?: string;
  caption: string;
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  comments: {
    id: string;
    author: string;
    petName: string;
    avatar: string;
    text: string;
    timestamp: string;
  }[];
  tag: 'parque' | 'socializacao' | 'passeio' | 'dica' | 'conquista';
}

export interface ParkMeetup {
  id: string;
  title: string;
  parkName: string;
  address: string;
  city: string;
  date: string;
  time: string;
  organizer: {
    name: string;
    petName: string;
    avatar: string;
  };
  targetBreedOrSize: string;
  description: string;
  participants: {
    id: string;
    ownerName: string;
    petName: string;
    petBreed: string;
    avatar: string;
  }[];
  maxParticipants?: number;
  isJoined?: boolean;
  status: 'upcoming' | 'happening_now' | 'finished';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'racao' | 'brinquedos' | 'petiscos' | 'farmacia' | 'higiene' | 'acessorios';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  dogSizeTarget: 'all' | 'small' | 'medium' | 'large';
  inStock: boolean;
  pointsEarned: number;
  isBestSeller?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface RewardCoupon {
  id: string;
  title: string;
  discountDescription: string;
  pointsCost: number;
  category: 'shop' | 'vet' | 'bath' | 'trainer';
  code: string;
  expiresInDays: number;
  isUnlocked?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'health' | 'social' | 'shop' | 'daily';
  isCompleted: boolean;
  actionKey: string;
}

export interface UserRewards {
  pointsBalance: number;
  totalPointsEarned: number;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  tierProgress: number; // 0 to 100
  redeemedCoupons: {
    couponId: string;
    code: string;
    title: string;
    redeemedAt: string;
  }[];
  completedMissions: string[];
  streakDays: number;
}

export interface VetMessage {
  id: string;
  sender: 'user' | 'vet' | 'system';
  vetName?: string;
  vetCrmv?: string;
  vetAvatar?: string;
  text: string;
  timestamp: string;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency';
  attachments?: {
    type: 'image' | 'report';
    url: string;
    name: string;
  }[];
  recommendationCard?: {
    title: string;
    items: string[];
    actionRequired?: string;
  };
}
