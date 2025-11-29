import React from 'react';
import { Users, Star, ChevronRight } from 'lucide-react';
import { EventItem, PartnerItem } from '../types';

interface RightSidebarProps {
  events: EventItem[];
}

const partners: PartnerItem[] = [
  { id: '1', role: 'Advogado', name: 'Marcos', rating: 5.0, reviews: 770, imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80' },
  { id: '2', role: 'Doação', name: 'Forno', rating: 4.9, reviews: 230, imageUrl: 'https://images.unsplash.com/photo-1585250462788-b7100b777a4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
  { id: '3', role: 'Vaga', name: 'BL01', rating: 5.0, reviews: 633, imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
];

const RightSidebar: React.FC<RightSidebarProps> = ({ events }) => {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
  }
  
  return (
    <aside className="hidden xl:flex flex-col w-80 bg-white h-screen border-l border-gray-100 p-6 overflow-y-auto no-scrollbar sticky top-0 right-0">
      
      {/* Events Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 text-lg font-medium">Próximos eventos</h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs cursor-pointer hover:text-emerald-600">
            <span>All</span>
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L0 0H8L4 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                <img src={event.imageUrl || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'} alt={event.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-600 font-medium text-base">{event.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                   <div className={`w-2 h-2 rounded-full ${colorClasses[event.color]}`}></div>
                   <span>{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-100 w-full mt-8"></div>
      </div>

      {/* Partners Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-400 text-lg font-medium">Recentes</h3>
           <div className="flex items-center gap-1 text-gray-400 text-xs cursor-pointer hover:text-emerald-600">
            <span>All</span>
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L0 0H8L4 6Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          {partners.map((partner) => (
            <div key={partner.id} className="flex items-center gap-4 group cursor-pointer">
               <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                <img src={partner.imageUrl} alt={partner.role} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="text-gray-800 font-semibold text-base">{partner.role}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{partner.name}</span>
                  <div className="flex items-center gap-0.5 text-xs text-gray-400">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span>{partner.rating.toFixed(1)} ({partner.reviews})</span>
                  </div>
                </div>
              </div>
              <button className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-50 rounded-full p-1">
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-100 w-full mt-8"></div>
      </div>

    </aside>
  );
};

export default RightSidebar;