import React, { useState } from 'react';
import { 
  ShoppingBag, 
  AlertTriangle, 
  Mail, 
  Ticket,
  CalendarDays, 
  Truck, 
  Settings, 
  LogOut, 
  HelpCircle,
  Plus,
  Car,
  Hammer,
  HeartHandshake,
  Building2,
  X,
  Home,
  Package,
  MessageCircle,
  Megaphone
} from 'lucide-react';
import { MenuItem, AdCategory } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onSelectCategory?: (category: AdCategory) => void;
}

const mainMenuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'anuncios', label: 'Anúncios', icon: ShoppingBag },
  { id: 'advertencias', label: 'Advertências', icon: AlertTriangle },
  { id: 'encomendas', label: 'Encomendas', icon: Mail },
  { id: 'denuncias', label: 'Denúncias', icon: Megaphone },
  { id: 'comunicados', label: 'Comunicados', icon: MessageCircle },
  { id: 'eventos', label: 'Eventos', icon: Ticket },
  { id: 'salao', label: 'Salão/churrasqueira', icon: CalendarDays },
  { id: 'mudanca', label: 'Mudança', icon: Truck },
];

const bottomMenuItems: MenuItem[] = [
  { id: 'ajustes', label: 'Ajustes', icon: Settings },
  { id: 'sair', label: 'Sair', icon: LogOut },
  { id: 'suporte', label: 'Suporte', icon: HelpCircle },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onSelectCategory }) => {
  const [isAnunciarOpen, setIsAnunciarOpen] = useState(false);

  const handlePublishClick = (page: string) => {
    // Navigate to the respective page
    onNavigate(page);
    // Close dropdown
    setIsAnunciarOpen(false);
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white h-screen border-r border-gray-100 sticky top-0 z-20">
      {/* Logo Area */}
      <div className="p-6 pb-4">
        <div className="mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
          <svg width="190" height="42" viewBox="0 0 190 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32L12.5 12V32H0Z" fill="#88CCB6"/>
            <path d="M15 32V18L24 32H15Z" fill="#6B9E8A"/>
            <text x="30" y="24" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="24" fill="#374151" letterSpacing="-0.03em">condowork</text>
            <text x="30" y="37" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="8.5" fill="#374151" letterSpacing="0.05em">CONDOMÍNIOS INTELIGENTES</text>
          </svg>
        </div>

        {/* Primary Action Button Area */}
        <div className="relative">
          <button 
            onClick={() => setIsAnunciarOpen(!isAnunciarOpen)}
            className={`w-full font-medium py-3 px-6 rounded-lg flex items-center justify-start gap-3 shadow-md transition-all duration-200 ${
              isAnunciarOpen 
                ? 'bg-gray-100 text-gray-700 shadow-inner' 
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {isAnunciarOpen ? <X size={20} /> : <Plus size={20} />}
            {isAnunciarOpen ? 'Cancelar' : 'Publicar'}
          </button>

          {/* Dropdown Menu */}
          {isAnunciarOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">O que deseja publicar?</p>
              </div>
              <div className="grid grid-cols-2 gap-1 p-2">
                <button 
                  onClick={() => handlePublishClick('advertencias')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-700 transition-colors gap-1.5"
                >
                  <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                    <AlertTriangle size={18} />
                  </div>
                  <span className="text-xs font-medium">Advertência</span>
                </button>

                <button 
                  onClick={() => handlePublishClick('encomendas')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors gap-1.5"
                >
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Package size={18} />
                  </div>
                  <span className="text-xs font-medium">Encomendas</span>
                </button>

                <button 
                  onClick={() => handlePublishClick('eventos')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors gap-1.5"
                >
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                    <Ticket size={18} />
                  </div>
                  <span className="text-xs font-medium">Eventos</span>
                </button>

                <button 
                  onClick={() => handlePublishClick('comunicados')}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 transition-colors gap-1.5"
                >
                  <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                    <MessageCircle size={18} />
                  </div>
                  <span className="text-xs font-medium">Comunicados</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 no-scrollbar">
        {mainMenuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-50 space-y-1">
        {bottomMenuItems.map((item) => {
           const isActive = activePage === item.id;
           return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
              {item.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;