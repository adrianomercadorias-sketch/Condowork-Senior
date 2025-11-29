import { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
}

export type EventColor = 'emerald' | 'blue' | 'red' | 'gray';

export interface EventItem {
  id: string;
  title: string;
  date: string; // "DD/MM" format
  color: EventColor;
  imageUrl?: string;
  attendees: number;
  isUserConfirmed: boolean;
}


export interface PartnerItem {
  id: string;
  role: string; // e.g., Advogado, Doação
  name: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

export interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

export interface Announcement {
  id: string;
  title: string;
  actionLabel: string;
  files?: AttachedFile[];
}

export type AdCategory = 'vagas' | 'servicos' | 'doacoes' | 'aluga';

export interface MarketplaceAd {
  id: string;
  category: AdCategory;
  title: string;
  subtitle: string; // Location for housing/parking, Role for services, Condition for donations
  date: string;
  time: string;
  price?: string;
  isOnline: boolean;
  isLiked: boolean;
  image: string;
  details?: { // Extra fields specific to categories
    bedrooms?: string;
    condition?: string;
  };
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read: boolean;
  imageUrl?: string; // Added to support image uploads
}

export interface ChatConversation {
  id: string;
  userName: string;
  userUnit: string; // ex: BL2APT503
  userAvatar: string;
  adTitle: string;
  adPrice: string;
  adImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  status: 'active' | 'archived';
  messages: ChatMessage[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
}

export interface PackageItem {
  id: string;
  type: string; // Carta, Pequeno, Médio, Grande
  code: string;
  unit: string; // Bloco + Apt
  date: string;
  status: string;
}

export interface ReportItem {
  id: string;
  unit: string;
  infractionType: string;
  description: string;
  reportedBy: string; // e.g. 'BL1APT102'
  date: string;
  status: 'Em Análise' | 'Verificado';
  files?: AttachedFile[];
}

export interface WarningItem {
  id: string;
  unit: string; // e.g. 'BL2APT503'
  infractionType: string;
  description: string;
  date: string;
  status: 'Pendente' | 'Resolvido';
  files?: AttachedFile[];
}