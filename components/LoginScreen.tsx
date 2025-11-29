import React, { useState } from 'react';
import { User, Lock, ArrowRight, Building2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login - aceita qualquer input para demonstração
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20 filter blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-emerald-500/30"></div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm transform rotate-3">
              <Building2 size={32} />
            </div>
          </div>
          <div className="flex flex-col items-center">
             <svg width="180" height="40" viewBox="0 0 190 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-1">
                <path d="M0 32L12.5 12V32H0Z" fill="#10B981"/>
                <path d="M15 32V18L24 32H15Z" fill="#059669"/>
                <text x="30" y="24" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#374151" letterSpacing="-0.03em">condowork</text>
            </svg>
            <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">Condomínios Inteligentes</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Email / Usuário</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all sm:text-sm"
                placeholder="Seu usuário ou email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1">Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all sm:text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 cursor-pointer">
                Lembrar de mim
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] items-center gap-2"
          >
            Entrar no Sistema <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2024 Condowork Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;