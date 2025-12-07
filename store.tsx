import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Case, Message, UserRole, CaseStatus, Notification } from './types';
import { supabase } from './services/supabaseClient';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cases: Case[];
  notifications: Notification[];
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: Omit<User, 'id' | 'createdAt' | 'avatar'>, password?: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  createCase: (data: { title: string; description: string; area: string; city: string; uf: string }) => Promise<void>;
  acceptCase: (caseId: string) => Promise<void>;
  sendMessage: (caseId: string, content: string, type?: 'text' | 'image' | 'file') => Promise<void>;
  verifyLawyer: (userId: string) => Promise<void>;
  closeCase: (caseId: string, rating: number, comment: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [session, setSession] = useState<any>(null);

  // 1. Monitorar estado de autenticação
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchUserProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setCases([]);
        setNotifications([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Buscar dados quando o usuário estiver logado
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
      fetchCases();
      fetchNotifications();

      // Configurar Realtime para atualizações (básico)
      const channel = supabase
        .channel('public_updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, () => fetchCases())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchCases()) // Recarrega casos para pegar msgs novas
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUsers())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUser?.id]);

  // --- FUNÇÕES DE BUSCA ---

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
    } else if (data) {
      // Mapear campos snake_case do banco para camelCase do User
      setCurrentUser({
        ...data,
        createdAt: data.created_at,
        oab: data.oab || undefined,
        verified: data.verified || false
      });
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) {
      setUsers(data.map((u: any) => ({ ...u, createdAt: u.created_at })));
    }
  };

  const fetchCases = async () => {
    const { data: casesData, error } = await supabase
      .from('cases')
      .select(`
        *,
        messages (*)
      `)
      .order('created_at', { ascending: false });

    if (casesData) {
      const formattedCases: Case[] = casesData.map((c: any) => ({
        id: c.id,
        clientId: c.client_id,
        lawyerId: c.lawyer_id,
        title: c.title,
        description: c.description,
        area: c.area,
        status: c.status as CaseStatus,
        city: c.city,
        uf: c.uf,
        createdAt: c.created_at,
        feedback: c.feedback_rating ? { rating: c.feedback_rating, comment: c.feedback_comment } : undefined,
        messages: (c.messages || []).map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          content: m.content,
          type: m.type,
          fileUrl: m.file_url,
          timestamp: m.timestamp
        })).sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      }));
      setCases(formattedCases);
    }
  };

  const fetchNotifications = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('timestamp', { ascending: false });
    
    if (data) {
      setNotifications(data);
    }
  };

  // --- AÇÕES ---

  const login = async (email: string, role: UserRole, password?: string) => {
    const pwd = password || '123456';
    
    // Tentativa normal de login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd, 
    });

    // Se der erro e for o ADMIN padrão, tentamos criar a conta automaticamente (Auto-Repair)
    if (error) {
      if (email === 'admin@socialjuris.com' && error.message.includes('Invalid login credentials')) {
        console.log("Admin não encontrado. Tentando criar automaticamente...");
        
        // Tenta criar o usuário no Auth
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: 'admin@socialjuris.com',
          password: pwd,
        });

        if (!signUpError && signUpData.user) {
           // Cria o perfil na tabela profiles
           await supabase.from('profiles').upsert({
              id: signUpData.user.id,
              email: 'admin@socialjuris.com',
              name: 'Administrador',
              role: 'ADMIN',
              verified: true,
              avatar: `https://ui-avatars.com/api/?name=Admin&background=random`,
              created_at: new Date().toISOString()
           });
           
           // Se criou com sucesso, força o fetch do perfil para logar a UI
           await fetchUserProfile(signUpData.user.id);
           alert("✅ Conta de Admin criada automaticamente e logada!");
           return;
        }
      }

      // Tratamento de erro padrão
      if (error.message.includes("Email not confirmed")) {
         alert("⚠️ ACESSO BLOQUEADO: EMAIL NÃO CONFIRMADO\n\nO Supabase exige confirmação de email por padrão.\n\nCOMO RESOLVER:\n1. Verifique sua caixa de entrada e clique no link.\nOU\n2. No painel do Supabase, vá em 'Authentication' > 'Providers' > 'Email' e desmarque 'Confirm email'.");
      } else {
         alert("Erro ao entrar: " + error.message);
      }
      throw error;
    }
    // Sucesso no login normal
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'avatar'>, password?: string) => {
    if (!password) {
        alert("Senha é obrigatória");
        return;
    }

    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
    });

    if (authError) {
      alert("Erro no cadastro: " + authError.message);
      throw authError;
    }

    if (authData.user) {
      // 2. Criar perfil na tabela profiles (Upsert para evitar erros se usuario ja tentou antes)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        oab: userData.role === 'LAWYER' ? userData.oab : null,
        verified: userData.role === 'CLIENT', // Clientes já nascem verificados
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`,
        created_at: new Date().toISOString()
      });

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        alert("Erro ao criar perfil: " + profileError.message);
      } else {
        if (!authData.session) {
            // Se não tem sessão, é porque o Supabase está aguardando confirmação de email
            alert("✅ Cadastro realizado!\n\n⚠️ Se você não desativou a confirmação de email no Supabase, verifique sua caixa de entrada.");
        } else {
             // Força um fetch imediato para garantir que a UI atualize sem precisar de reload
             await fetchUserProfile(authData.user.id);
        }
      }
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        oab: data.oab
      })
      .eq('id', currentUser.id);

    if (error) alert("Erro ao atualizar: " + error.message);
    else {
        alert("Perfil atualizado!");
        fetchUserProfile(currentUser.id);
    }
  };

  const createCase = async (data: { title: string; description: string; area: string; city: string; uf: string }) => {
    if (!currentUser) return;
    
    const { data: newCase, error } = await supabase
      .from('cases')
      .insert({
        client_id: currentUser.id,
        title: data.title,
        description: data.description,
        area: data.area,
        city: data.city,
        uf: data.uf,
        status: 'OPEN'
      })
      .select()
      .single();

    if (!error && newCase) {
      // Adicionar mensagem de sistema
      await supabase.from('messages').insert({
        case_id: newCase.id,
        sender_id: currentUser.id, // Tecnicamente sistema, mas usamos ID válido para FK
        content: `Caso criado em ${new Date().toLocaleDateString()} em ${data.city}/${data.uf}. Aguardando advogado.`,
        type: 'system'
      });
      fetchCases();
    } else {
        console.error("Erro ao criar caso:", error);
        alert("Erro ao criar caso. Verifique se as colunas 'city' e 'uf' foram criadas no Supabase.");
    }
  };

  const acceptCase = async (caseId: string) => {
    if (!currentUser || currentUser.role !== UserRole.LAWYER) return;

    const { error } = await supabase
      .from('cases')
      .update({
        lawyer_id: currentUser.id,
        status: 'ACTIVE'
      })
      .eq('id', caseId);

    if (!error) {
      // Notificar cliente
      const targetCase = cases.find(c => c.id === caseId);
      if (targetCase) {
        await supabase.from('notifications').insert({
            user_id: targetCase.clientId,
            title: 'Advogado Aceitou',
            message: `O Dr(a). ${currentUser.name} aceitou seu caso.`,
            type: 'success'
        });
        
        await supabase.from('messages').insert({
            case_id: caseId,
            sender_id: currentUser.id,
            content: `O advogado ${currentUser.name} aceitou o caso.`,
            type: 'system'
        });
      }
      fetchCases();
    }
  };

  const sendMessage = async (caseId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!currentUser) return;

    await supabase.from('messages').insert({
        case_id: caseId,
        sender_id: currentUser.id,
        content,
        type,
        file_url: type !== 'text' ? 'https://picsum.photos/400/300' : null // Mock de upload real para simplificar
    });
    fetchCases();
  };

  const verifyLawyer = async (userId: string) => {
    await supabase
        .from('profiles')
        .update({ verified: true })
        .eq('id', userId);

    await supabase.from('notifications').insert({
        user_id: userId,
        title: 'Perfil Verificado',
        message: 'Sua conta foi aprovada pela administração.',
        type: 'success'
    });
    fetchUsers();
  };

  const closeCase = async (caseId: string, rating: number, comment: string) => {
    await supabase
        .from('cases')
        .update({
            status: 'CLOSED',
            feedback_rating: rating,
            feedback_comment: comment
        })
        .eq('id', caseId);
    fetchCases();
  };

  const markNotificationAsRead = async (id: string) => {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      fetchNotifications();
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