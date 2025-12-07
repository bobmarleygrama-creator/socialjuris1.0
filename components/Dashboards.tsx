import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, CaseStatus, Case, User, Notification } from '../types';
import { Plus, Briefcase, MessageSquare, Check, X, Bell, User as UserIcon, LogOut, Award, DollarSign, Users, Activity, Filter, Search, Save, Settings, Phone, Mail, Shield, AlertCircle, MapPin } from 'lucide-react';
import { Chat } from './Chat';
import { analyzeCaseDescription } from '../services/geminiService';

// --- CONSTANTES ---
const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// --- SUB-COMPONENTS ---

const UserProfile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    oab: currentUser?.oab || '',
    bio: currentUser?.bio || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
           <div className="relative group">
              <img src={currentUser?.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover shadow-md" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <span className="text-white text-xs font-bold">Alterar</span>
              </div>
           </div>
           <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h2>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-500">
                  <span className="capitalize">{currentUser?.role === 'LAWYER' ? 'Advogado' : currentUser?.role === 'CLIENT' ? 'Cliente' : 'Administrador'}</span>
                  {currentUser?.verified && <Check className="w-4 h-4 text-green-500" />}
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">Nome Completo</label>
               <div className="relative">
                 <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">Email</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700">Telefone</label>
               <div className="relative">
                 <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
               </div>
            </div>
            {currentUser?.role === UserRole.LAWYER && (
                <div className="space-y-2">
                   <label className="text-sm font-semibold text-slate-700">OAB</label>
                   <div className="relative">
                     <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                     <input type="text" name="oab" value={formData.oab} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                   </div>
                </div>
            )}
          </div>

          {currentUser?.role === UserRole.LAWYER && (
             <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Biografia Profissional</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} placeholder="Conte um pouco sobre sua experiência..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
             </div>
          )}

          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
               <Save className="w-5 h-5" />
               <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationList: React.FC = () => {
  const { notifications, currentUser, markNotificationAsRead } = useApp();
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Suas Notificações</h2>
            <span className="text-xs font-medium text-slate-500">{myNotifications.filter(n => !n.read).length} não lidas</span>
         </div>
         <div className="divide-y divide-slate-100">
            {myNotifications.length === 0 ? (
                <div className="p-12 text-center">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">Você não tem novas notificações.</p>
                </div>
            ) : (
                myNotifications.map(n => (
                    <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-6 flex items-start space-x-4 hover:bg-slate-50 transition cursor-pointer ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                        <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                            n.type === 'success' ? 'bg-green-100 text-green-600' :
                            n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'
                        }`}>
                           {n.type === 'success' ? <Check className="w-4 h-4"/> : n.type === 'warning' ? <AlertCircle className="w-4 h-4"/> : <Bell className="w-4 h-4"/>}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`text-sm font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{new Date(n.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className={`text-sm mt-1 ${!n.read ? 'text-slate-800' : 'text-slate-500'}`}>{n.message}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
                    </div>
                ))
            )}
         </div>
       </div>
    </div>
  );
};

// --- SHARED LAYOUT ---

type ViewType = 'dashboard' | 'profile' | 'notifications';

