export enum UserRole {
  CLIENT = 'CLIENT',
  LAWYER = 'LAWYER',
  ADMIN = 'ADMIN'
}

export enum CaseStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  verified?: boolean; // For lawyers
  oab?: string; // For lawyers
  specialties?: string[]; // For lawyers
  phone?: string;
  bio?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
}

export interface Case {
  id: string;
  clientId: string;
  lawyerId?: string;
  title: string;
  description: string;
  area: string;
  status: CaseStatus;
  createdAt: string;
  messages: Message[];
  feedback?: {
    rating: number;
    comment: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export interface DashboardStats {
  activeCases: number;
  completedCases: number;
  totalRevenue?: number; // Simulated for lawyers
  pendingVerifications?: number; // For admin
}