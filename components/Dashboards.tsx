
import React, { useState } from 'react';
import { useApp } from '../store';
import { UserRole, CaseStatus, Case, User, Notification, StrategyAnalysis, CalculationResult, CalculatorType, CalculationLineItem } from '../types';
import { Plus, Briefcase, MessageSquare, Check, X, Bell, User as UserIcon, LogOut, Award, DollarSign, Users, Activity, Filter, Search, Save, Settings, Phone, Mail, Shield, AlertCircle, MapPin, CreditCard, Coins, Loader2, Lock, FileText, Calculator, Calendar, Scale, Sparkles, BrainCircuit, TrendingUp, BarChart3, AlertTriangle, Zap, FileSearch, Folders, Clock, Eye, XCircle, Hammer, LayoutGrid, PieChart, ChevronRight, Copy, Printer, BookOpen, Download, RefreshCw, ChevronDown, GraduationCap, Heart, Landmark, BriefcaseBusiness, FileSpreadsheet, Home, Gavel, ShoppingBag, Globe } from 'lucide-react';
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
    
    // GENERIC
    const [startDate, setStartDate] = useState('2022-01-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // STATE - CIVIL
    const [amount, setAmount] = useState(10000);
    const [index, setIndex] = useState('IGPM');
    const [interestRate, setInterestRate] = useState(1);
    const [applyFineArt523, setApplyFineArt523] = useState(false);
    const [honorariaPercent, setHonorariaPercent] = useState(10);
    
    // STATE - LABOR
    const [salary, setSalary] = useState(3000);
    const [laborReason, setLaborReason] = useState('NO_CAUSE');
    const [fgtsBalance, setFgtsBalance] = useState(0);

    // STATE - TAX
    const [amountPaid, setAmountPaid] = useState(5000);
    const [paymentDate, setPaymentDate] = useState('2023-01-01');
    const [taxType, setTaxType] = useState('FEDERAL');

    // STATE - FAMILY
    const [monthlyAlimony, setMonthlyAlimony] = useState(1200);
    const [includeThirteenth, setIncludeThirteenth] = useState(true);
    const [extraExpenses, setExtraExpenses] = useState(0);

    // STATE - CRIMINAL
    const [sentenceYears, setSentenceYears] = useState(5);
    const [sentenceMonths, setSentenceMonths] = useState(4);
    const [crimeType, setCrimeType] = useState('NON_VIOLENT');
    const [isRecidivist, setIsRecidivist] = useState(false);

    // STATE - RENT
    const [currentRent, setCurrentRent] = useState(2500);
    const [monthsAccumulated, setMonthsAccumulated] = useState(12);

    // STATE - CONSUMER
    const [chargedValue, setChargedValue] = useState(150);
    const [isBadFaith, setIsBadFaith] = useState(true);

    const [result, setResult] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        const params = {
            // General
            startDate, endDate,
            // Civil
            amount, index, interestRate, applyFineArt523, honorariaPercent,
            // Labor
            salary, reason: laborReason, fgtsBalance,
            // Tax
            amountPaid, taxType,
            // Family
            monthlyAlimony, includeThirteenth, extraExpenses,
            // Criminal
            sentenceYears, sentenceMonths, crimeType, isRecidivist,
            // Rent
            currentRent, indexType: index, monthsAccumulated, 
            // Consumer
            chargedValue, isBadFaith,
            // Shared
            paymentDate
        };
        
        const res = await calculateLegalAdjustment(calcType, params);
        setResult(res);
        setLoading(false);
    };

    const getTypeDetails = () => {
        switch(calcType) {
            case 'CIVIL': return { icon: Scale, label: 'Cível (Sentença)', color: 'indigo' };
            case 'LABOR': return { icon: BriefcaseBusiness, label: 'Trabalhista (Rescisão)', color: 'orange' };
            case 'TAX': return { icon: Landmark, label: 'Tributário (Repetição)', color: 'blue' };
            case 'FAMILY': return { icon: Heart, label: 'Família (Alimentos)', color: 'pink' };
            case 'CRIMINAL': return { icon: Gavel, label: 'Penal (Progressão)', color: 'red' };
            case 'RENT': return { icon: Home, label: 'Imobiliário (Aluguel)', color: 'emerald' };
            case 'CONSUMER': return { icon: ShoppingBag, label: 'Consumidor (Indébito)', color: 'purple' };
            default: return { icon: Scale, label: 'Geral', color: 'slate' };
        }
    };

    const typeDetails = getTypeDetails();

    return (
        <div className="relative min-h-[600px] bg-slate-50">
            {!isPremium && <PremiumLockOverlay onUnlock={onUnlock} />}
            
            {/* TABS DE SELEÇÃO DE CÁLCULO */}
            <div className={`mb-6 overflow-x-auto pb-2 ${!isPremium ? 'opacity-30' : ''}`}>
                <div className="flex space-x-2 bg-white border border-slate-200 p-1 rounded-xl inline-flex min-w-max">
                    {(['CIVIL', 'LABOR', 'TAX', 'FAMILY', 'CRIMINAL', 'RENT', 'CONSUMER'] as CalculatorType[]).map(t => (
                        <button
                            key={t}
                            onClick={() => { setCalcType(t); setResult(null); }}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center whitespace-nowrap ${
                                calcType === t 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {t === 'CIVIL' ? 'Cível' : t === 'LABOR' ? 'Trabalhista' : t === 'TAX' ? 'Tributário' : t === 'FAMILY' ? 'Família' : t === 'CRIMINAL' ? 'Penal' : t === 'RENT' ? 'Aluguel' : 'Consumidor'}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!isPremium ? 'opacity-30 pointer-events-none' : ''}`}>
                 
                 {/* --- PAINEL DE PARÂMETROS --- */}
                 <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-300 h-full">
                     <div className={`flex items-center justify-between mb-6 border-b border-slate-100 pb-4`}>
                         <h3 className={`font-bold text-slate-900 flex items-center`}>
                             <typeDetails.icon className={`w-5 h-5 mr-2 text-slate-500`}/> 
                             Parâmetros
                         </h3>
                         <span className={`text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold uppercase`}>{typeDetails.label}</span>
                     </div>
                     
                     <div className="space-y-4">
                         
                         {/* --- INPUTS CRIMINAL --- */}
                         {calcType === 'CRIMINAL' && (
                             <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Anos Pena</label>
                                        <input type="number" value={sentenceYears} onChange={e => setSentenceYears(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Meses Pena</label>
                                        <input type="number" value={sentenceMonths} onChange={e => setSentenceMonths(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tipo de Crime</label>
                                     <select value={crimeType} onChange={e => setCrimeType(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                                        <option value="NON_VIOLENT">Sem Violência (Comum)</option>
                                        <option value="VIOLENT">Com Violência / Grave Ameaça</option>
                                        <option value="HEDIOUS">Hediondo / Equiparado</option>
                                     </select>
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={isRecidivist} onChange={e => setIsRecidivist(e.target.checked)} className="rounded text-red-600 focus:ring-red-500"/>
                                        <span className="text-sm text-slate-700">Réu Reincidente?</span>
                                    </label>
                                </div>
                             </div>
                         )}

                         {/* --- INPUTS RENT (ALUGUEL) --- */}
                         {calcType === 'RENT' && (
                             <div className="space-y-4">
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Aluguel Atual</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={currentRent} onChange={e => setCurrentRent(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm font-semibold"/>
                                     </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Índice Contratual</label>
                                    <select value={index} onChange={e => setIndex(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                                        <option value="IGPM">IGP-M (FGV)</option>
                                        <option value="IPCA">IPCA (IBGE)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Meses Acumulados</label>
                                    <input type="number" value={monthsAccumulated} onChange={e => setMonthsAccumulated(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm" placeholder="Ex: 12"/>
                                </div>
                             </div>
                         )}

                         {/* --- INPUTS CONSUMER (CDC) --- */}
                         {calcType === 'CONSUMER' && (
                             <div className="space-y-4">
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Valor Cobrado Indevidamente</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={chargedValue} onChange={e => setChargedValue(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm font-semibold"/>
                                     </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data do Pagamento</label>
                                    <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <input type="checkbox" checked={isBadFaith} onChange={e => setIsBadFaith(e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500"/>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">Devolução em Dobro</span>
                                            <span className="text-[10px] text-slate-400">Art. 42 CDC - Má-fé ou Erro injustificável</span>
                                        </div>
                                    </label>
                                </div>
                             </div>
                         )}

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

                         {/* --- INPUTS TRIBUTÁRIOS (SELIC) --- */}
                         {calcType === 'TAX' && (
                             <div className="space-y-4">
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                                    <p className="font-bold mb-1">Regra de Correção:</p>
                                    Os tributos federais são corrigidos exclusivamente pela taxa SELIC acumulada (Lei 9.250/95), sem juros moratórios adicionais.
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Valor do Pagamento Indevido</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm font-semibold"/>
                                     </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data do Pagamento</label>
                                    <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                </div>
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Esfera Tributária</label>
                                     <select value={taxType} onChange={e => setTaxType(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-sm outline-none">
                                        <option value="FEDERAL">Federal (SELIC)</option>
                                        <option value="STATE">Estadual (IPCA + Juros)</option>
                                     </select>
                                </div>
                             </div>
                         )}

                         {/* --- INPUTS FAMÍLIA (PENSÃO) --- */}
                         {calcType === 'FAMILY' && (
                             <div className="space-y-4">
                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Valor da Parcela Mensal</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={monthlyAlimony} onChange={e => setMonthlyAlimony(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm font-semibold"/>
                                     </div>
                                     <p className="text-[10px] text-slate-400 mt-1">O cálculo considerará a soma das parcelas vencidas no período.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Início da Dívida</label>
                                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Data Final</label>
                                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm"/>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={includeThirteenth} onChange={e => setIncludeThirteenth(e.target.checked)} className="rounded text-pink-600 focus:ring-pink-500"/>
                                        <span className="text-sm text-slate-700">Incide sobre 13º e Férias?</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="checkbox" checked={applyFineArt523} onChange={e => setApplyFineArt523(e.target.checked)} className="rounded text-pink-600 focus:ring-pink-500"/>
                                        <span className="text-sm text-slate-700">Aplicar Multa 10% (Art. 523 CPC)</span>
                                    </label>
                                </div>

                                <div>
                                     <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Despesas Extras (Médico/Escola)</label>
                                     <div className="relative">
                                         <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">R$</span>
                                         <input type="number" value={extraExpenses} onChange={e => setExtraExpenses(Number(e.target.value))} className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-1 focus:ring-slate-400 outline-none text-sm"/>
                                     </div>
                                     <p className="text-[10px] text-slate-400 mt-1">Valor total de despesas a serem partilhadas.</p>
                                </div>
                             </div>
                         )}

                         {/* --- INPUTS CÍVEIS (GENÉRICO) --- */}
                         {calcType === 'CIVIL' && (
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
                         
                         <div className="pt-6 mt-auto">
                            <button 
                                onClick={handleCalculate}
                                disabled={loading}
                                className={`w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center shadow-lg text-sm uppercase tracking-wide`}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Calcular'}
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
                                            <th className="text-left py-3 font-bold text-slate-600 uppercase text-xs">Descrição</th>
                                            <th className="text-right py-3 font-bold text-slate-600 uppercase text-xs w-32">Detalhes/Ref</th>
                                            <th className="text-right py-3 font-bold text-slate-600 uppercase text-xs w-40">Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono text-slate-700">
                                        {result.memoryGrid.map((item, idx) => (
                                            <tr key={idx} className={`border-b border-slate-100 hover:bg-slate-50 ${item.isTotal ? 'bg-slate-50 font-bold text-slate-900 text-base border-t-2 border-slate-300' : ''}`}>
                                                <td className="py-3 pr-4">{item.description}</td>
                                                <td className="py-3 text-right text-xs text-slate-500">{item.details || '-'}</td>
                                                <td className="py-3 text-right">
                                                    {item.unit === '%' ? `${item.value.toFixed(2)}%` : 
                                                     item.unit === 'Dias' || item.unit === 'Dias Totais' || item.unit === 'Anos' ? item.value : 
                                                     item.unit === 'Tempo' || item.unit === 'Status' ? '' :
                                                     item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* RODAPÉ RESUMO */}
                            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">
                                        {calcType === 'CRIMINAL' ? 'Tempo para Progressão' : 'Valor Total Final'}
                                    </p>
                                    <p className="text-xs text-slate-500">Conferência Recomendada</p>
                                </div>
                                <div className="text-3xl font-bold font-mono">
                                    {typeof result.updatedValue === 'number' 
                                        ? `R$ ${result.updatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                        : result.updatedValue}
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

// --- DASHBOARD COMPONENTS ---

export const ClientDashboard: React.FC = () => {
  const { currentUser, cases, logout, createCase } = useApp();
  const [view, setView] = useState<ViewType>('my-cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  
  // New Case State
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');

  const myCases = cases.filter(c => c.clientId === currentUser?.id);
  const selectedCase = cases.find(c => c.id === selectedCaseId);

  const handleAnalyze = async () => {
     if(!description) return;
     setIsAnalyzing(true);
     const result = await analyzeCaseDescription(description);
     setAnalysis(result);
     setIsAnalyzing(false);
  };

  const handlePublish = async () => {
      if(!analysis) return;
      await createCase({
          title: analysis.title,
          description: description,
          area: analysis.area,
          complexity: analysis.complexity,
          price: calculateCasePrice(analysis.complexity),
          city: city || 'Não informado',
          uf: uf || 'UF'
      });
      setAnalysis(null);
      setDescription('');
      setView('my-cases');
  };

  const MenuItem = ({ id, icon: Icon, label }: any) => (
      <button 
        onClick={() => { setView(id); setSelectedCaseId(null); }}
        className={`w-full flex items-center space-x-3 px-6 py-4 transition border-l-4 ${view === id ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
      >
          <Icon className="w-5 h-5" />
          <span className="font-semibold">{label}</span>
      </button>
  );

  return (
      <div className="min-h-screen bg-slate-50 flex font-sans">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-20 hidden md:block">
              <div className="h-20 flex items-center px-8 border-b border-slate-100">
                  <Scale className="w-8 h-8 text-indigo-600 mr-2" />
                  <span className="font-bold text-slate-900 text-xl">SocialJuris</span>
              </div>
              <nav className="mt-6">
                  <MenuItem id="my-cases" icon={Folders} label="Meus Casos" />
                  <MenuItem id="new-case" icon={Plus} label="Novo Caso" />
                  <MenuItem id="notifications" icon={Bell} label="Notificações" />
                  <MenuItem id="profile" icon={UserIcon} label="Meu Perfil" />
              </nav>
              <div className="absolute bottom-0 w-full p-6 border-t border-slate-100">
                  <button onClick={logout} className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition font-medium">
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                  </button>
              </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-64 p-8">
              {/* Mobile Header */}
              <div className="md:hidden flex justify-between items-center mb-8">
                  <Scale className="w-8 h-8 text-indigo-600" />
                  <button onClick={logout}><LogOut className="w-6 h-6 text-slate-500" /></button>
              </div>

              {view === 'my-cases' && (
                  !selectedCase ? (
                      <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                          <div className="flex justify-between items-center mb-8">
                              <h1 className="text-2xl font-bold text-slate-900">Meus Casos</h1>
                              <button onClick={() => setView('new-case')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center shadow-lg hover:-translate-y-0.5">
                                  <Plus className="w-5 h-5 mr-2" /> Novo Caso
                              </button>
                          </div>
                          <div className="grid gap-6">
                              {myCases.length === 0 ? (
                                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                      <Folders className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                      <h3 className="text-lg font-bold text-slate-900">Nenhum caso encontrado</h3>
                                      <p className="text-slate-500 mb-6">Você ainda não publicou nenhuma demanda jurídica.</p>
                                      <button onClick={() => setView('new-case')} className="text-indigo-600 font-bold hover:underline">Começar agora</button>
                                  </div>
                              ) : (
                                  myCases.map(c => (
                                      <div key={c.id} onClick={() => setSelectedCaseId(c.id)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group">
                                          <div className="flex justify-between items-start">
                                              <div>
                                                  <div className="flex items-center space-x-2 mb-2">
                                                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status === 'OPEN' ? 'bg-green-100 text-green-700' : c.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                          {c.status === 'OPEN' ? 'Aberto' : c.status === 'ACTIVE' ? 'Em Andamento' : 'Encerrado'}
                                                      </span>
                                                      <span className="text-slate-400 text-xs">• {new Date(c.createdAt).toLocaleDateString()}</span>
                                                  </div>
                                                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">{c.title}</h3>
                                                  <p className="text-slate-500 text-sm mt-1 line-clamp-2">{c.description}</p>
                                              </div>
                                              <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition" />
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="h-[calc(100vh-4rem)] flex flex-col animate-in slide-in-from-right-4 duration-300">
                          <button onClick={() => setSelectedCaseId(null)} className="mb-4 flex items-center text-slate-500 hover:text-slate-900 font-bold w-fit">
                              <ChevronRight className="w-5 h-5 rotate-180 mr-1" /> Voltar
                          </button>
                          <div className="flex-1 flex gap-6 overflow-hidden">
                              <div className="w-1/3 bg-white p-6 rounded-2xl border border-slate-200 overflow-y-auto hidden lg:block">
                                  <h2 className="font-bold text-xl mb-4 text-slate-900">{selectedCase.title}</h2>
                                  <div className="space-y-4 text-sm">
                                      <div><span className="text-slate-500 block text-xs uppercase font-bold">Área</span> {selectedCase.area}</div>
                                      <div><span className="text-slate-500 block text-xs uppercase font-bold">Complexidade</span> {selectedCase.complexity}</div>
                                      <div><span className="text-slate-500 block text-xs uppercase font-bold">Local</span> {selectedCase.city}/{selectedCase.uf}</div>
                                      <div className="pt-4 border-t border-slate-100">
                                          <p className="text-slate-600 leading-relaxed">{selectedCase.description}</p>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex-1">
                                  {selectedCase.status === 'OPEN' ? (
                                      <div className="h-full bg-slate-100 rounded-2xl flex items-center justify-center flex-col text-center p-8">
                                          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                          <h3 className="text-xl font-bold text-slate-900">Aguardando Advogado</h3>
                                          <p className="text-slate-500 max-w-md mt-2">Seu caso está visível para advogados de todo o Brasil. Você será notificado assim que alguém aceitar.</p>
                                      </div>
                                  ) : (
                                      <Chat 
                                          currentCase={selectedCase} 
                                          currentUser={currentUser!} 
                                          otherPartyName={selectedCase.lawyerId ? "Advogado Responsável" : "Advogado"}
                                      />
                                  )}
                              </div>
                          </div>
                      </div>
                  )
              )}

              {view === 'new-case' && (
                  <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
                      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                          <div className="p-8 border-b border-slate-100">
                              <h2 className="text-2xl font-bold text-slate-900">Novo Caso</h2>
                              <p className="text-slate-500">Descreva seu problema e nossa IA classificará para você.</p>
                          </div>
                          <div className="p-8 space-y-6">
                              {!analysis ? (
                                  <>
                                      <div className="space-y-2">
                                          <label className="font-bold text-slate-700">Relato do Caso</label>
                                          <textarea 
                                              value={description}
                                              onChange={e => setDescription(e.target.value)}
                                              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                              placeholder="Ex: Comprei um produto que veio com defeito e a loja se recusa a trocar..."
                                          />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="font-bold text-slate-700 text-sm">Cidade</label>
                                              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                                          </div>
                                          <div>
                                              <label className="font-bold text-slate-700 text-sm">UF</label>
                                              <select value={uf} onChange={e => setUf(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none">
                                                  <option value="">Selecione</option>
                                                  {BRAZIL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                              </select>
                                          </div>
                                      </div>
                                      <button 
                                          onClick={handleAnalyze}
                                          disabled={isAnalyzing || !description}
                                          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center disabled:opacity-50"
                                      >
                                          {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />}
                                          {isAnalyzing ? 'Analisando com IA...' : 'Analisar Caso'}
                                      </button>
                                  </>
                              ) : (
                                  <div className="animate-in slide-in-from-bottom-4 duration-500">
                                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
                                          <h3 className="font-bold text-indigo-900 text-lg mb-4 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-600"/> Análise da IA</h3>
                                          <div className="space-y-3 text-sm">
                                              <div className="flex justify-between border-b border-indigo-100 pb-2">
                                                  <span className="text-indigo-600">Área Sugerida</span>
                                                  <span className="font-bold text-indigo-900">{analysis.area}</span>
                                              </div>
                                              <div className="flex justify-between border-b border-indigo-100 pb-2">
                                                  <span className="text-indigo-600">Título Profissional</span>
                                                  <span className="font-bold text-indigo-900">{analysis.title}</span>
                                              </div>
                                              <div className="flex justify-between border-b border-indigo-100 pb-2">
                                                  <span className="text-indigo-600">Complexidade</span>
                                                  <span className="font-bold text-indigo-900">{analysis.complexity}</span>
                                              </div>
                                              <div className="flex justify-between pt-2">
                                                  <span className="text-indigo-600 font-bold">Taxa de Publicação</span>
                                                  <span className="font-bold text-indigo-900 text-lg">R$ {calculateCasePrice(analysis.complexity).toFixed(2)}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className="flex space-x-4">
                                          <button onClick={() => setAnalysis(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition">Editar</button>
                                          <button onClick={handlePublish} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20">
                                              Confirmar e Publicar
                                          </button>
                                      </div>
                                  </div>
                              )}
                          </div>
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
  const { currentUser, cases, acceptCase, logout, buyJuris, subscribePremium } = useApp();
  const [view, setView] = useState<ViewType>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Filters for marketplace
  const [filterArea, setFilterArea] = useState('Todas');
  
  const myCases = cases.filter(c => c.lawyerId === currentUser?.id);
  const openCases = cases.filter(c => c.status === 'OPEN');
  const selectedCase = cases.find(c => c.id === selectedCaseId);

  const filteredMarket = filterArea === 'Todas' ? openCases : openCases.filter(c => c.area.includes(filterArea));
  const uniqueAreas = ['Todas', ...Array.from(new Set(openCases.map(c => c.area)))];

  const handleAccept = async (id: string) => {
      if(confirm('Confirmar o aceite deste caso por 5 Juris?')) {
          await acceptCase(id);
          setView('my-cases');
          setSelectedCaseId(id);
      }
  };

  const NavItem = ({ id, icon: Icon, label }: any) => (
      <button 
        onClick={() => { setView(id); setSelectedCaseId(null); }}
        className={`w-full flex items-center space-x-3 px-6 py-3 transition text-sm ${view === id ? 'text-white bg-white/10 border-r-4 border-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
          <Icon className="w-4 h-4" />
          <span className="font-medium">{label}</span>
      </button>
  );

  return (
      <div className="min-h-screen bg-slate-100 flex font-sans">
          {/* Dark Sidebar for Lawyer */}
          <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 flex flex-col hidden md:flex">
              <div className="h-20 flex items-center px-6 border-b border-slate-800">
                   <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
                       <Scale className="w-5 h-5 text-white" />
                   </div>
                   <span className="font-bold text-lg tracking-tight">SocialJuris <span className="text-indigo-400 text-xs align-top">ADV</span></span>
              </div>
              
              <div className="p-6 pb-2">
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Seu Saldo</p>
                      <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-white flex items-center"><Coins className="w-5 h-5 mr-2 text-yellow-500"/> {currentUser?.balance || 0}</span>
                          <button onClick={() => setView('premium_sales')} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2 py-1 rounded font-bold transition">+</button>
                      </div>
                  </div>
              </div>

              <nav className="flex-1 py-4 space-y-1">
                  <div className="px-6 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Gestão</div>
                  <NavItem id="dashboard" icon={Globe} label="Oportunidades" />
                  <NavItem id="my-cases" icon={Briefcase} label="Meus Processos" />
                  
                  <div className="px-6 pt-6 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Ferramentas PRO</div>
                  <NavItem id="pro_calculator" icon={Calculator} label="Calculadora Forense" />
                  <NavItem id="pro_strategy" icon={BrainCircuit} label="Estratégia IA" />
                  <NavItem id="pro_docs" icon={FileSearch} label="Análise Docs" />

                  <div className="px-6 pt-6 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Conta</div>
                  <NavItem id="profile" icon={UserIcon} label="Perfil Profissional" />
                  <NavItem id="notifications" icon={Bell} label="Notificações" />
                  <NavItem id="premium_sales" icon={Award} label="Assinatura Premium" />
              </nav>

              <div className="p-4 border-t border-slate-800">
                  <button onClick={logout} className="flex items-center space-x-2 text-slate-400 hover:text-white transition text-sm">
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                  </button>
              </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
               {/* View Routing */}
               {view === 'dashboard' && (
                   <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                       <header className="mb-8 flex flex-col md:flex-row justify-between items-end md:items-center">
                           <div>
                               <h1 className="text-3xl font-bold text-slate-900">Oportunidades</h1>
                               <p className="text-slate-500 mt-1">Explore casos recentes publicados por clientes verificados.</p>
                           </div>
                           <div className="mt-4 md:mt-0">
                               <div className="relative">
                                   <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                   <select 
                                     value={filterArea} 
                                     onChange={(e) => setFilterArea(e.target.value)} 
                                     className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                   >
                                       {uniqueAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                   </select>
                               </div>
                           </div>
                       </header>

                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {filteredMarket.length === 0 ? (
                               <div className="col-span-full text-center py-20">
                                   <p className="text-slate-500">Nenhuma oportunidade disponível no momento para o filtro selecionado.</p>
                               </div>
                           ) : (
                               filteredMarket.map(c => (
                                   <div key={c.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full">
                                       <div className="flex justify-between items-start mb-4">
                                           <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{c.area}</span>
                                           <span className="text-slate-400 text-xs font-semibold">{new Date(c.createdAt).toLocaleDateString()}</span>
                                       </div>
                                       <h3 className="text-xl font-bold text-slate-900 mb-2">{c.title}</h3>
                                       <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">{c.description}</p>
                                       
                                       <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                           <div className="flex items-center text-slate-500 text-xs font-bold">
                                               <MapPin className="w-4 h-4 mr-1" />
                                               {c.city}/{c.uf}
                                           </div>
                                           <button 
                                              onClick={() => handleAccept(c.id)}
                                              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
                                           >
                                               Aceitar (-5 Juris)
                                           </button>
                                       </div>
                                   </div>
                               ))
                           )}
                       </div>
                   </div>
               )}

               {view === 'my-cases' && (
                   selectedCase ? (
                       <div className="h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
                           <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                               <div className="flex items-center space-x-4">
                                   <button onClick={() => setSelectedCaseId(null)} className="p-2 hover:bg-white rounded-full transition"><ChevronRight className="w-5 h-5 rotate-180 text-slate-500" /></button>
                                   <div>
                                       <h2 className="font-bold text-slate-900">{selectedCase.title}</h2>
                                       <div className="flex items-center text-xs text-slate-500 space-x-2">
                                           <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">{selectedCase.status}</span>
                                           <span>• Cliente ID: {selectedCase.clientId.substring(0,8)}</span>
                                       </div>
                                   </div>
                               </div>
                           </div>
                           <div className="flex-1 overflow-hidden">
                               <Chat 
                                 currentCase={selectedCase} 
                                 currentUser={currentUser!} 
                                 otherPartyName="Cliente" 
                               />
                           </div>
                       </div>
                   ) : (
                       <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                           <h1 className="text-2xl font-bold text-slate-900 mb-6">Meus Processos Ativos</h1>
                           <div className="space-y-4">
                               {myCases.map(c => (
                                   <div key={c.id} onClick={() => setSelectedCaseId(c.id)} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition flex justify-between items-center shadow-sm">
                                       <div className="flex items-center space-x-4">
                                           <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                               {c.title.charAt(0)}
                                           </div>
                                           <div>
                                               <h3 className="font-bold text-slate-900">{c.title}</h3>
                                               <p className="text-sm text-slate-500 truncate max-w-md">{c.description}</p>
                                           </div>
                                       </div>
                                       <div className="text-right">
                                           <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Última msg</span>
                                           <span className="text-sm font-semibold text-slate-700">{c.messages.length > 0 ? new Date(c.messages[c.messages.length-1].timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</span>
                                       </div>
                                   </div>
                               ))}
                               {myCases.length === 0 && <p className="text-slate-500 text-center py-12">Você não tem casos ativos.</p>}
                           </div>
                       </div>
                   )
               )}

               {view === 'pro_calculator' && <LegalCalculator isPremium={currentUser?.isPremium || false} onUnlock={() => setView('premium_sales')} />}
               {view === 'pro_strategy' && <StrategyAnalyzer isPremium={currentUser?.isPremium || false} onUnlock={() => setView('premium_sales')} />}
               {view === 'pro_docs' && <FeatureComingSoon title="Análise Documental" icon={FileSearch} desc="Envie PDFs de contratos ou processos e receba resumos automáticos e alertas de cláusulas perigosas." />}
               
               {view === 'profile' && <UserProfile />}
               {view === 'notifications' && <NotificationList />}

               {view === 'premium_sales' && (
                   <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                       <div className="text-center mb-12">
                           <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">Planos e Créditos</span>
                           <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Potencialize sua Advocacia</h2>
                           <p className="text-xl text-slate-600 max-w-2xl mx-auto">Adquira créditos para aceitar casos ou assine o plano PRO para ferramentas exclusivas.</p>
                       </div>

                       <div className="grid md:grid-cols-2 gap-8 mb-16">
                           {/* Card Créditos */}
                           <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col">
                               <div className="mb-6">
                                   <h3 className="text-2xl font-bold text-slate-900">Pacote de Juris</h3>
                                   <p className="text-slate-500">Créditos avulsos para aceitar novos casos.</p>
                               </div>
                               <div className="flex-1 space-y-4">
                                   {[
                                       { qtd: 10, price: 50 },
                                       { qtd: 50, price: 200, save: '20%' },
                                       { qtd: 100, price: 350, save: '30%' },
                                   ].map((opt) => (
                                       <button 
                                          key={opt.qtd} 
                                          onClick={() => buyJuris(opt.qtd)}
                                          className="w-full flex justify-between items-center p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 bg-slate-50 hover:bg-white transition group"
                                       >
                                           <div className="flex items-center">
                                               <Coins className="w-5 h-5 text-yellow-500 mr-3" />
                                               <span className="font-bold text-slate-700">{opt.qtd} Juris</span>
                                               {opt.save && <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">-{opt.save}</span>}
                                           </div>
                                           <span className="font-bold text-slate-900">R$ {opt.price}</span>
                                       </button>
                                   ))}
                               </div>
                           </div>

                           {/* Card PRO */}
                           <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col">
                               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                               <div className="relative z-10 mb-6">
                                   <div className="flex items-center space-x-2 mb-2">
                                       <Sparkles className="w-6 h-6 text-amber-400" />
                                       <span className="text-amber-400 font-bold tracking-widest uppercase text-sm">SocialJuris PRO</span>
                                   </div>
                                   <h3 className="text-3xl font-bold mb-2">Assinatura Mensal</h3>
                                   <div className="flex items-baseline space-x-2">
                                       <span className="text-4xl font-bold">R$ 99</span>
                                       <span className="text-slate-400">/mês</span>
                                   </div>
                               </div>
                               <ul className="space-y-4 mb-8 flex-1 relative z-10">
                                   <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 mt-0.5"/> <span>Acesso ilimitado à <strong>Calculadora Forense</strong></span></li>
                                   <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 mt-0.5"/> <span><strong>Opositor IA:</strong> Análise estratégica de peças</span></li>
                                   <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 mt-0.5"/> <span>Bônus mensal de <strong>20 Juris</strong></span></li>
                                   <li className="flex items-start"><Check className="w-5 h-5 text-green-400 mr-3 mt-0.5"/> <span>Selo de Advogado Verificado PRO</span></li>
                               </ul>
                               <button 
                                  onClick={subscribePremium}
                                  disabled={currentUser?.isPremium}
                                  className={`w-full py-4 rounded-xl font-bold transition shadow-lg relative z-10 ${currentUser?.isPremium ? 'bg-green-600 text-white cursor-default' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white'}`}
                               >
                                   {currentUser?.isPremium ? 'Você já é PRO' : 'Assinar Agora'}
                               </button>
                           </div>
                       </div>
                   </div>
               )}
          </main>
      </div>
  );
};

export const AdminDashboard: React.FC = () => {
    const { users, verifyLawyer, logout } = useApp();
    const pendingLawyers = users.filter(u => u.role === UserRole.LAWYER && !u.verified);

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
             <header className="bg-slate-900 text-white h-16 flex items-center px-8 justify-between shadow-md">
                 <div className="flex items-center space-x-3">
                     <Shield className="w-6 h-6 text-red-500" />
                     <span className="font-bold text-lg">Painel Administrativo</span>
                 </div>
                 <button onClick={logout} className="text-sm font-bold text-slate-400 hover:text-white">Sair</button>
             </header>
             
             <main className="max-w-6xl mx-auto p-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
                         <div className="text-slate-500 font-bold uppercase text-xs">Total Usuários</div>
                         <div className="text-3xl font-bold text-slate-900">{users.length}</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                         <div className="text-slate-500 font-bold uppercase text-xs">Pendentes de Verificação</div>
                         <div className="text-3xl font-bold text-slate-900">{pendingLawyers.length}</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                         <div className="text-slate-500 font-bold uppercase text-xs">Advogados Verificados</div>
                         <div className="text-3xl font-bold text-slate-900">{users.filter(u => u.role === UserRole.LAWYER && u.verified).length}</div>
                     </div>
                 </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-6 border-b border-slate-100">
                         <h2 className="text-xl font-bold text-slate-900">Solicitações de Verificação</h2>
                     </div>
                     <div className="overflow-x-auto">
                         <table className="w-full text-left">
                             <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                                 <tr>
                                     <th className="px-6 py-4">Advogado</th>
                                     <th className="px-6 py-4">OAB</th>
                                     <th className="px-6 py-4">Email</th>
                                     <th className="px-6 py-4 text-right">Ação</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                 {pendingLawyers.map(user => (
                                     <tr key={user.id} className="hover:bg-slate-50">
                                         <td className="px-6 py-4 font-bold text-slate-900 flex items-center">
                                             <img src={user.avatar} className="w-8 h-8 rounded-full mr-3" alt=""/>
                                             {user.name}
                                         </td>
                                         <td className="px-6 py-4 text-slate-600">{user.oab}</td>
                                         <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                         <td className="px-6 py-4 text-right">
                                             <button 
                                                onClick={() => verifyLawyer(user.id)}
                                                className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg text-xs font-bold transition uppercase"
                                             >
                                                 Aprovar Cadastro
                                             </button>
                                         </td>
                                     </tr>
                                 ))}
                                 {pendingLawyers.length === 0 && (
                                     <tr>
                                         <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Nenhuma solicitação pendente.</td>
                                     </tr>
                                 )}
                             </tbody>
                         </table>
                     </div>
                 </div>
             </main>
        </div>
    );
};