const DashboardLayout: React.FC<{ 
    children: React.ReactNode; 
    title: string; 
    activeView: ViewType;
    onViewChange: (view: ViewType) => void; 
}> = ({ children, title, activeView, onViewChange }) => {
  const { logout, currentUser, notifications } = useApp();
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold text-white tracking-tight">SocialJuris</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <img src={currentUser?.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" />
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser?.role === 'LAWYER' ? 'Advogado' : currentUser?.role === 'CLIENT' ? 'Cliente' : 'Admin'}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu</div>
            
            <button 
              onClick={() => onViewChange('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeView === 'dashboard' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>Painel Geral</span>
            </button>

            <button 
              onClick={() => onViewChange('profile')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                  activeView === 'profile' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span>Meu Perfil</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <button onClick={logout} className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight hidden md:block">
                  {activeView === 'dashboard' ? title : activeView === 'profile' ? 'Meu Perfil' : 'Central de Notificações'}
              </h1>
              {activeView === 'dashboard' && <p className="text-sm text-slate-500 hidden md:block">Visão geral das suas atividades hoje</p>}
              <div className="md:hidden flex items-center space-x-2">
                  <span className="text-xl font-bold text-slate-900">SocialJuris</span>
              </div>
          </div>
          <div className="flex items-center space-x-6">
             <button 
                onClick={() => onViewChange('notifications')} 
                className={`relative p-2 transition rounded-full ${activeView === 'notifications' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
                title="Ver Notificações"
             >
                 <Bell className="w-6 h-6" />
                 {/* BADGE VERMELHO DE NOTIFICAÇÕES */}
                 {unreadCount > 0 && (
                     <span className="absolute top-0 right-0 flex h-5 w-5 translate-x-1/4 -translate-y-1/4">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-[10px] font-bold text-white items-center justify-center border-2 border-white">
                         {unreadCount}
                       </span>
                     </span>
                 )}
             </button>
             <button onClick={logout} className="md:hidden text-sm font-medium text-slate-500">Sair</button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

// --- CLIENT DASHBOARD ---
export const ClientDashboard = () => {
  const { cases, currentUser, createCase } = useApp();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  
  const [showModal, setShowModal] = useState(false);
  
  // CORREÇÃO: Em vez de armazenar o objeto Case (que fica estático), armazenamos o ID
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  
  // Computamos o caso ativo sempre com base na lista 'cases' atualizada do Store
  const activeCase = cases.find(c => c.id === activeCaseId) || null;
  
  // Case Creation State
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ area: string; title: string; summary: string } | null>(null);

  const myCases = cases.filter(c => c.clientId === currentUser?.id);

  const handleAnalyze = async () => {
    if (description.length < 10) return;
    if (!city || !uf) {
        alert("Por favor, preencha Cidade e UF.");
        return;
    }
    setAnalyzing(true);
    const result = await analyzeCaseDescription(description);
    setAiSuggestion(result);
    setAnalyzing(false);
  };

  const handleCreate = () => {
    if (!aiSuggestion) return;
    createCase({ 
      title: aiSuggestion.title, 
      description, 
      area: aiSuggestion.area,
      city,
      uf
    });
    setShowModal(false);
    setDescription('');
    setCity('');
    setUf('');
    setAiSuggestion(null);
  };

  const renderDashboardContent = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-sm font-medium mb-1">Casos Ativos</div>
           <div className="text-3xl font-bold text-slate-900">{myCases.filter(c => c.status === CaseStatus.ACTIVE).length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-sm font-medium mb-1">Total de Casos</div>
           <div className="text-3xl font-bold text-slate-900">{myCases.length}</div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-600/20 text-white flex flex-col justify-center items-center hover:bg-indigo-700 transition transform hover:scale-[1.02]"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="font-semibold">Nova Demanda Jurídica</span>
        </button>
      </div>

      {/* Case List */}
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-indigo-600"/> Meus Casos</h2>
      <div className="grid gap-6 lg:grid-cols-2 animate-in slide-in-from-bottom-8 duration-700">
        {myCases.length === 0 ? (
          <div className="col-span-2 text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
             <div className="text-slate-400 mb-2">Você ainda não tem casos cadastrados</div>
             <button onClick={() => setShowModal(true)} className="text-indigo-600 font-medium hover:underline">Criar primeiro caso</button>
          </div>
        ) : (
          myCases.map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2 border border-indigo-100">{c.area}</span>
                  <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  c.status === CaseStatus.OPEN ? 'bg-yellow-100 text-yellow-700' :
                  c.status === CaseStatus.ACTIVE ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {c.status === CaseStatus.OPEN ? 'Aguardando' : c.status === CaseStatus.ACTIVE ? 'Em Andamento' : 'Concluído'}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{c.description}</p>
              
              {/* Location Badge */}
              {c.city && c.uf && (
                  <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 inline-flex px-2 py-1 rounded border border-slate-100">
                      <MapPin className="w-3 h-3 mr-1" />
                      {c.city} - {c.uf}
                  </div>
              )}

              {/* Timeline Mini */}
              <div className="flex items-center space-x-2 text-xs text-slate-400 mb-6">
                 <div className="flex items-center"><div className="w-2 h-2 bg-indigo-600 rounded-full mr-1"></div> Criado</div>
                 <div className="w-8 h-px bg-slate-200"></div>
                 <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${c.lawyerId ? 'bg-indigo-600' : 'bg-slate-300'}`}></div> 
                    {c.lawyerId ? 'Advogado Atribuído' : 'Aguardando'}
                 </div>
              </div>

              <button 
                onClick={() => setActiveCaseId(c.id)}
                className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 transition flex justify-center items-center border border-slate-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {c.status === CaseStatus.OPEN ? 'Ver Detalhes' : 'Abrir Chat com Advogado'}
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <DashboardLayout 
        title={`Olá, ${currentUser?.name.split(' ')[0]}`}
        activeView={activeView}
        onViewChange={setActiveView}
    >
      {activeView === 'dashboard' && renderDashboardContent()}
      {activeView === 'profile' && <UserProfile />}
      {activeView === 'notifications' && <NotificationList />}

      {/* New Case Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Nova Demanda</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6"/></button>
            </div>
            <div className="p-6">
              {!aiSuggestion ? (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Ex: São Paulo"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
                        <select 
                            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={uf}
                            onChange={(e) => setUf(e.target.value)}
                        >
                            <option value="">Selecione</option>
                            {BRAZIL_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                      </div>
                  </div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">Descreva seu problema jurídico com detalhes</label>
                  <textarea 
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[150px] mb-4 text-slate-800"
                    placeholder="Ex: Comprei um imóvel na planta e a construtora está atrasada há 6 meses. O contrato dizia..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={description.length < 10 || !city || !uf || analyzing}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center transition"
                  >
                    {analyzing ? <span className="animate-pulse">Analisando com IA...</span> : 'Continuar'}
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-start mb-2">
                       <Award className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" />
                       <div>
                         <span className="text-xs font-bold text-indigo-500 uppercase">Sugestão da IA</span>
                         <h4 className="font-bold text-indigo-900 text-lg">{aiSuggestion.title}</h4>
                       </div>
                    </div>
                    <p className="text-indigo-800/80 text-sm mb-2">{aiSuggestion.summary}</p>
                    <div className="flex flex-wrap gap-2">
                        <div className="inline-block bg-white px-3 py-1 rounded-md text-xs font-bold text-indigo-700 border border-indigo-200">
                        Área: {aiSuggestion.area}
                        </div>
                        <div className="inline-block bg-white px-3 py-1 rounded-md text-xs font-bold text-slate-700 border border-slate-200 flex items-center">
                        <MapPin className="w-3 h-3 mr-1"/> {city} - {uf}
                        </div>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                     <button onClick={() => setAiSuggestion(null)} className="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition">Voltar</button>
                     <button onClick={handleCreate} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">Confirmar e Criar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Case Chat Overlay */}
      {activeCase && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl h-[700px] flex flex-col bg-transparent">
             <Chat 
                currentCase={activeCase} 
                currentUser={currentUser!} 
                otherPartyName={activeCase.lawyerId ? "Dr. Advogado" : "Sistema"} 
                onClose={() => setActiveCaseId(null)}
             />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// --- LAWYER DASHBOARD ---
export const LawyerDashboard = () => {
  const { cases, currentUser, acceptCase, users, logout } = useApp();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [activeTab, setActiveTab] = useState<'feed' | 'my'>('feed');
  
  // CORREÇÃO: Mesmo princípio aqui, usamos activeCaseId para reatividade
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const activeCase = cases.find(c => c.id === activeCaseId) || null;

  // Filters
  const [filterCity, setFilterCity] = useState('');
  const [filterUF, setFilterUF] = useState('');

  // Filtragems
  const availableCases = cases.filter(c => {
      const isStatusOpen = c.status === CaseStatus.OPEN;
      const matchesCity = !filterCity || (c.city && c.city.toLowerCase().includes(filterCity.toLowerCase()));
      const matchesUF = !filterUF || c.uf === filterUF;
      return isStatusOpen && matchesCity && matchesUF;
  });

  const myCases = cases.filter(c => c.lawyerId === currentUser?.id);

  if (!currentUser?.verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Verificação Pendente</h2>
          <p className="text-slate-600 mb-6">
            Sua conta está em análise. Nossa equipe está validando sua OAB ({currentUser?.oab}).
            Você será notificado assim que aprovado.
          </p>
          <div className="animate-pulse w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-6">
             <div className="w-1/2 h-full bg-yellow-400"></div>
          </div>
          
          <button 
            onClick={logout} 
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair / Voltar
          </button>
        </div>
      </div>
    );
  }

  const getClientName = (id: string) => users.find(u => u.id === id)?.name || "Cliente";

  const renderDashboardContent = () => (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Ganhos Potenciais</div>
                <div className="text-2xl font-bold text-slate-900">R$ 12.450</div>
              </div>
              <div className="bg-green-100 p-2 rounded-lg text-green-600"><DollarSign className="w-6 h-6"/></div>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Clientes Ativos</div>
                <div className="text-2xl font-bold text-slate-900">{myCases.filter(c => c.status === CaseStatus.ACTIVE).length}</div>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Users className="w-6 h-6"/></div>
           </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Oportunidades</div>
                <div className="text-2xl font-bold text-slate-900">{availableCases.length}</div>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Search className="w-6 h-6"/></div>
           </div>
        </div>
         <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-600/20 text-white flex items-center justify-between">
             <div>
               <div className="text-indigo-200 text-xs font-bold uppercase tracking-wide mb-1">Status OAB</div>
               <div className="text-lg font-bold flex items-center"><Check className="w-5 h-5 mr-1" /> Verificado</div>
             </div>
             <Award className="w-8 h-8 opacity-50"/>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-200 p-1 rounded-xl inline-flex">
        <button 
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'feed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Oportunidades
        </button>
        <button 
          onClick={() => setActiveTab('my')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'my' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Meus Casos
        </button>
      </div>
      
      {/* Filter Bar (Only for Feed) */}
      {activeTab === 'feed' && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center text-slate-500 font-semibold mr-2">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar Local:
              </div>
              <div className="flex-1 w-full relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por Cidade" 
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                  />
              </div>
              <div className="w-full md:w-32">
                  <select 
                    className="w-full py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterUF}
                    onChange={(e) => setFilterUF(e.target.value)}
                  >
                      <option value="">Todos UF</option>
                      {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
              </div>
          </div>
      )}

      {/* Content */}
      <div className="grid gap-6 animate-in slide-in-from-bottom-8 duration-700">
        {activeTab === 'feed' ? (
          availableCases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">Nenhuma oportunidade disponível com esses filtros.</p>
            </div>
          ) : (
            availableCases.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-indigo-200 transition">
                <div className="mb-4 md:mb-0 max-w-2xl">
                  <div className="flex items-center space-x-3 mb-2">
                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{c.area}</span>
                     {c.city && c.uf && (
                        <span className="flex items-center text-slate-500 text-xs font-semibold">
                            <MapPin className="w-3 h-3 mr-1" />
                            {c.city} - {c.uf}
                        </span>
                     )}
                     <span className="text-slate-400 text-xs">· {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{c.title}</h3>
                  <p className="text-slate-600 text-sm">{c.description}</p>
                </div>
                <button 
                  onClick={() => acceptCase(c.id)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 whitespace-nowrap w-full md:w-auto"
                >
                  Aceitar Caso
                </button>
              </div>
            ))
          )
        ) : (
          myCases.map(c => (
            <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer" onClick={() => setActiveCaseId(c.id)}>
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <UserIcon className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900">{getClientName(c.clientId)}</h3>
                     <p className="text-xs text-slate-500">Caso #{c.id}</p>
                   </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === CaseStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                   {c.status}
                 </span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">{c.title}</h4>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{c.description}</p>
              
              {c.city && c.uf && (
                 <div className="flex items-center text-xs text-slate-400 mb-3">
                    <MapPin className="w-3 h-3 mr-1" /> {c.city} - {c.uf}
                 </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Última atualização: hoje</span>
                <button className="text-indigo-600 text-sm font-semibold hover:underline">Abrir Painel</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <DashboardLayout 
        title="Portal do Advogado"
        activeView={activeView}
        onViewChange={setActiveView}
    >
      {activeView === 'dashboard' && renderDashboardContent()}
      {activeView === 'profile' && <UserProfile />}
      {activeView === 'notifications' && <NotificationList />}

       {/* Lawyer Chat Overlay */}
       {activeCase && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl h-[700px] flex flex-col bg-transparent">
             <Chat 
                currentCase={activeCase} 
                currentUser={currentUser!} 
                otherPartyName={getClientName(activeCase.clientId)} 
                onClose={() => setActiveCaseId(null)}
             />
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

// --- ADMIN DASHBOARD ---
export const AdminDashboard = () => {
  const { users, verifyLawyer, cases } = useApp();
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const pendingLawyers = users.filter(u => u.role === UserRole.LAWYER && !u.verified);

  const renderDashboardContent = () => (
    <>
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
           <div className="text-slate-400 mb-1 font-medium">Usuários Totais</div>
           <div className="text-4xl font-bold">{users.length}</div>
        </div>
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg">
           <div className="text-slate-400 mb-1 font-medium">Casos na Plataforma</div>
           <div className="text-4xl font-bold">{cases.length}</div>
        </div>
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
           <div className="text-indigo-200 mb-1 font-medium">Pendentes de Aprovação</div>
           <div className="text-4xl font-bold">{pendingLawyers.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg">Advogados Aguardando Validação</h3>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">{pendingLawyers.length} Pendentes</span>
        </div>
        {pendingLawyers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Nenhum advogado pendente.</div>
        ) : (
          <div className="divide-y divide-slate-100">
             {pendingLawyers.map(lawyer => (
               <div key={lawyer.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                 <div className="flex items-center space-x-4">
                    <img src={lawyer.avatar} alt="" className="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold text-slate-900">{lawyer.name}</h4>
                      <p className="text-sm text-slate-500">{lawyer.email}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">OAB: {lawyer.oab || 'N/A'}</span>
                        <span className="text-xs text-slate-400">Registrado em: {new Date(lawyer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                 </div>
                 <div className="flex space-x-3">
                   <button className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium text-sm transition">Rejeitar</button>
                   <button 
                     onClick={() => verifyLawyer(lawyer.id)}
                     className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-green-600/20 transition flex items-center"
                   >
                     <Check className="w-4 h-4 mr-2" /> Aprovar
                   </button>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <DashboardLayout 
        title="Administração do Sistema"
        activeView={activeView}
        onViewChange={setActiveView}
    >
        {activeView === 'dashboard' && renderDashboardContent()}
        {activeView === 'profile' && <UserProfile />}
        {activeView === 'notifications' && <NotificationList />}
    </DashboardLayout>
  );
};