
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, CaseStatus, Case, User, Notification, StrategyAnalysis, CalculationResult } from '../types';
import { Plus, Briefcase, MessageSquare, Check, X, Bell, User as UserIcon, LogOut, Award, DollarSign, Users, Activity, Filter, Search, Save, Settings, Phone, Mail, Shield, AlertCircle, MapPin, CreditCard, Coins, Loader2, Lock, FileText, Calculator, Calendar, Scale, Sparkles, BrainCircuit, TrendingUp, BarChart3, AlertTriangle, Zap, FileSearch, Folders, Clock, Eye, XCircle, Hammer, LayoutGrid, PieChart, ChevronRight, Copy, Printer, BookOpen, Download, RefreshCw, ChevronDown } from 'lucide-react';
import { Chat } from './Chat';
import { analyzeCaseDescription, calculateCasePrice, analyzeOpposingStrategy, calculateLegalAdjustment } from '../services/geminiService';

// --- CONSTANTES ---
const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type ViewType = 'dashboard' | 'profile' | 'notifications' | 'pro_analytics' | 'pro_strategy' | 'pro_calculator' | 'pro_writer' | 'pro_docs' | 'pro_calendar' | 'pro_crm' | 'premium_sales';

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
                  {currentUser?.isPremium && <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 flex items-center"><Sparkles className="w-3 h-3 mr-1"/> PRO</span>}
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

// --- PRO TOOLS COMPONENTS ---

const PremiumLockOverlay: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-2xl">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm text-center transform hover:scale-105 transition duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Ferramenta PRO</h3>
            <p className="text-slate-500 mb-6">Esta funcionalidade avançada é exclusiva para assinantes SocialJuris PRO.</p>
            <button 
                onClick={onUnlock}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center space-x-2"
            >
                <Sparkles className="w-4 h-4 text-amber-400"/>
                <span>Desbloquear Agora</span>
            </button>
        </div>
    </div>
);

const FeatureComingSoon: React.FC<{ title: string, icon: any, desc: string }> = ({ title, icon: Icon, desc }) => (
    <div className="h-full bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <Icon className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
            <Hammer className="w-3 h-3" />
            <span>EM DESENVOLVIMENTO</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md">{desc}</p>
        <p className="text-sm text-slate-400 mt-6">Esta funcionalidade estará disponível em breve para todos os assinantes PRO.</p>
    </div>
);

