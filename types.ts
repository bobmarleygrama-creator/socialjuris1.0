
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
  verified?: boolean;
  isPremium?: boolean;
  oab?: string;
  specialties?: string[];
  phone?: string;
  bio?: string;
  balance?: number;
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
  city?: string;
  uf?: string;
  createdAt: string;
  messages: Message[];
  price?: number;
  complexity?: 'Baixa' | 'Média' | 'Alta';
  isPaid?: boolean;
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
  totalRevenue?: number; 
  pendingVerifications?: number; 
}

export interface StrategyAnalysis {
  weaknesses: string[];
  counterArguments: string[];
  winProbability: string; 
  winProbabilityValue: number;
  recommendedFocus: string;
  jurisprudence: { title: string; summary: string }[];
}

// --- TIPOS AVANÇADOS PARA CALCULADORA FORENSE ---

export type CalculatorType = 'CIVIL' | 'LABOR' | 'TAX' | 'FAMILY' | 'CRIMINAL' | 'RENT' | 'CONSUMER';

export interface CalculationLineItem {
  description: string; // Ex: "Principal Corrigido", "Juros Moratórios (1% a.m)"
  value: number; // Valor final da linha ou Quantidade de Dias (para Penal)
  details?: string; // Ex: "R$ 10.000 x 1.05 (IGPM)"
  isTotal?: boolean; // Se é uma linha de soma
  isDeduction?: boolean; // Se é um desconto
  unit?: string; // 'R$' ou 'Dias/Anos'
}

export interface CalculationResult {
  type: CalculatorType;
  
  // Resumo Financeiro ou Temporal
  originalValue: number | string; // Pode ser valor R$ ou string de tempo "5 anos"
  updatedValue: number | string;
  
  // Metadados Processuais
  indexUsed?: string;
  timeInMonths?: number;
  
  // Memória de Cálculo (Tabela Detalhada)
  memoryGrid: CalculationLineItem[];

  // Dados Específicos para Gráficos
  chartData: { 
      label: string; 
      value: number; 
  }[];
}
