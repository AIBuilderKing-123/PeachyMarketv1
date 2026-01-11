
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  VERIFIED = 'VERIFIED',
  VIP = 'VIP',
  DIAMOND_VIP = 'DIAMOND_VIP',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

export interface User {
  id: string;
  username: string; // Screen Name
  email: string;
  realName: string; // Full Legal Name
  role: UserRole;
  joinedAt?: string; // ISO Date String
  avatarUrl: string;
  bannerUrl?: string;
  bio?: string;
  birthMonth?: string;
  zodiac?: string;
  balance: number;
  tokens: number;
  isVerified: boolean;
  isOnline?: boolean;
  isBanned?: boolean;
  isSuspended?: boolean;
  
  // Admin Notes
  adminNotes?: string;

  // Referral & Affiliate Data
  isAffiliate?: boolean;
  referralCode?: string; // Defaults to username if not set
  referredBy?: string; // ID of the user who referred them
  referralEarnings?: number; // Total earned from 1% royalties
  bonusRevShareExpiry?: string; // ISO Date for 100% Rev Share expiration
  vipExpiry?: string; // ISO Date for free VIP expiration
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  isSticky: boolean;
  isPremiumSticky: boolean;
  autoDelivery: boolean;
  category: 'Photo' | 'Video' | 'Link' | 'Physical';
  views: number;
  liveViewers: number;
}

export interface CamMenuOption {
  id: string;
  label: string;
  cost: number;
}

export interface BookedSlot {
  userId: string;
  username: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
}

export interface CamRoom {
  id: number;
  hostId?: string;
  hostName?: string;
  viewers: number;
  isLive: boolean;
  topic?: string;
  menuOptions?: CamMenuOption[];
  bookedSlots: BookedSlot[];
}

export interface VerificationRequest {
  id: string;
  userId: string;
  legalName: string;
  dob: string;
  idPhotoUrl: string;
  selfieUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Transaction {
  id: string;
  type: 'PURCHASE' | 'DEPOSIT' | 'EARNING' | 'TIP_SENT' | 'TIP_RECEIVED' | 'WITHDRAWAL';
  amount: number; // USD Value or Token Value representation
  tokenAmount?: number;
  date: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}