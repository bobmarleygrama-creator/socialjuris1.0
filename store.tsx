import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Case, Message, UserRole, CaseStatus, Notification } from './types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin System', email: 'admin@socialjuris.com', role: UserRole.ADMIN, avatar: 'https://picsum.photos/id/1/200/200', createdAt: new Date().toISOString() },
  { id: '2', name: 'Dr. Roberto Silva', email: 'roberto@law.com', role: UserRole.LAWYER, verified: true, oab: 'SP-123456', specialties: ['Civil', 'Trabalhista'], bio: 'Especialista em causas trabalhistas com 10 anos de experiência.', avatar: 'https://picsum.photos/id/1025/200/200', createdAt: new Date().toISOString() },
  { id: '3', name: 'Maria Oliveira', email: 'maria@client.com', role: UserRole.CLIENT, phone: '(11) 99999-8888', avatar: 'https://picsum.photos/id/1027/200/200', createdAt: new Date().toISOString() },
];

const MOCK_CASES: Case[] = [
  {
    id: 'c1',
    clientId: '3',
    lawyerId: '2',
    title: 'Ação de Cobrança Indevida',
    description: 'Recebi uma cobrança de um serviço que já cancelei há 3 meses.',
    area: 'Direito do Consumidor',
    status: CaseStatus.ACTIVE,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    messages: [
      { id: 'm1', senderId: '3', content: 'Doutor, anexei os comprovantes.', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'text' },
      { id: 'm2', senderId: '2', content: 'Perfeito, Maria. Vou analisar hoje ainda.', timestamp: new Date(Date.now() - 80000000).toISOString(), type: 'text' }
    ]
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: '3', title: 'Boas-vindas', message: 'Bem-vindo ao SocialJuris! Complete seu perfil.', read: false, timestamp: new Date().toISOString(), type: 'info' },
  { id: 'n2', userId: '2', title: 'Nova Oportunidade', message: 'Um novo caso em Direito do Consumidor está disponível.', read: false, timestamp: new Date().toISOString(), type: 'success' }
];

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cases: Case[];
  notifications: Notification[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'createdAt' | 'avatar'>) => void;
  updateProfile: (data: Partial<User>) => void;
  createCase: (data: { title: string; description: string; area: string }) => void;
  acceptCase: (caseId: string) => void;
  sendMessage: (caseId: string, content: string, type?: 'text' | 'image' | 'file') => void;
  verifyLawyer: (userId: string) => void;
  closeCase: (caseId: string, rating: number, comment: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [cases, setCases] = useState<Case[]>(MOCK_CASES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const login = (email: string, role: UserRole) => {
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
    } else {
      alert("Usuário não encontrado. Tente registrar-se ou verifique as credenciais.");
    }
  };

  const logout = () => setCurrentUser(null);

  const register = (userData: Omit<User, 'id' | 'createdAt' | 'avatar'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      avatar: `https://picsum.photos/seed/${Math.random()}/200/200`
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    alert("Perfil atualizado com sucesso!");
  };

  const createCase = (data: { title: string; description: string; area: string }) => {
    if (!currentUser) return;
    const newCase: Case = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: currentUser.id,
      ...data,
      status: CaseStatus.OPEN,
      createdAt: new Date().toISOString(),
      messages: [{
        id: Math.random().toString(36).substr(2, 9),
        senderId: 'SYSTEM',
        content: `Caso criado em ${new Date().toLocaleDateString()}. Aguardando advogado.`,
        timestamp: new Date().toISOString(),
        type: 'system'
      }]
    };
    setCases([newCase, ...cases]);
  };

  const acceptCase = (caseId: string) => {
    if (!currentUser || currentUser.role !== UserRole.LAWYER) return;
    
    // Find client to notify
    const targetCase = cases.find(c => c.id === caseId);
    if(targetCase) {
        const notif: Notification = {
            id: Math.random().toString(),
            userId: targetCase.clientId,
            title: 'Advogado Aceitou',
            message: `O Dr(a). ${currentUser.name} aceitou seu caso: ${targetCase.title}.`,
            read: false,
            timestamp: new Date().toISOString(),
            type: 'success'
        };
        setNotifications([notif, ...notifications]);
    }

    setCases(cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          lawyerId: currentUser.id,
          status: CaseStatus.ACTIVE,
          messages: [...c.messages, {
            id: Math.random().toString(36),
            senderId: 'SYSTEM',
            content: `O advogado ${currentUser.name} aceitou o caso. Inicie a conversa!`,
            timestamp: new Date().toISOString(),
            type: 'system'
          }]
        };
      }
      return c;
    }));
  };

  const sendMessage = (caseId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!currentUser) return;
    setCases(cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          messages: [...c.messages, {
            id: Math.random().toString(36),
            senderId: currentUser.id,
            content,
            type,
            timestamp: new Date().toISOString(),
            fileUrl: type !== 'text' ? 'https://picsum.photos/400/300' : undefined // Mock attachment
          }]
        };
      }
      return c;
    }));
  };

  const verifyLawyer = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, verified: true } : u));
    const notif: Notification = {
        id: Math.random().toString(),
        userId: userId,
        title: 'Perfil Verificado',
        message: 'Sua conta foi aprovada pela administração. Você já pode aceitar casos.',
        read: false,
        timestamp: new Date().toISOString(),
        type: 'success'
    };
    setNotifications([notif, ...notifications]);
  };

  const closeCase = (caseId: string, rating: number, comment: string) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, status: CaseStatus.CLOSED, feedback: { rating, comment } } : c));
  };

  const markNotificationAsRead = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{ currentUser, users, cases, notifications, login, logout, register, updateProfile, createCase, acceptCase, sendMessage, verifyLawyer, closeCase, markNotificationAsRead }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};