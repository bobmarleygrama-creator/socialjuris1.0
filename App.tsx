import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store';
import { UserRole } from './types';
import { Landing } from './components/Landing';
import { ClientDashboard, LawyerDashboard, AdminDashboard } from './components/Dashboards';
import { Loader2, Mail, Lock, User, Briefcase, ChevronRight } from 'lucide-react';

const AuthScreen = ({ type, role, onBack }: { type: 'login' | 'register'; role: UserRole; onBack: () => void }) => {
  const { login, register } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [oab, setOab] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill admin credentials for convenience if Admin role is selected
  useEffect(() => {
    if (role === UserRole.ADMIN && type === 'login') {
      setEmail('admin@socialjuris.com');
    } else {
      setEmail('');
    }
    setPassword('');
  }, [role, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (type === 'login') {
        login(email, role);
      } else {
        register({
          name,
          email,
          role,
          oab: role === UserRole.LAWYER ? oab : undefined,
          verified: role === UserRole.LAWYER ? false : true // Clients auto-verified
        });
      }
      setLoading(false);
    }, 1000);
  };

  const getRoleTitle = () => {
    switch (role) {
      case UserRole.CLIENT: return 'Clientes';
      case UserRole.LAWYER: return 'Advogados';
      case UserRole.ADMIN: return 'Administradores';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
       <button onClick={onBack} className="absolute top-8 left-8 text-slate-500 hover:text-indigo-600 font-medium transition flex items-center">
         <span className="mr-1">←</span> Voltar
       </button>
       
       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{type === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
            <p className="text-slate-500">Acesso para <span className="text-indigo-600 font-semibold">{getRoleTitle()}</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
             {type === 'register' && (
               <div className="space-y-1">
                 <label className="text-sm font-medium text-slate-700 ml-1">Nome Completo</label>
                 <div className="relative">
                   <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                   <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" placeholder="Seu nome" />
                 </div>
               </div>
             )}
             
             <div className="space-y-1">
                 <label className="text-sm font-medium text-slate-700 ml-1">Email</label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                   <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" placeholder="nome@exemplo.com" />
                 </div>
             </div>

             <div className="space-y-1">
                 <label className="text-sm font-medium text-slate-700 ml-1">Senha</label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                   <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" placeholder="••••••••" />
                 </div>
             </div>

             {type === 'register' && role === UserRole.LAWYER && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 ml-1">Registro OAB</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input required type="text" value={oab} onChange={e => setOab(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" placeholder="UF-123456" />
                  </div>
                </div>
             )}

             <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center">
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (type === 'login' ? 'Entrar' : 'Cadastrar')}
             </button>
          </form>

          {type === 'login' && role === UserRole.ADMIN && (
             <div className="mt-6 text-center text-xs text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200">
               <span className="font-bold">Dica de Acesso:</span> O sistema preencheu o email automaticamente. Use qualquer senha para entrar.
             </div>
          )}
       </div>
    </div>
  );
};

const MainApp = () => {
  const { currentUser } = useApp();
  const [authView, setAuthView] = useState<{ type: 'login' | 'register', role: UserRole } | null>(null);

  if (currentUser) {
    switch (currentUser.role) {
      case UserRole.CLIENT: return <ClientDashboard />;
      case UserRole.LAWYER: return <LawyerDashboard />;
      case UserRole.ADMIN: return <AdminDashboard />;
      default: return <div>Erro: Papel desconhecido</div>;
    }
  }

  if (authView) {
    return <AuthScreen type={authView.type} role={authView.role} onBack={() => setAuthView(null)} />;
  }

  return <Landing onAuth={(type, role) => setAuthView({ type, role })} />;
};

const App = () => (
  <AppProvider>
    <MainApp />
  </AppProvider>
);

export default App;