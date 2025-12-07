import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, CaseStatus, Case } from '../types';
import { Plus, Briefcase, MessageSquare, Check, X, Bell, User as UserIcon, LogOut, Award, DollarSign, Users, Activity, Filter, Search } from 'lucide-react';
import { Chat } from './Chat';
import { analyzeCaseDescription } from '../services/geminiService';

// --- SHARED LAYOUT ---
const DashboardLayout: React.FC<{ children: React.ReactNode; title: string; activeTab?: string; onTabChange?: (t: any) => void }> = ({ children, title }) => {
  const { logout, currentUser } = useApp();
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold text-white tracking-tight">SocialJuris</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <img src={currentUser?.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{currentUser?.role.toLowerCase()}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu</div>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 transition-all">
              <Activity className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <UserIcon className="w-5 h-5" />
              <span>Perfil</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <Bell className="w-5 h-5" />
              <span>Notificações</span>
            </button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <button onClick={logout} className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <div className="flex items-center space-x-4 md:hidden">
             <button onClick={logout} className="text-sm font-medium text-slate-500">Sair</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

// --- CLIENT DASHBOARD ---
export const ClientDashboard = () => {
  const { cases, currentUser, createCase } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  
  // Case Creation State
  const [description, setDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ area: string; title: string; summary: string } | null>(null);

  const myCases = cases.filter(c => c.clientId === currentUser?.id);

  const handleAnalyze = async () => {
    if (description.length < 10) return;
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
      area: aiSuggestion.area 
    });
    setShowModal(false);
    setDescription('');
    setAiSuggestion(null);
  };

  return (
    <DashboardLayout title={`Olá, ${currentUser?.name.split(' ')[0]}`}>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="grid gap-6 lg:grid-cols-2">
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
              <p className="text-slate-600 text-sm mb-6 line-clamp-2">{c.description}</p>
              
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
                onClick={() => setActiveCase(c)}
                className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 transition flex justify-center items-center border border-slate-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {c.status === CaseStatus.OPEN ? 'Ver Detalhes' : 'Abrir Chat com Advogado'}
              </button>
            </div>
          ))
        )}
      </div>

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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descreva seu problema jurídico com detalhes</label>
                  <textarea 
                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[150px] mb-4 text-slate-800"
                    placeholder="Ex: Comprei um imóvel na planta e a construtora está atrasada há 6 meses. O contrato dizia..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={description.length < 10 || analyzing}
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
                    <div className="inline-block bg-white px-3 py-1 rounded-md text-xs font-bold text-indigo-700 border border-indigo-200">
                      Área: {aiSuggestion.area}
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
                otherPartyName={activeCase.lawyerId ? "Dr. Advogado" : "Sistema"} // In real app, find user name
                onClose={() => setActiveCase(null)}
             />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// --- LAWYER DASHBOARD ---
export const LawyerDashboard = () => {
  const { cases, currentUser, acceptCase, users } = useApp();
  const [activeTab, setActiveTab] = useState<'feed' | 'my'>('feed');
  const [activeCase, setActiveCase] = useState<Case | null>(null);

  const availableCases = cases.filter(c => c.status === CaseStatus.OPEN);
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
          <div className="animate-pulse w-full h-2 bg-slate-200 rounded-full overflow-hidden">
             <div className="w-1/2 h-full bg-yellow-400"></div>
          </div>
        </div>
      </div>
    );
  }

  const getClientName = (id: string) => users.find(u => u.id === id)?.name || "Cliente";

  return (
    <DashboardLayout title="Portal do Advogado">
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      {/* Content */}
      <div className="grid gap-6">
        {activeTab === 'feed' ? (
          availableCases.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500">Nenhuma oportunidade disponível no momento.</p>
            </div>
          ) : (
            availableCases.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-indigo-200 transition">
                <div className="mb-4 md:mb-0 max-w-2xl">
                  <div className="flex items-center space-x-3 mb-2">
                     <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{c.area}</span>
                     <span className="text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
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
            <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer" onClick={() => setActiveCase(c)}>
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
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">Última atualização: hoje</span>
                <button className="text-indigo-600 text-sm font-semibold hover:underline">Abrir Painel</button>
              </div>
            </div>
          ))
        )}
      </div>

       {/* Lawyer Chat Overlay */}
       {activeCase && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl h-[700px] flex flex-col bg-transparent">
             <Chat 
                currentCase={activeCase} 
                currentUser={currentUser!} 
                otherPartyName={getClientName(activeCase.clientId)} 
                onClose={() => setActiveCase(null)}
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
  const pendingLawyers = users.filter(u => u.role === UserRole.LAWYER && !u.verified);

  return (
    <DashboardLayout title="Administração do Sistema">
      
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
    </DashboardLayout>
  );
};