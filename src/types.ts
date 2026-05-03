export interface UserProfile {
  id: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  role: 'user' | 'creator' | 'admin';
  earnings: number;
  createdAt: Date | string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  creatorName: string;
  category: 'productivity' | 'trading' | 'creative' | 'technical' | 'social';
  price: number;
  instructions: string;
  capabilities: string[];
  rating: number;
  salesCount: number;
  imageUrl?: string;
  createdAt: Date | string;
}

export interface Deployment {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  status: 'active' | 'paused' | 'stopped';
  lastRun: Date | string;
  purchasedAt: Date | string;
}

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  agentId: string;
  amount: number;
  timestamp: Date | string;
}
