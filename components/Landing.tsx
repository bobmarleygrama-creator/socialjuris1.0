import React, { useState } from 'react';
import { Scale, Shield, Clock, CheckCircle, ChevronRight, Gavel, Users, Lock } from 'lucide-react';
import { useApp } from '../store';
import { UserRole } from '../types';

interface LandingProps {
  onAuth: (type: 'login' | 'register', role: UserRole) => void;
}

export const Landing: React.FC<LandingProps> = ({ onAuth }) => {
  const [activeTab, setActiveTab] = useState<'client' | 'lawyer'>('client');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SocialJuris</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#funciona" className="hover:text-indigo-600 transition">Como Funciona</a>
              <a href="#areas" className="hover:text-indigo-600 transition">Áreas</a>
              <a href="#sobre" className="hover:text-indigo-600 transition">Sobre</a>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onAuth('login', UserRole.CLIENT)}
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm"
              >
                Entrar
              </button>
              <button 
                onClick={() => onAuth('register', UserRole.CLIENT)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition shadow-lg shadow-indigo-600/20"
              >
                Começar Agora
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Justiça acessível e <span className="text-indigo-600">inteligente</span> para todos.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Conectamos clientes que precisam de solução a advogados verificados prontos para atuar. 
              Tecnologia de ponta para simplificar o jurídico.
            </p>
            
            <div className="bg-white p-2 rounded-full shadow-xl inline-flex mb-12 border border-slate-100">
              <button 
                onClick={() => setActiveTab('client')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'client' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sou Cliente
              </button>
              <button 
                onClick={() => setActiveTab('lawyer')}
                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'lawyer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                Sou Advogado
              </button>
            </div>

            <div className="flex justify-center">
              {activeTab === 'client' ? (
                <div className="animate-fade-in-up">
                  <button onClick={() => onAuth('register', UserRole.CLIENT)} className="group bg-slate-900 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center">
                    Resolver meu Problema <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
                  </button>
                  <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Sem custo inicial de cadastro
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  <button onClick={() => onAuth('register', UserRole.LAWYER)} className="group bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center">
                    Encontrar Clientes <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
                  </button>
                  <p className="mt-4 text-sm text-slate-500 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> Verificação OAB obrigatória
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="funciona" className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-lg">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Segurança Total</h3>
              <p className="text-slate-600 leading-relaxed">
                Advogados verificados via OAB e dados criptografados. Seu caso em sigilo absoluto até o aceite.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-lg">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Agilidade Digital</h3>
              <p className="text-slate-600 leading-relaxed">
                Timeline interativa, chat em tempo real e videochamadas integradas. Sem burocracia de papel.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-lg">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gavel className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Match Inteligente</h3>
              <p className="text-slate-600 leading-relaxed">
                Nossa IA analisa seu caso e sugere a área ideal, conectando você ao especialista certo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Scale className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold text-white">SocialJuris</span>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition">Termos de Uso</a>
            <a href="#" className="hover:text-white transition">Privacidade</a>
            <a href="#" className="hover:text-white transition">Contato</a>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-slate-500">
            © 2024 SocialJuris. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};