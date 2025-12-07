
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, CaseStatus, Case, User, Notification, StrategyAnalysis, CalculationResult, CalculatorType, CalculationLineItem } from '../types';
import { Plus, Briefcase, MessageSquare, Check, X, Bell, User as UserIcon, LogOut, Award, DollarSign, Users, Activity, Filter, Search, Save, Settings, Phone, Mail, Shield, AlertCircle, MapPin, CreditCard, Coins, Loader2, Lock, FileText, Calculator, Calendar, Scale, Sparkles, BrainCircuit, TrendingUp, BarChart3, AlertTriangle, Zap, FileSearch, Folders, Clock, Eye, XCircle, Hammer, LayoutGrid, PieChart, ChevronRight, Copy, Printer, BookOpen, Download, RefreshCw, ChevronDown, GraduationCap, Heart, Landmark, BriefcaseBusiness, FileSpreadsheet } from 'lucide-react';
import { Chat } from './Chat';
import { analyzeCaseDescription, calculateCasePrice, analyzeOpposingStrategy, calculateLegalAdjustment } from '../services/geminiService';

// --- CONSTANTES ---
const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

type ViewType = 'dashboard' | 'profile' | 'notifications' | 'new-case' | 'pro_analytics' | 'pro_strategy' | 'pro_calculator' | 'pro_writer' | 'pro_docs' | 'pro_calendar' | 'pro_crm' | 'premium_sales' | 'market' | 'my-cases';

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
        const result = await analyzeOpposingStrategy(text);
        setAnalysis(result);
        setLoading(false);
    };

    return (
        <div className="relative min-h-[600px] bg-slate-50">
            {!isPremium && <PremiumLockOverlay onUnlock={onUnlock} />}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
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
                <div className="lg:col-span-8">
                     {analysis ? (
                         <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
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
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    const [calcType, setCalcType] = useState<CalculatorType>('CIVIL');
    
    // STATE - CIVIL
    const [amount, setAmount] = useState(10000);
    const [startDate, setStartDate] = useState('2022-01-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [index, setIndex] = useState('IGPM');
    const [interestRate, setInterestRate] = useState(1);
    const [applyFineArt523, setApplyFineArt523] = useState(false);
    const [honorariaPercent, setHonorariaPercent] = useState(10);
    
    // STATE - LABOR
    const [salary, setSalary] = useState(3000);
    const [laborReason, setLaborReason] = useState('NO_CAUSE');
    const [fgtsBalance, setFgtsBalance] = useState(0);

    // STATE - FAMILY
    const [includeThirteenth, setIncludeThirteenth] = useState(true);

    const [result, setResult] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        const params = {
            amount: calcType === 'LABOR' ? 0 : amount,
            salary,
            startDate,
            endDate,
            index,
            interestRate,
            applyFineArt523,
            honorariaPercent,
            reason: laborReason,
            fgtsBalance,
            includeThirteenth
        };
        
        const res = await calculateLegalAdjustment(calcType, params);
        setResult(res);
        setLoading(false);
    };

    const getTypeDetails = () => {
        switch(calcType) {
            case 'CIVIL': return { icon: Scale, label: 'Cível (Cumprimento de Sentença)', color: 'indigo' };
            case 'LABOR': return { icon: BriefcaseBusiness, label: 'Trabalhista (Liquidação)', color: 'orange' };
            case 'TAX': return { icon: Landmark, label: 'Tributário (Repetição)', color: 'blue' };
            case 'FAMILY': return { icon: Heart, label: 'Família (Pensão)', color: 'pink' };
        }
    };

    const typeDetails = getTypeDetails();

    return (
        <div className="relative min-h-[600px] bg-slate-50">
            {!isPremium && <PremiumLockOverlay onUnlock={onUnlock} />}
            
            {/* TABS DE SELEÇÃO DE CÁLCULO */}
            <div className={`flex space-x-1 mb-6 p-1 bg-white border border-slate-200 rounded-xl inline-flex ${!isPremium ? 'opacity-30' : ''}`}>
                {(['CIVIL', 'LABOR', 'TAX', 'FAMILY'] as CalculatorType[]).map(t => (
                    <button
                        key={t}
                        onClick={() => { setCalcType(t); setResult(null); }}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition flex items-center ${
                            calcType === t 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {t === 'CIVIL' ? 'Cível' : t === 'LABOR' ? 'Trabalhista' : t === 'TAX' ? 'Tributário' : 'Família'}
                    </button>
                ))}
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
                 
                 {/* --- PAINEL DE PARÂMETROS --- */}
                 <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-300 h-full">
                     <div className={`flex items-center justify-between mb-6 border-b border-slate-100 pb-4`}>
                         <h3 className={`font-bold text-slate-900 flex items-center`}>
                             <Settings className={`w-5 h-5 mr-2 text-slate-500`}/> 
                             Parâmetros
                         </h3>
                         <span className={`text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase`}>{typeDetails.label}</span>
                     </div>
                     
                     <div className="space-y-4">
                         {/* --- INPUTS TRABALHISTAS --- */}
                         {calcType === 'LABOR' && (
                             <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data Admissão</label>
                                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data Saída</label>
                                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Última Remuneração</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm"/>
                                     </div>
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Saldo FGTS (Para Multa 40%)</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={fgtsBalance} onChange={e => setFgtsBalance(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm"/>
                                     </div>
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo de Rescisão</label>
                                     <select value={laborReason} onChange={e => setLaborReason(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                                        <option value="NO_CAUSE">Dispensa Sem Justa Causa</option>
                                        <option value="JUST_CAUSE">Por Justa Causa</option>
                                        <option value="RESIGNATION">Pedido de Demissão</option>
                                     </select>
                                </div>
                             </>
                         )}

                         {/* --- INPUTS CÍVEIS / OUTROS --- */}
                         {calcType !== 'LABOR' && (
                             <>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Valor Original (Principal)</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm font-semibold"/>
                                     </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Termo Inicial</label>
                                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Termo Final</label>
                                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                </div>
                             </>
                         )}

                         {/* --- CONFIGURAÇÕES ESPECÍFICAS CÍVEL --- */}
                         {calcType === 'CIVIL' && (
                             <div className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Índice</label>
                                        <select value={index} onChange={e => setIndex(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                                            <option value="IGPM">IGP-M (FGV)</option>
                                            <option value="INPC">INPC (IBGE)</option>
                                            <option value="IPCA">IPCA-E</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Juros (a.m)</label>
                                        <div className="relative">
                                            <input type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none"/>
                                            <span className="absolute right-2 top-2 text-slate-400 text-xs">%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition">
                                        <input type="checkbox" checked={applyFineArt523} onChange={e => setApplyFineArt523(e.target.checked)} className="rounded text-slate-900 focus:ring-slate-500"/>
                                        <span className="text-sm text-slate-700">Aplicar Multa Art. 523 CPC (10%)</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Honorários Sucumbenciais</label>
                                    <div className="relative">
                                        <input type="number" value={honorariaPercent} onChange={e => setHonorariaPercent(Number(e.target.value))} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none"/>
                                        <span className="absolute right-3 top-2 text-slate-500 text-xs font-bold">%</span>
                                    </div>
                                </div>
                             </div>
                         )}

                         {/* --- CONFIGURAÇÕES FAMÍLIA --- */}
                         {calcType === 'FAMILY' && (
                             <div className="pt-2">
                                 <label className="flex items-center space-x-2 cursor-pointer">
                                     <input type="checkbox" checked={includeThirteenth} onChange={e => setIncludeThirteenth(e.target.checked)} className="rounded text-pink-600 focus:ring-pink-500"/>
                                     <span className="text-sm text-slate-700">Incluir reflexo em 13º Salário</span>
                                 </label>
                             </div>
                         )}
                         
                         <div className="pt-6 mt-auto">
                            <button 
                                onClick={handleCalculate}
                                disabled={loading}
                                className={`w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center shadow-lg text-sm uppercase tracking-wide`}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Calcular Liquidação'}
                            </button>
                         </div>
                     </div>
                 </div>

                 {/* --- PAINEL DE RESULTADOS (MEMÓRIA DE CÁLCULO) --- */}
                 <div className="lg:col-span-8 h-full">
                     {result ? (
                         <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden h-full flex flex-col animate-in fade-in duration-300">
                            {/* HEADER FORMAL */}
                            <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg flex items-center">
                                        <FileSpreadsheet className="w-5 h-5 mr-2 text-slate-500"/>
                                        Memória de Cálculo
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-bold">Atualizado até {new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2 text-slate-500 hover:text-slate-900 border border-slate-300 rounded hover:bg-white transition" title="Copiar">
                                        <Copy className="w-4 h-4"/>
                                    </button>
                                    <button className="p-2 text-slate-500 hover:text-slate-900 border border-slate-300 rounded hover:bg-white transition" title="Imprimir">
                                        <Printer className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>

                            {/* GRID DE RESULTADOS (TABELA) */}
                            <div className="flex-1 overflow-auto p-6">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200">
                                            <th className="text-left py-3 font-bold text-slate-600 uppercase text-xs">Descrição da Verba</th>
                                            <th className="text-right py-3 font-bold text-slate-600 uppercase text-xs w-32">Detalhes/Ref</th>
                                            <th className="text-right py-3 font-bold text-slate-600 uppercase text-xs w-40">Valor (R$)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-slate-700">
                                        {result.memoryGrid.map((item, idx) => (
                                            <tr key={idx} className={`border-b border-slate-100 hover:bg-slate-50 ${item.isTotal ? 'bg-slate-50 font-bold text-slate-900 text-base border-t-2 border-slate-300' : ''}`}>
                                                <td className="py-3 pr-4">{item.description}</td>
                                                <td className="py-3 text-right text-xs text-slate-500">{item.details || '-'}</td>
                                                <td className="py-3 text-right">{item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* RODAPÉ RESUMO */}
                            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">Valor Final da Execução</p>
                                    <p className="text-xs text-slate-500">Sujeito a conferência judicial</p>
                                </div>
                                <div className="text-3xl font-bold font-mono">
                                    R$ {result.updatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                         </div>
                     ) : (
                         <div className="h-full bg-white rounded-xl border border-slate-300 border-dashed flex flex-col items-center justify-center p-10 opacity-60 min-h-[400px]">
                            <div className={`w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4`}>
                                <Calculator className={`w-10 h-10 text-slate-400`}/>
                             </div>
                            <h3 className="text-lg font-bold text-slate-900">Aguardando Cálculo</h3>
                            <p className="text-slate-500 text-center text-sm max-w-xs">Preencha os parâmetros à esquerda e clique em calcular para gerar a tabela.</p>
                         </div>
                     )}
                 </div>
            </div>
        </div>
    );
};

export const ClientDashboard: React.FC = () => {
  const { currentUser, cases, createCase, logout, notifications } = useApp();
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  // New Case State
  const [description, setDescription] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const myCases = cases.filter(c => c.clientId === currentUser?.id);
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  const handleAnalyze = async () => {
    if(!description) return;
    setLoadingAi(true);
    const analysis = await analyzeCaseDescription(description);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  const handlePublish = async () => {
     if(!aiAnalysis || !city || !uf) {
         alert("Preencha todos os campos e aguarde a análise da IA.");
         return;
     }
     const price = calculateCasePrice(aiAnalysis.complexity);
     await createCase({
         title: aiAnalysis.title,
         description: description, // Original description
         area: aiAnalysis.area,
         city,
         uf,
         price,
         complexity: aiAnalysis.complexity
     });
     setAiAnalysis(null);
     setDescription('');
     setCity('');
     setUf('');
     setView('dashboard');
  };

  if (selectedCase) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl relative">
                <Chat 
                   currentCase={selectedCase} 
                   currentUser={currentUser!} 
                   otherPartyName="Advogado"
                   onClose={() => setSelectedCase(null)}
                />
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <Scale className="w-6 h-6 text-indigo-500" />
              <span>SocialJuris</span>
           </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
           <button onClick={() => setView('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Folders className="w-5 h-5"/> <span>Meus Casos</span>
           </button>
           <button onClick={() => setView('new-case')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${view === 'new-case' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Plus className="w-5 h-5"/> <span>Novo Caso</span>
           </button>
           <button onClick={() => setView('profile')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${view === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <UserIcon className="w-5 h-5"/> <span>Meu Perfil</span>
           </button>
           <button onClick={() => setView('notifications')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${view === 'notifications' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <div className="relative">
                 <Bell className="w-5 h-5"/>
                 {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>}
              </div> 
              <span>Notificações</span>
           </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition">
              <LogOut className="w-5 h-5"/> <span>Sair</span>
           </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 p-8">
         <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
                {view === 'dashboard' && 'Meus Casos'}
                {view === 'new-case' && 'Publicar Nova Demanda'}
                {view === 'profile' && 'Minha Conta'}
                {view === 'notifications' && 'Central de Notificações'}
            </h1>
            <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-500">Olá, {currentUser?.name}</span>
                <img src={currentUser?.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
            </div>
         </header>

         {/* VIEWS */}
         {view === 'dashboard' && (
            <div className="grid grid-cols-1 gap-6">
                {myCases.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Folders className="w-10 h-10 text-slate-300"/>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum caso encontrado</h3>
                        <p className="text-slate-500 mb-6">Você ainda não publicou nenhuma demanda jurídica.</p>
                        <button onClick={() => setView('new-case')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition">Criar Primeiro Caso</button>
                    </div>
                ) : (
                    myCases.map(c => (
                        <div key={c.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex justify-between items-center group">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.status === 'OPEN' ? 'bg-green-100 text-green-700' : c.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {c.status === 'OPEN' ? 'Aguardando Advogado' : c.status === 'ACTIVE' ? 'Em Andamento' : 'Finalizado'}
                                    </span>
                                    <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                                <p className="text-slate-500 text-sm mt-1 line-clamp-1">{c.description}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {c.lawyerId && (
                                    <button onClick={() => setSelectedCase(c)} className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition">
                                        <MessageSquare className="w-4 h-4 mr-2"/> Chat
                                    </button>
                                )}
                                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-100 transition">
                                    <ChevronRight className="w-5 h-5"/>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
         )}

         {view === 'new-case' && (
             <div className="max-w-3xl mx-auto">
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-8">
                         <label className="block text-lg font-bold text-slate-900 mb-4">Descreva seu problema</label>
                         <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Comprei um produto pela internet que nunca chegou e a loja não responde..."
                            className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-700 text-lg leading-relaxed mb-6"
                         />
                         
                         <button 
                            onClick={handleAnalyze}
                            disabled={loadingAi || !description}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center disabled:opacity-50"
                         >
                            {loadingAi ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <Sparkles className="w-5 h-5 mr-2 text-indigo-400"/>}
                            {loadingAi ? 'Analisando com IA...' : 'Analisar Caso e Ver Custo'}
                         </button>
                     </div>

                     {aiAnalysis && (
                         <div className="bg-indigo-50/50 p-8 border-t border-indigo-100 animate-in slide-in-from-bottom-4 duration-500">
                             <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center"><Check className="w-6 h-6 text-green-500 mr-2"/> Análise Concluída</h3>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                 <div className="bg-white p-4 rounded-xl border border-indigo-100">
                                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">Área Sugerida</p>
                                     <p className="font-bold text-indigo-700">{aiAnalysis.area}</p>
                                 </div>
                                 <div className="bg-white p-4 rounded-xl border border-indigo-100">
                                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">Complexidade</p>
                                     <p className="font-bold text-indigo-700">{aiAnalysis.complexity}</p>
                                 </div>
                                 <div className="col-span-2 bg-white p-4 rounded-xl border border-indigo-100">
                                     <p className="text-xs text-slate-500 font-bold uppercase mb-1">Título Profissional</p>
                                     <p className="font-bold text-slate-900">{aiAnalysis.title}</p>
                                 </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4 mb-8">
                                 <div>
                                     <label className="block text-sm font-bold text-slate-700 mb-2">Cidade</label>
                                     <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg" placeholder="Sua cidade" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-slate-700 mb-2">Estado</label>
                                     <select value={uf} onChange={e => setUf(e.target.value)} className="w-full p-3 border border-slate-300 rounded-lg">
                                         <option value="">UF</option>
                                         {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                     </select>
                                 </div>
                             </div>

                             <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                                 <div>
                                     <p className="text-slate-500 font-medium">Taxa de Publicação</p>
                                     <p className="text-xs text-slate-400">Pagamento único</p>
                                 </div>
                                 <div className="text-2xl font-bold text-slate-900">R$ {calculateCasePrice(aiAnalysis.complexity).toFixed(2)}</div>
                             </div>

                             <button 
                                onClick={handlePublish}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-600/30 transition flex items-center justify-center transform hover:-translate-y-1"
                             >
                                Pagar e Publicar Agora
                             </button>
                         </div>
                     )}
                 </div>
             </div>
         )}

         {view === 'profile' && <UserProfile />}
         {view === 'notifications' && <NotificationList />}

      </main>
    </div>
  );
};

export const LawyerDashboard: React.FC = () => {
  const { currentUser, cases, acceptCase, buyJuris, subscribePremium, logout, notifications } = useApp();
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // Filter cases
  const openCases = cases.filter(c => c.status === CaseStatus.OPEN);
  const myActiveCases = cases.filter(c => c.lawyerId === currentUser?.id);
  const unreadCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;

  // Render Logic
  if (selectedCase) {
      return (
          <div className="fixed inset-0 z-50 bg-slate-900/90 flex items-center justify-center p-4">
              <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl relative">
                  <Chat 
                     currentCase={selectedCase} 
                     currentUser={currentUser!} 
                     otherPartyName="Cliente"
                     onClose={() => setSelectedCase(null)}
                  />
              </div>
          </div>
      );
  }

  const SidebarItem = ({ id, icon: Icon, label, badge }: any) => (
      <button 
        onClick={() => setView(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition mb-1 ${view === id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white text-slate-400'}`}
      >
         <Icon className="w-5 h-5"/>
         <span className="flex-1 text-left">{label}</span>
         {badge > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
      </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
       <aside className="w-72 bg-slate-900 flex flex-col fixed h-full z-20 overflow-y-auto">
          <div className="p-6 border-b border-slate-800">
             <div className="flex items-center space-x-2 text-white font-bold text-xl">
                <Scale className="w-6 h-6 text-indigo-500" />
                <span>SocialJuris</span> <span className="text-xs bg-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded ml-2">ADV</span>
             </div>
             <div className="mt-6 bg-slate-800 rounded-xl p-4 flex items-center justify-between">
                 <div>
                     <p className="text-xs text-slate-400 font-bold uppercase">Seu Saldo</p>
                     <p className="text-white font-bold text-lg">{currentUser?.balance || 0} Juris</p>
                 </div>
                 <button onClick={() => setView('premium_sales')} className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition"><Plus className="w-4 h-4"/></button>
             </div>
          </div>
          
          <nav className="flex-1 p-4">
              <p className="text-xs font-bold text-slate-600 uppercase mb-3 px-4">Principal</p>
              <SidebarItem id="dashboard" icon={LayoutGrid} label="Visão Geral" />
              <SidebarItem id="market" icon={Search} label="Buscar Casos" badge={openCases.length} />
              <SidebarItem id="my-cases" icon={Briefcase} label="Meus Processos" badge={myActiveCases.length} />
              
              <p className="text-xs font-bold text-slate-600 uppercase mt-8 mb-3 px-4">Ferramentas PRO</p>
              <SidebarItem id="pro_analytics" icon={BarChart3} label="Analytics Jurídico" />
              <SidebarItem id="pro_strategy" icon={BrainCircuit} label="Opositor IA" />
              <SidebarItem id="pro_calculator" icon={Calculator} label="Calculadora Forense" />
              <SidebarItem id="pro_writer" icon={FileText} label="Redator Automático" />
              <SidebarItem id="pro_docs" icon={Files} label="Gestão de Docs" />
              
              <p className="text-xs font-bold text-slate-600 uppercase mt-8 mb-3 px-4">Conta</p>
              <SidebarItem id="notifications" icon={Bell} label="Notificações" badge={unreadCount} />
              <SidebarItem id="profile" icon={UserIcon} label="Meu Perfil" />
          </nav>

          <div className="p-4 border-t border-slate-800">
              <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition">
                 <LogOut className="w-5 h-5"/> <span>Sair</span>
              </button>
           </div>
       </aside>

       <main className="flex-1 ml-72 p-8">
           <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                  {view === 'dashboard' && 'Dashboard'}
                  {view === 'market' && 'Oportunidades em Aberto'}
                  {view === 'my-cases' && 'Meus Processos Ativos'}
                  {view === 'pro_strategy' && 'Análise Estratégica (IA)'}
                  {view === 'pro_calculator' && 'Calculadora Forense (Multi-Área)'}
              </h1>
              <div className="flex items-center space-x-4">
                 {!currentUser?.isPremium && (
                     <button onClick={() => setView('premium_sales')} className="bg-gradient-to-r from-amber-300 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition flex items-center">
                         <Sparkles className="w-4 h-4 mr-2"/> Assinar PRO
                     </button>
                 )}
                  <div className="text-right hidden md:block">
                      <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
                      <p className="text-xs text-slate-500">OAB: {currentUser?.oab || 'N/A'}</p>
                  </div>
                  <img src={currentUser?.avatar} alt="User" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
              </div>
           </header>

           {/* DASHBOARD HOME */}
           {view === 'dashboard' && (
               <div className="space-y-6 animate-in fade-in duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                           <div className="flex items-center justify-between mb-4">
                               <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Briefcase className="w-6 h-6"/></div>
                               <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
                           </div>
                           <p className="text-slate-500 text-sm font-medium">Processos Ativos</p>
                           <h3 className="text-3xl font-bold text-slate-900">{myActiveCases.length}</h3>
                       </div>
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                           <div className="flex items-center justify-between mb-4">
                               <div className="p-3 bg-green-50 rounded-xl text-green-600"><DollarSign className="w-6 h-6"/></div>
                               <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+5%</span>
                           </div>
                           <p className="text-slate-500 text-sm font-medium">Honorários Previstos</p>
                           <h3 className="text-3xl font-bold text-slate-900">R$ {((currentUser?.balance || 0) * 150).toLocaleString()}</h3>
                       </div>
                       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-50 rounded-xl text-orange-600"><Star className="w-6 h-6"/></div>
                                <span className="text-xs font-bold text-slate-400">Média</span>
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Avaliação</p>
                            <h3 className="text-3xl font-bold text-slate-900">4.9</h3>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-xl"><Sparkles className="w-6 h-6"/></div>
                            </div>
                            <p className="text-indigo-200 text-sm font-medium">Status da Conta</p>
                            <h3 className="text-2xl font-bold">{currentUser?.isPremium ? 'PRO Member' : 'Plano Grátis'}</h3>
                            {!currentUser?.isPremium && <button onClick={() => setView('premium_sales')} className="text-xs bg-white text-indigo-700 font-bold px-3 py-1.5 rounded-lg mt-3 hover:bg-indigo-50 transition">Fazer Upgrade</button>}
                        </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <div className="bg-white rounded-2xl border border-slate-200 p-6">
                           <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-slate-400"/> Atividade Recente</h3>
                           <div className="space-y-6">
                               {notifications.slice(0, 4).map(n => (
                                   <div key={n.id} className="flex items-start space-x-4">
                                       <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full"></div>
                                       <div>
                                           <p className="text-sm font-medium text-slate-800">{n.message}</p>
                                           <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                       <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center"><Search className="w-5 h-5 mr-2 text-slate-400"/> Oportunidades Recomendadas</h3>
                            <div className="space-y-4">
                                {openCases.slice(0, 3).map(c => (
                                    <div key={c.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition cursor-pointer" onClick={() => setView('market')}>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{c.city} - {c.uf}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-400"/>
                                    </div>
                                ))}
                            </div>
                       </div>
                   </div>
               </div>
           )}

           {/* MARKETPLACE */}
           {view === 'market' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                   {openCases.map(c => (
                       <div key={c.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition duration-300 group">
                           <div className="bg-slate-50 p-6 border-b border-slate-100">
                               <div className="flex justify-between items-start mb-4">
                                   <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">{c.area}</span>
                                   <span className="text-xs font-bold text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                               </div>
                               <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 h-14">{c.title}</h3>
                               <div className="flex items-center text-slate-500 text-sm">
                                   <MapPin className="w-4 h-4 mr-1"/> {c.city}/{c.uf}
                               </div>
                           </div>
                           <div className="p-6">
                               <p className="text-slate-600 text-sm line-clamp-3 mb-6 h-16">{c.description}</p>
                               <div className="flex items-center justify-between">
                                   <div className="text-xs">
                                       <span className="block text-slate-400">Complexidade</span>
                                       <span className="font-bold text-slate-700">{c.complexity || 'Média'}</span>
                                   </div>
                                   <button 
                                      onClick={() => acceptCase(c.id)}
                                      className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition shadow-lg"
                                    >
                                       Aceitar (5 Juris)
                                   </button>
                               </div>
                           </div>
                       </div>
                   ))}
                   {openCases.length === 0 && (
                       <div className="col-span-full py-20 text-center">
                           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                               <Search className="w-10 h-10 text-slate-300"/>
                           </div>
                           <h3 className="text-xl font-bold text-slate-900">Sem casos disponíveis no momento</h3>
                           <p className="text-slate-500">Aguarde novas publicações de clientes.</p>
                       </div>
                   )}
               </div>
           )}

           {/* MY CASES */}
           {view === 'my-cases' && (
               <div className="space-y-4 animate-in fade-in duration-500">
                   {myActiveCases.map(c => (
                       <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between hover:border-indigo-300 transition group">
                           <div className="flex-1 mb-4 md:mb-0">
                               <div className="flex items-center space-x-3 mb-2">
                                   <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                                   <h3 className="font-bold text-slate-900 text-lg">{c.title}</h3>
                               </div>
                               <p className="text-slate-500 text-sm mb-2">{c.description.substring(0, 100)}...</p>
                               <div className="flex space-x-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                   <span>{c.area}</span>
                                   <span>•</span>
                                   <span>{c.city}</span>
                               </div>
                           </div>
                           <div className="flex items-center space-x-4">
                               <button onClick={() => setSelectedCase(c)} className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition flex items-center">
                                   <MessageSquare className="w-4 h-4 mr-2"/> Abrir Chat
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
           )}

           {/* PREMIUM SALES PAGE */}
           {view === 'premium_sales' && (
               <div className="max-w-4xl mx-auto text-center animate-in zoom-in duration-300">
                   <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Potencialize sua Advocacia</h2>
                   <p className="text-xl text-slate-500 mb-12">Escolha o pacote ideal para captar mais clientes e usar ferramentas de IA.</p>
                   
                   <div className="grid md:grid-cols-2 gap-8 text-left">
                       {/* JURIS PACK */}
                       <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10"><Coins className="w-32 h-32"/></div>
                           <h3 className="text-2xl font-bold text-slate-900 mb-2">Pacote de Créditos</h3>
                           <p className="text-slate-500 mb-6">Compre "Juris" avulsos para aceitar casos específicos.</p>
                           <div className="text-4xl font-extrabold text-slate-900 mb-8">R$ 50,00 <span className="text-sm font-medium text-slate-400">/ 50 Juris</span></div>
                           <ul className="space-y-4 mb-8">
                               <li className="flex items-center text-slate-700"><Check className="w-5 h-5 text-green-500 mr-3"/> Aceite até 10 casos</li>
                               <li className="flex items-center text-slate-700"><Check className="w-5 h-5 text-green-500 mr-3"/> Sem validade de expiração</li>
                           </ul>
                           <button onClick={() => buyJuris(50)} className="w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-900 hover:bg-slate-200 transition">Comprar Créditos</button>
                       </div>

                       {/* PRO SUBSCRIPTION */}
                       <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden transform md:scale-105 border-2 border-indigo-500">
                           <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-bold px-3 py-1 rounded-full text-black">MAIS VENDIDO</div>
                           <h3 className="text-2xl font-bold mb-2">SocialJuris PRO</h3>
                           <p className="text-slate-400 mb-6">Acesso ilimitado às ferramentas de IA e destaque.</p>
                           <div className="text-4xl font-extrabold mb-8">R$ 69,90 <span className="text-sm font-medium text-slate-500">/ mês</span></div>
                           
                           {/* FEATURE GRID */}
                           <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/10 p-3 rounded-lg flex items-start">
                                    <BrainCircuit className="w-5 h-5 text-indigo-400 mr-2 mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-bold">Opositor IA</p>
                                        <p className="text-[10px] text-slate-400">Análise de falhas processuais</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg flex items-start">
                                    <Calculator className="w-5 h-5 text-indigo-400 mr-2 mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-bold">Calculadora</p>
                                        <p className="text-[10px] text-slate-400">Atualização Monetária Visual</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg flex items-start">
                                    <FileText className="w-5 h-5 text-indigo-400 mr-2 mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-bold">Redator</p>
                                        <p className="text-[10px] text-slate-400">Geração de Petições</p>
                                    </div>
                                </div>
                                <div className="bg-amber-500/20 p-3 rounded-lg flex items-start border border-amber-500/50">
                                    <Coins className="w-5 h-5 text-amber-400 mr-2 mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-bold text-amber-400">Bônus Mensal</p>
                                        <p className="text-[10px] text-amber-200">+20 Juris todo mês</p>
                                    </div>
                                </div>
                                <div className="col-span-2 bg-teal-500/20 p-3 rounded-lg flex items-start border border-teal-500/50">
                                    <BarChart3 className="w-5 h-5 text-teal-400 mr-2 mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-bold text-teal-400">Analytics Jurídico</p>
                                        <p className="text-[10px] text-teal-200">Análise de dados de todas as ferramentas</p>
                                    </div>
                                </div>
                           </div>

                           <button onClick={subscribePremium} className="w-full py-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/50">
                               {currentUser?.isPremium ? 'Plano Ativo' : 'Assinar Agora'}
                           </button>
                       </div>
                   </div>
               </div>
           )}

           {/* PRO TOOLS VIEWS */}
           {view === 'pro_analytics' && <FeatureComingSoon title="Analytics Jurídico" icon={BarChart3} desc="Painel de inteligência de dados que cruza informações dos seus casos, cálculos e teses para otimizar sua performance." />}
           {view === 'pro_strategy' && <StrategyAnalyzer isPremium={currentUser?.isPremium || false} onUnlock={() => setView('premium_sales')} />}
           {view === 'pro_calculator' && <LegalCalculator isPremium={currentUser?.isPremium || false} onUnlock={() => setView('premium_sales')} />}
           {view === 'pro_writer' && <FeatureComingSoon title="Redator Automático" icon={FileText} desc="Gere petições completas baseadas nos fatos do caso usando nossa IA generativa avançada." />}
           {view === 'pro_docs' && <FeatureComingSoon title="Gestão Inteligente" icon={Folders} desc="Organize documentos, contratos e provas com indexação automática e busca semântica." />}

           {view === 'profile' && <UserProfile />}
           {view === 'notifications' && <NotificationList />}

       </main>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
    const { users, verifyLawyer, logout } = useApp();
    const pendingLawyers = users.filter(u => u.role === UserRole.LAWYER && !u.verified);
    const [selectedLawyer, setSelectedLawyer] = useState<User | null>(null);

    return (
        <div className="min-h-screen bg-slate-100 p-8 font-sans relative">
            {/* SIDE DRAWER FOR LAWYER DETAILS */}
            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${selectedLawyer ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
                 {selectedLawyer && (
                     <div className="flex flex-col h-full">
                         <div className="bg-slate-900 text-white p-6 relative">
                             <button onClick={() => setSelectedLawyer(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-6 h-6"/></button>
                             <div className="w-20 h-20 bg-white rounded-full p-1 mb-4">
                                 <img src={selectedLawyer.avatar} className="w-full h-full rounded-full object-cover"/>
                             </div>
                             <h2 className="text-xl font-bold">{selectedLawyer.name}</h2>
                             <p className="text-slate-400 text-sm">Candidato a Advogado</p>
                         </div>
                         <div className="p-6 flex-1 space-y-6">
                             <div>
                                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Informações de Contato</p>
                                 <p className="flex items-center text-slate-700 mb-1"><Mail className="w-4 h-4 mr-2"/> {selectedLawyer.email}</p>
                                 <p className="flex items-center text-slate-700"><Phone className="w-4 h-4 mr-2"/> {selectedLawyer.phone || 'Não informado'}</p>
                             </div>
                             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                 <p className="text-xs font-bold text-indigo-800 uppercase mb-2 flex items-center"><Shield className="w-4 h-4 mr-1"/> Dados Profissionais</p>
                                 <div className="mb-2">
                                     <span className="text-sm text-slate-500 block">Número OAB</span>
                                     <span className="font-mono font-bold text-lg text-slate-900">{selectedLawyer.oab || 'PENDENTE'}</span>
                                 </div>
                                 <div>
                                     <span className="text-sm text-slate-500 block">Data de Registro</span>
                                     <span className="text-slate-900">{new Date(selectedLawyer.createdAt).toLocaleDateString()}</span>
                                 </div>
                             </div>
                             <div>
                                 <p className="text-xs font-bold text-slate-500 uppercase mb-1">Biografia / Resumo</p>
                                 <p className="text-slate-600 text-sm italic p-3 bg-slate-50 rounded-lg border border-slate-100">
                                     "{selectedLawyer.bio || 'O advogado não forneceu uma biografia no momento do cadastro.'}"
                                 </p>
                             </div>
                         </div>
                         <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
                             <div className="grid grid-cols-2 gap-4">
                                 <button onClick={() => setSelectedLawyer(null)} className="px-4 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition">Recusar</button>
                                 <button onClick={() => { verifyLawyer(selectedLawyer.id); setSelectedLawyer(null); }} className="px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-600/20">Aprovar Cadastro</button>
                             </div>
                         </div>
                     </div>
                 )}
            </div>
            
            {/* OVERLAY BACKDROP */}
            {selectedLawyer && <div className="fixed inset-0 bg-black/20 z-20" onClick={() => setSelectedLawyer(null)}></div>}

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
                        <p className="text-slate-500">Gestão de plataforma e verificação de profissionais</p>
                    </div>
                    <button onClick={logout} className="bg-white text-red-500 px-4 py-2 rounded-lg font-bold border border-red-100 hover:bg-red-50 transition">Sair do Sistema</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Total de Usuários</p>
                        <h3 className="text-4xl font-bold text-slate-900">{users.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Advogados Pendentes</p>
                        <h3 className="text-4xl font-bold text-amber-500">{pendingLawyers.length}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Receita Mensal (Est.)</p>
                        <h3 className="text-4xl font-bold text-green-600">R$ 12.450</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900">Solicitações de Verificação</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {pendingLawyers.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                Nenhuma solicitação pendente.
                            </div>
                        ) : (
                            pendingLawyers.map(user => (
                                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedLawyer(user)}>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{user.name}</h3>
                                            <p className="text-slate-500 text-sm">{user.email}</p>
                                            <div className="flex items-center mt-1 space-x-2">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono">OAB: {user.oab || 'Não informada'}</span>
                                                <span className="text-xs text-slate-400">Cadastrado em {new Date(user.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-indigo-600 text-sm font-bold">
                                        Ver Detalhes <ChevronRight className="w-4 h-4 ml-1"/>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function Star(props: any) {
    return (
        <svg 
          {...props} 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function Files(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