const StrategyAnalyzer: React.FC<{ isPremium: boolean, onUnlock: () => void }> = ({ isPremium, onUnlock }) => {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState<StrategyAnalysis | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!text) return;
        setLoading(true);
        // Simulação de delay para efeito dramático se a API for rápida demais
        const result = await analyzeOpposingStrategy(text);
        setAnalysis(result);
        setLoading(false);
    };

    return (
        <div className="relative min-h-[600px] bg-slate-50">
            {!isPremium && <PremiumLockOverlay onUnlock={onUnlock} />}
            
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
                
                {/* --- LEFT COLUMN: INPUT --- */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-900 flex items-center text-lg">
                                <FileText className="w-5 h-5 mr-2 text-indigo-600"/> 
                                Peça Processual
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Cole abaixo a Inicial, Contestação ou Sentença para análise.</p>
                        </div>
                        
                        <div className="flex-1 relative">
                             <textarea 
                                className="w-full h-full min-h-[400px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono leading-relaxed resize-none"
                                placeholder="Cole o texto jurídico aqui..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            {text && (
                                <button 
                                    onClick={() => setText('')}
                                    className="absolute top-2 right-2 p-1 bg-slate-200 rounded-md hover:bg-slate-300 text-slate-600"
                                    title="Limpar"
                                >
                                    <X className="w-4 h-4"/>
                                </button>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <button 
                                onClick={handleAnalyze}
                                disabled={loading || !text}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center space-x-2 ${
                                    loading ? 'bg-slate-800 cursor-wait' : 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-1'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin"/>
                                        <span>Analisando Argumentos...</span>
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit className="w-5 h-5"/>
                                        <span>Executar Opositor IA</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ANALYSIS OUTPUT --- */}
                <div className="lg:col-span-8">
                     {analysis ? (
                         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                             
                             {/* SCORECARD */}
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * analysis.winProbabilityValue) / 100} className={`text-${analysis.winProbabilityValue > 70 ? 'green' : analysis.winProbabilityValue > 40 ? 'yellow' : 'red'}-500 transition-all duration-1000`} />
                                        </svg>
                                        <span className="absolute text-sm font-bold text-slate-900">{analysis.winProbabilityValue}%</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Probabilidade de Êxito</p>
                                        <p className="font-bold text-slate-900">{analysis.winProbability}</p>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-5 rounded-2xl shadow-lg flex flex-col justify-center relative overflow-hidden">
                                     <Zap className="absolute right-4 top-4 w-12 h-12 text-white/10" />
                                     <p className="text-xs text-indigo-300 font-bold uppercase mb-2">Recomendação Tática</p>
                                     <p className="text-sm font-medium leading-relaxed">{analysis.recommendedFocus}</p>
                                </div>
                             </div>

                             {/* DETAILED CARDS */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {/* FRAQUEZAS */}
                                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                     <div className="bg-red-50 border-b border-red-100 p-4 flex justify-between items-center">
                                         <h4 className="font-bold text-red-800 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Fragilidades Detectadas</h4>
                                         <span className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded-md border border-red-200">{analysis.weaknesses.length} pontos</span>
                                     </div>
                                     <div className="p-4 space-y-3">
                                         {analysis.weaknesses.map((w, i) => (
                                             <div key={i} className="flex items-start text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                 <span className="text-red-500 font-bold mr-2">{i+1}.</span>
                                                 {w}
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 {/* CONTRA-ARGUMENTOS */}
                                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                     <div className="bg-blue-50 border-b border-blue-100 p-4 flex justify-between items-center">
                                         <h4 className="font-bold text-blue-800 flex items-center"><Shield className="w-5 h-5 mr-2"/> Estratégia de Defesa</h4>
                                         <span className="text-xs font-bold bg-white text-blue-600 px-2 py-1 rounded-md border border-blue-200">{analysis.counterArguments.length} teses</span>
                                     </div>
                                     <div className="p-4 space-y-3">
                                         {analysis.counterArguments.map((w, i) => (
                                             <div key={i} className="flex items-start text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                 <Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"/>
                                                 {w}
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>

                             {/* JURISPRUDENCIA */}
                             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                 <div className="bg-amber-50 border-b border-amber-100 p-4">
                                     <h4 className="font-bold text-amber-800 flex items-center"><Scale className="w-5 h-5 mr-2"/> Jurisprudência Relacionada</h4>
                                 </div>
                                 <div className="p-4 grid md:grid-cols-2 gap-4">
                                     {analysis.jurisprudence.map((item, i) => (
                                         <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition bg-slate-50/50">
                                             <div className="flex items-center mb-2">
                                                 <BookOpen className="w-4 h-4 text-amber-600 mr-2"/>
                                                 <h5 className="font-bold text-slate-900 text-sm">{item.title}</h5>
                                             </div>
                                             <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* ACTIONS */}
                             <div className="flex justify-end space-x-3 pt-4">
                                 <button className="flex items-center px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition">
                                     <Copy className="w-4 h-4 mr-2"/> Copiar Relatório
                                 </button>
                                 <button className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition">
                                     <Printer className="w-4 h-4 mr-2"/> Exportar PDF
                                 </button>
                             </div>

                         </div>
                     ) : (
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-center opacity-70 min-h-[400px]">
                             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <BrainCircuit className="w-12 h-12 text-slate-300"/>
                             </div>
                             <h3 className="text-xl font-bold text-slate-900 mb-2">Aguardando Dados</h3>
                             <p className="text-slate-500 max-w-sm mx-auto">Cole a peça processual ao lado e clique em "Executar Opositor IA" para gerar insights estratégicos.</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

const LegalCalculator: React.FC<{ isPremium: boolean, onUnlock: () => void }> = ({ isPremium, onUnlock }) => {
    const [amount, setAmount] = useState(10000);
    const [startDate, setStartDate] = useState('2022-01-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [index, setIndex] = useState('IGPM');
    const [interestRate, setInterestRate] = useState(1); // 1%
    const [finePercent, setFinePercent] = useState(0); // Multa
    const [feesPercent, setFeesPercent] = useState(0); // Honorários
    
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        const res = await calculateLegalAdjustment(amount, startDate, endDate, index, interestRate, finePercent, feesPercent);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="relative min-h-[600px] bg-slate-50">
            {!isPremium && <PremiumLockOverlay onUnlock={onUnlock} />}
            
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
                 
                 {/* --- INPUT PANEL --- */}
                 <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                     <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                         <h3 className="font-bold text-slate-900 flex items-center text-lg"><Calculator className="w-5 h-5 mr-2 text-indigo-600"/> Parâmetros</h3>
                         <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">Cível/Trabalhista</span>
                     </div>
                     
                     <div className="space-y-5">
                         <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor Original (R$)</label>
                             <div className="relative">
                                 <span className="absolute left-3 top-3 text-slate-400 font-bold">R$</span>
                                 <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900"/>
                             </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data Inicial</label>
                                 <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Data Final</label>
                                 <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
                             </div>
                         </div>

                         <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Índice de Correção</label>
                             <div className="relative">
                                <select value={index} onChange={e => setIndex(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-medium">
                                    <option value="IGPM">IGP-M (FGV) - Variação Geral</option>
                                    <option value="IPCA">IPCA (IBGE) - Oficial Inflação</option>
                                    <option value="INPC">INPC (IBGE) - Salários</option>
                                    <option value="SELIC">SELIC (Receita Federal/CC)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none"/>
                             </div>
                         </div>

                         <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Juros (a.m)</label>
                                <div className="relative">
                                    <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none text-sm"/>
                                    <span className="absolute right-2 top-2 text-slate-400 text-xs">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Multa</label>
                                <div className="relative">
                                    <input type="number" value={finePercent} onChange={e => setFinePercent(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none text-sm"/>
                                    <span className="absolute right-2 top-2 text-slate-400 text-xs">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Honorários</label>
                                <div className="relative">
                                    <input type="number" value={feesPercent} onChange={e => setFeesPercent(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none text-sm"/>
                                    <span className="absolute right-2 top-2 text-slate-400 text-xs">%</span>
                                </div>
                            </div>
                         </div>
                         
                         <div className="pt-4 mt-auto">
                            <button 
                                onClick={handleCalculate}
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center shadow-lg transform hover:-translate-y-1"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Calcular e Atualizar'}
                            </button>
                         </div>
                     </div>
                 </div>

                 {/* --- RESULTS PANEL --- */}
                 <div className="lg:col-span-8 space-y-6">
                     {result ? (
                         <>
                            {/* TOTAL CARD */}
                            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-2">Valor Total Atualizado</p>
                                        <h2 className="text-5xl md:text-6xl font-extrabold mb-1 tracking-tight">R$ {result.updatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                                        <p className="text-slate-400 text-sm">Atualizado até {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-6 md:mt-0 text-right">
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                            <p className="text-xs text-indigo-200 uppercase font-bold">Valor Original</p>
                                            <p className="text-xl font-bold">R$ {result.originalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                            <div className="w-full h-px bg-white/20 my-2"></div>
                                            <p className="text-xs text-green-300 uppercase font-bold">+ Valorização</p>
                                            <p className="text-xl font-bold text-green-400">+ {((result.updatedValue / result.originalValue - 1) * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BREAKDOWN GRID */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-2">
                                        <TrendingUp className="w-5 h-5"/>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Correção ({result.indexUsed})</p>
                                    <p className="text-lg font-bold text-slate-900">R$ {result.totalCorrection.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-2">
                                        <Clock className="w-5 h-5"/>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Juros Totais</p>
                                    <p className="text-lg font-bold text-slate-900">R$ {result.totalInterest.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-2">
                                        <AlertTriangle className="w-5 h-5"/>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Multa ({finePercent}%)</p>
                                    <p className="text-lg font-bold text-slate-900">R$ {result.totalFine.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-sm bg-green-50/30">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-2">
                                        <Award className="w-5 h-5"/>
                                    </div>
                                    <p className="text-xs text-green-700 font-bold uppercase">Honorários ({feesPercent}%)</p>
                                    <p className="text-lg font-bold text-green-800">R$ {result.totalFees.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>

                            {/* VISUAL CHART */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-slate-900 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-slate-500"/> Evolução da Dívida</h4>
                                    <div className="flex items-center space-x-3 text-xs">
                                        <div className="flex items-center"><div className="w-3 h-3 bg-slate-300 rounded-sm mr-1"></div> Principal</div>
                                        <div className="flex items-center"><div className="w-3 h-3 bg-indigo-500 rounded-sm mr-1"></div> Juros+Correção</div>
                                    </div>
                                </div>
                                
                                {/* CSS CHART */}
                                <div className="flex-1 flex items-end justify-between space-x-2 w-full px-2">
                                    {result.chartData.map((data, i) => {
                                        const total = data.value;
                                        const maxVal = result.updatedValue; // Use final total as max height reference
                                        const heightPercent = Math.max(5, (total / maxVal) * 100);
                                        const principalHeight = (data.principalPart / total) * 100;
                                        
                                        return (
                                            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none">
                                                    <p className="font-bold">{data.label}</p>
                                                    <p>R$ {data.value.toLocaleString('pt-BR', {maximumFractionDigits:0})}</p>
                                                </div>
                                                
                                                <div className="w-full bg-slate-100 rounded-t-md overflow-hidden flex flex-col-reverse relative transition-all duration-500 hover:brightness-95" style={{ height: `${heightPercent}%` }}>
                                                    <div className="w-full bg-slate-300 transition-all duration-1000" style={{ height: `${principalHeight}%` }}></div>
                                                    <div className="w-full bg-indigo-500 transition-all duration-1000 flex-1"></div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-2 font-medium truncate w-full text-center">{data.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* EXPORT ACTIONS */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="py-3 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition flex justify-center items-center">
                                    <Download className="w-5 h-5 mr-2"/> Baixar Planilha (Excel)
                                </button>
                                <button className="py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition flex justify-center items-center">
                                    <Printer className="w-5 h-5 mr-2"/> Gerar Relatório PDF
                                </button>
                            </div>
                         </>
                     ) : (
                         <div className="h-full bg-white rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-10 opacity-60 min-h-[400px]">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <TrendingUp className="w-12 h-12 text-slate-300"/>
                             </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Simulador Financeiro</h3>
                            <p className="text-slate-500 text-center max-w-sm">Preencha os parâmetros à esquerda para visualizar a evolução monetária detalhada e gerar gráficos.</p>
                         </div>
                     )}
                 </div>
            </div>
        </div>
    );
};

// --- SHARED LAYOUT ---

const DashboardLayout: React.FC<{ 
    children: React.ReactNode; 
    title: string; 
    activeView: ViewType; 
    onViewChange: (view: ViewType) => void; 
}> = ({ children, title, activeView, onViewChange }) => {
  const { logout, currentUser, notifications, subscribePremium } = useApp();
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [processingPremium, setProcessingPremium] = useState(false);

  const handleSubscribe = async () => {
      setProcessingPremium(true);
      setTimeout(async () => {
          await subscribePremium();
          setProcessingPremium(false);
          setShowPremiumModal(false);
      }, 2000);
  };

  const proFeatures = [
      {
          icon: BarChart3,
          color: 'text-cyan-600',
          bg: 'bg-cyan-100',
          title: "Analytics Jurídico",
          desc: "Análise de dados unificada de todas as suas ferramentas e performance de casos."
      },
      {
          icon: BrainCircuit,
          color: 'text-indigo-600',
          bg: 'bg-indigo-100',
          title: "Opositor IA",
          desc: "Análise estratégica de peças com detecção de falhas e jurisprudência."
      },
      {
          icon: Calculator,
          color: 'text-blue-600',
          bg: 'bg-blue-100',
          title: "Calculadora Visual",
          desc: "Cálculos de atualização monetária com gráficos persuasivos."
      },
      {
          icon: FileText,
          color: 'text-green-600',
          bg: 'bg-green-100',
          title: "Redator One-Click",
          desc: "Geração instantânea de petições iniciais baseadas no cadastro do cliente."
      },
      {
          icon: FileSearch,
          color: 'text-purple-600',
          bg: 'bg-purple-100',
          title: "Análise de Documentos",
          desc: "Upload de arquivos para leitura e resumo automático via IA."
      },
      {
          icon: Calendar,
          color: 'text-pink-600',
          bg: 'bg-pink-100',
          title: "Agenda Inteligente",
          desc: "Controle de prazos automatizado e sincronizado com os processos."
      },
      {
          icon: Folders,
          color: 'text-orange-600',
          bg: 'bg-orange-100',
          title: "Gestão CRM",
          desc: "Gestão completa de clientes, processos e honorários em um só lugar."
      }
  ];

  const sidebarProTools = [
      { id: 'pro_analytics', label: 'Analytics PRO', icon: BarChart3, desc: 'Inteligência de Dados' },
      { id: 'pro_strategy', label: 'Opositor IA', icon: BrainCircuit, desc: 'Análise Estratégica' },
      { id: 'pro_calculator', label: 'Calculadora Visual', icon: Calculator, desc: 'Atualização Monetária' },
      { id: 'pro_writer', label: 'Redator One-Click', icon: FileText, desc: 'Petições Automáticas' },
      { id: 'pro_docs', label: 'Análise Docs', icon: FileSearch, desc: 'Leitura IA' },
      { id: 'pro_calendar', label: 'Agenda Inteligente', icon: Calendar, desc: 'Prazos' },
      { id: 'pro_crm', label: 'Gestão CRM', icon: Folders, desc: 'Gestão Total' },
  ];

  const PremiumModal = () => (
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-[70] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in duration-300 relative my-auto h-[90vh] lg:h-auto">
              <button onClick={() => setShowPremiumModal(false)} className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition"><X className="w-5 h-5 text-slate-600"/></button>
              
              {/* Left Side: Features Grid */}
              <div className="bg-slate-50 p-6 lg:p-10 lg:w-3/4 overflow-y-auto">
                  <div className="inline-flex items-center space-x-2 bg-slate-900 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-lg shadow-indigo-900/20">
                      <Sparkles className="w-3 h-3"/> <span>MEMBER ACCESS</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-2">SocialJuris PRO</h3>
                  <p className="text-slate-500 mb-8 text-lg">A suíte tecnológica completa para o advogado de alta performance.</p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {proFeatures.map((feat, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition group">
                              <div className={`w-10 h-10 ${feat.bg} rounded-lg flex items-center justify-center ${feat.color} mb-3 group-hover:scale-110 transition-transform`}>
                                  <feat.icon className="w-5 h-5"/>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-1">{feat.title}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                          </div>
                      ))}
                      
                      {/* Special Bonus Card */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden ring-1 ring-amber-400/30 lg:col-span-3 flex items-center space-x-4">
                           <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">BÔNUS EXCLUSIVO</div>
                           <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                               <Coins className="w-6 h-6"/>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-900 text-lg">20 Juris Mensais Grátis</h4>
                               <p className="text-sm text-slate-600">Ao assinar, você recebe créditos mensais (valor de R$ 40,00) para aceitar até 4 novos casos sem custo adicional.</p>
                           </div>
                      </div>
                  </div>
              </div>

              {/* Right Side: Pricing & CTA */}
              <div className="bg-slate-900 p-8 lg:p-10 lg:w-1/4 text-white flex flex-col justify-center relative overflow-hidden shrink-0 border-l border-white/10">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 to-indigo-950 z-0"></div>
                   
                   <div className="relative z-10 text-center">
                        <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-4">Plano Profissional</p>
                        <div className="flex items-start justify-center mb-2">
                             <span className="text-xl mt-2 font-medium text-slate-400 mr-1">R$</span>
                             <span className="text-6xl font-extrabold text-white tracking-tighter">69</span>
                             <div className="flex flex-col items-start mt-2 ml-1">
                                 <span className="text-xl font-bold text-white leading-none">,90</span>
                                 <span className="text-xs text-slate-400">/mês</span>
                             </div>
                        </div>
                        <p className="text-slate-400 text-xs mb-8">Cancele quando quiser.</p>

                        {processingPremium ? (
                            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                                <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2"/>
                                <p className="font-bold text-sm">Ativando sua conta...</p>
                            </div>
                        ) : (
                            <button 
                                onClick={handleSubscribe}
                                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-amber-950 py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-900/40 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 group"
                            >
                                <span>Assinar Agora</span>
                                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
                            </button>
                        )}
                        
                        <div className="mt-8 space-y-3 text-left bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex items-center text-xs text-slate-300">
                                <Check className="w-3 h-3 text-green-400 mr-2 shrink-0"/> <span>Acesso total às ferramentas</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-300">
                                <Check className="w-3 h-3 text-green-400 mr-2 shrink-0"/> <span>Bônus de 20 Juris/mês</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-300">
                                <Check className="w-3 h-3 text-green-400 mr-2 shrink-0"/> <span>Suporte Prioritário</span>
                            </div>
                        </div>
                   </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen shadow-xl z-20 overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Briefcase className="w-6 h-6" />
            <span className="text-xl font-bold text-white tracking-tight">SocialJuris</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
           {/* Standard Section */}
           <div className="p-4 space-y-1">
             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Operacional</div>
             <button onClick={() => onViewChange('dashboard')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
               <Activity className="w-5 h-5" /> <span>Dashboard</span>
             </button>
             <button onClick={() => onViewChange('profile')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${activeView === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
               <UserIcon className="w-5 h-5" /> <span>Meu Perfil</span>
             </button>
           </div>

           {/* LAWYER PRO SECTION (Unified & Visual) */}
           {currentUser?.role === UserRole.LAWYER && (
                <div className="mt-4 flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-t border-slate-800 relative">
                    {/* Gold accent line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                    
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 px-2">
                             <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center">
                                <Sparkles className="w-3 h-3 mr-1"/> SocialJuris PRO
                             </div>
                             {!currentUser.isPremium && <Lock className="w-3 h-3 text-amber-700"/>}
                        </div>

                        <div className="space-y-1">
                            {sidebarProTools.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (currentUser.isPremium) {
                                            onViewChange(item.id as ViewType);
                                        } else {
                                            setShowPremiumModal(true);
                                        }
                                    }}
                                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg border transition-all group ${
                                        activeView === item.id && currentUser.isPremium
                                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                                        : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-amber-200'
                                    }`}
                                >
                                    <div className={`p-1.5 rounded-md ${activeView === item.id && currentUser.isPremium ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-500 group-hover:text-amber-400'}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="flex justify-between items-center w-full">
                                            <div className="text-sm font-semibold">{item.label}</div>
                                            {!currentUser.isPremium && <Lock className="w-3 h-3 opacity-30"/>}
                                        </div>
                                        <div className="text-[10px] opacity-60 truncate">{item.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {!currentUser.isPremium && (
                            <div className="mt-6 mx-2 p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-center shadow-lg shadow-orange-900/50">
                                <p className="text-white text-xs font-bold mb-2">Desbloqueie o Poder Total</p>
                                <button onClick={() => setShowPremiumModal(true)} className="w-full bg-slate-900 text-white text-xs py-2 rounded-lg font-bold hover:bg-slate-800 transition">
                                    Assinar Premium
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3 mb-4">
             <img src={currentUser?.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
             <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-slate-300">{currentUser?.name}</p>
                {currentUser?.isPremium && <span className="text-[10px] text-amber-400 font-bold">Membro PRO</span>}
             </div>
          </div>
          <button onClick={logout} className="flex items-center space-x-2 text-slate-500 hover:text-red-400 transition-colors w-full text-sm">
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {showPremiumModal && <PremiumModal />}
        
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
          <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight hidden md:block">
                  {activeView === 'dashboard' ? title : 
                   activeView === 'profile' ? 'Meu Perfil' : 
                   activeView === 'pro_analytics' ? 'Analytics Jurídico' :
                   activeView === 'pro_strategy' ? 'Opositor IA (Strategy Analyzer)' :
                   activeView === 'pro_calculator' ? 'Calculadora Jurídica' :
                   activeView === 'pro_writer' ? 'Redator One-Click' :
                   activeView === 'pro_docs' ? 'Análise de Documentos' :
                   activeView === 'pro_calendar' ? 'Agenda Inteligente' :
                   activeView === 'pro_crm' ? 'Gestão CRM' :
                   'Central de Notificações'}
              </h1>
              {activeView.startsWith('pro_') && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">FERRAMENTA PRO</span>}
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

// --- DASHBOARDS IMPLEMENTATION ---

export const ClientDashboard: React.FC = () => {
  const { currentUser, cases, createCase } = useApp();
  const [view, setView] = useState<ViewType>('dashboard');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // New Case State
  const [description, setDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const myCases = cases.filter(c => c.clientId === currentUser?.id);

  const handleAnalyze = async () => {
    if (!description) return;
    setAnalyzing(true);
    const analysis = await analyzeCaseDescription(description);
    setAiAnalysis(analysis);
    setAnalyzing(false);
  };

  const handleCreate = async () => {
    if (!aiAnalysis) return;
    const price = calculateCasePrice(aiAnalysis.complexity);
    await createCase({
        title: aiAnalysis.title,
        description: description,
        area: aiAnalysis.area,
        city,
        uf,
        price,
        complexity: aiAnalysis.complexity
    });
    setShowNewCaseModal(false);
    setDescription('');
    setAiAnalysis(null);
    setCity('');
    setUf('');
    setView('dashboard');
  };

  return (
    <DashboardLayout title="Painel do Cliente" activeView={view} onViewChange={setView}>
      {view === 'profile' && <UserProfile />}
      {view === 'notifications' && <NotificationList />}
      {view === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div>
                   <h2 className="text-xl font-bold text-slate-900">Meus Casos</h2>
                   <p className="text-slate-500 text-sm">Gerencie suas solicitações jurídicas.</p>
               </div>
               <button 
                onClick={() => setShowNewCaseModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition hover:-translate-y-1 flex items-center"
               >
                   <Plus className="w-5 h-5 mr-2" /> Novo Caso
               </button>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {myCases.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Nenhum caso encontrado</h3>
                      <p className="text-slate-500 mb-6">Você ainda não registrou nenhuma demanda.</p>
                      <button onClick={() => setShowNewCaseModal(true)} className="text-indigo-600 font-bold hover:underline">Criar primeiro caso</button>
                  </div>
              ) : (
                  myCases.map(c => (
                      <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition group">
                          <div className="flex justify-between items-start">
                              <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${c.status === 'OPEN' ? 'bg-green-100 text-green-700' : c.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                          {c.status === 'OPEN' ? 'Aguardando Advogado' : c.status === 'ACTIVE' ? 'Em Andamento' : 'Encerrado'}
                                      </span>
                                      <span className="text-slate-400 text-xs">• {new Date(c.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition">{c.title}</h3>
                                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{c.description}</p>
                                  
                                  {c.lawyerId ? (
                                     <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg inline-block">
                                        <Briefcase className="w-4 h-4 mr-2 inline" />
                                        Advogado Responsável atribuído
                                     </div>
                                  ) : (
                                     <div className="flex items-center text-sm text-slate-400 italic">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Procurando especialistas...
                                     </div>
                                  )}
                              </div>
                              <div className="ml-4 flex flex-col items-end space-y-2">
                                  {c.status === 'ACTIVE' && (
                                      <button 
                                        onClick={() => setSelectedCase(c)}
                                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition shadow-md flex items-center"
                                      >
                                          <MessageSquare className="w-5 h-5" />
                                      </button>
                                  )}
                              </div>
                          </div>
                      </div>
                  ))
              )}
           </div>
        </div>
      )}

      {showNewCaseModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="text-xl font-bold text-slate-900">Novo Caso Jurídico</h3>
                      <button onClick={() => setShowNewCaseModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X className="w-5 h-5 text-slate-500" /></button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      {!aiAnalysis ? (
                          <>
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 flex items-center mb-2"><Sparkles className="w-4 h-4 mr-2"/> Assistente IA</h4>
                                <p className="text-sm text-indigo-700">Descreva seu problema com suas palavras. Nossa inteligência artificial irá categorizar e formatar juridicamente para você.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-slate-700">Relato do Caso</label>
                                <textarea 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px]"
                                    placeholder="Ex: Comprei um produto pela internet que nunca chegou e a loja não devolve o dinheiro..."
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-bold text-slate-700 text-sm">Cidade</label>
                                    <input value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Sua cidade" />
                                </div>
                                <div>
                                    <label className="font-bold text-slate-700 text-sm">Estado (UF)</label>
                                    <select value={uf} onChange={e => setUf(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <option value="">Selecione</option>
                                        {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={handleAnalyze} 
                                disabled={!description || analyzing || !city || !uf}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition disabled:opacity-50 flex justify-center items-center"
                            >
                                {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analisar e Continuar'}
                            </button>
                          </>
                      ) : (
                          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                              <div className="text-center">
                                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                                      <Check className="w-6 h-6 text-green-600" />
                                  </div>
                                  <h3 className="text-lg font-bold text-slate-900">Análise Concluída</h3>
                              </div>
                              
                              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                                  <div>
                                      <span className="text-xs font-bold text-slate-500 uppercase">Título Sugerido</span>
                                      <p className="font-semibold text-slate-900">{aiAnalysis.title}</p>
                                  </div>
                                  <div>
                                      <span className="text-xs font-bold text-slate-500 uppercase">Área do Direito</span>
                                      <p className="font-semibold text-slate-900">{aiAnalysis.area}</p>
                                  </div>
                                  <div>
                                      <span className="text-xs font-bold text-slate-500 uppercase">Complexidade</span>
                                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${aiAnalysis.complexity === 'Alta' ? 'bg-red-100 text-red-700' : aiAnalysis.complexity === 'Média' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                          {aiAnalysis.complexity}
                                      </span>
                                  </div>
                                  <div className="pt-2 border-t border-slate-200">
                                      <span className="text-xs font-bold text-slate-500 uppercase">Taxa de Publicação</span>
                                      <p className="text-2xl font-bold text-indigo-600">R$ {calculateCasePrice(aiAnalysis.complexity).toFixed(2)}</p>
                                  </div>
                              </div>

                              <div className="flex space-x-3">
                                  <button onClick={() => setAiAnalysis(null)} className="flex-1 py-3 border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Voltar</button>
                                  <button onClick={handleCreate} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">Confirmar e Pagar</button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {selectedCase && (
         <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
             <div className="w-full max-w-4xl h-[600px] relative animate-in zoom-in duration-300">
                 <Chat 
                    currentCase={selectedCase}
                    currentUser={currentUser!}
                    otherPartyName={cases.find(c => c.id === selectedCase.id)?.lawyerId ? "Advogado" : "Sistema"}
                    onClose={() => setSelectedCase(null)}
                 />
             </div>
         </div>
      )}
    </DashboardLayout>
  );
};

export const LawyerDashboard: React.FC = () => {
    const { currentUser, cases, acceptCase, buyJuris } = useApp();
    const [view, setView] = useState<ViewType>('dashboard');
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);

    const activeCases = cases.filter(c => c.lawyerId === currentUser?.id && c.status === 'ACTIVE');
    const opportunities = cases.filter(c => c.status === 'OPEN');

    return (
        <DashboardLayout title="Painel do Advogado" activeView={view} onViewChange={setView}>
            {view === 'profile' && <UserProfile />}
            {view === 'notifications' && <NotificationList />}
            
            {view === 'pro_strategy' && <StrategyAnalyzer isPremium={!!currentUser?.isPremium} onUnlock={() => {}} />}
            {view === 'pro_calculator' && <LegalCalculator isPremium={!!currentUser?.isPremium} onUnlock={() => {}} />}
            {['pro_analytics', 'pro_writer', 'pro_docs', 'pro_calendar', 'pro_crm'].includes(view) && (
                <FeatureComingSoon title={(view.replace('pro_', '').charAt(0).toUpperCase() + view.replace('pro_', '').slice(1))} icon={Hammer} desc="Esta ferramenta está em fase final de testes." />
            )}

            {view === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                             <div className="relative z-10">
                                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Saldo de Juris</p>
                                <h3 className="text-3xl font-extrabold flex items-center">{currentUser?.balance || 0} <span className="text-sm ml-2 font-normal text-amber-400 opacity-80">créditos</span></h3>
                                <button onClick={() => buyJuris(50)} className="mt-4 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition border border-white/10">Recarregar</button>
                             </div>
                             <Coins className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 text-white/5" />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <p className="text-slate-500 text-xs font-bold uppercase mb-1">Casos Ativos</p>
                             <h3 className="text-3xl font-extrabold text-slate-900">{activeCases.length}</h3>
                             <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(100, activeCases.length * 10)}%` }}></div>
                             </div>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden cursor-pointer hover:shadow-indigo-500/40 transition">
                            <div className="relative z-10">
                                <p className="text-indigo-100 text-xs font-bold uppercase mb-1">Assinatura PRO</p>
                                <h3 className="text-xl font-bold mb-2">{currentUser?.isPremium ? 'Ativa' : 'Inativa'}</h3>
                                <p className="text-xs text-indigo-100 opacity-80">Acesse ferramentas exclusivas</p>
                            </div>
                            <Sparkles className="absolute right-[-10px] top-[-10px] w-24 h-24 text-white/10 rotate-12" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center">
                                <Search className="w-5 h-5 mr-2 text-indigo-600" />
                                Oportunidades Recentes
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {opportunities.length === 0 ? (
                                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                                    <p className="text-slate-500">Nenhuma oportunidade disponível no momento.</p>
                                </div>
                            ) : (
                                opportunities.map(c => (
                                    <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase">{c.area}</span>
                                            <span className="text-green-600 font-bold text-sm">R$ {c.price?.toFixed(2)}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-1" title={c.title}>{c.title}</h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{c.description}</p>
                                        
                                        <div className="flex items-center text-xs text-slate-400 mb-6 space-x-3">
                                            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> {c.city}/{c.uf}</span>
                                            <span className="flex items-center"><Activity className="w-3 h-3 mr-1"/> {c.complexity}</span>
                                        </div>

                                        <button 
                                            onClick={() => acceptCase(c.id)}
                                            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/10 flex items-center justify-center"
                                        >
                                            Aceitar (-5 Juris)
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {activeCases.length > 0 && (
                        <div>
                             <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                                Seus Casos Ativos
                             </h2>
                             <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                 {activeCases.map((c, i) => (
                                     <div key={c.id} className={`p-6 flex items-center justify-between hover:bg-slate-50 transition ${i !== activeCases.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                         <div>
                                             <h4 className="font-bold text-slate-900">{c.title}</h4>
                                             <p className="text-sm text-slate-500">Cliente ID: {c.clientId.substring(0,8)}...</p>
                                         </div>
                                         <button 
                                            onClick={() => setSelectedCase(c)}
                                            className="p-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition"
                                         >
                                             <MessageSquare className="w-5 h-5" />
                                         </button>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
            )}

            {selectedCase && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl h-[600px] relative animate-in zoom-in duration-300">
                        <Chat 
                            currentCase={selectedCase}
                            currentUser={currentUser!}
                            otherPartyName="Cliente"
                            onClose={() => setSelectedCase(null)}
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export const AdminDashboard: React.FC = () => {
    const { users, verifyLawyer, currentUser } = useApp();
    const [view, setView] = useState<ViewType>('dashboard');

    const pendingLawyers = users.filter(u => u.role === UserRole.LAWYER && !u.verified);

    return (
        <DashboardLayout title="Administração" activeView={view} onViewChange={setView}>
            {view === 'dashboard' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <p className="text-slate-500 text-xs font-bold uppercase mb-1">Total Usuários</p>
                             <h3 className="text-3xl font-extrabold text-slate-900">{users.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                             <p className="text-slate-500 text-xs font-bold uppercase mb-1">Advogados Pendentes</p>
                             <h3 className="text-3xl font-extrabold text-orange-600">{pendingLawyers.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Verificação de Advogados</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {pendingLawyers.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">Nenhum advogado pendente de verificação.</div>
                            ) : (
                                pendingLawyers.map(u => (
                                    <div key={u.id} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <img src={u.avatar} className="w-12 h-12 rounded-full" alt="" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">{u.name}</h4>
                                                <p className="text-sm text-slate-500">OAB: {u.oab} • {u.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-bold">Rejeitar</button>
                                            <button onClick={() => verifyLawyer(u.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold shadow-md">Aprovar</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            {view === 'profile' && <UserProfile />}
            {view === 'notifications' && <NotificationList />}
        </DashboardLayout>
    );
};
