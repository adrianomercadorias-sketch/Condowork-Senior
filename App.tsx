import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import ChatInterface from './components/ChatInterface';
import { AdCategory, UserProfile, EventItem } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('anuncios');
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Estado global do perfil do usuário
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'BL2APT503',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    email: 'contato@condowork.com',
    phone: '(21) 99999-9999'
  });
  
  // Estado global de eventos - UPDATED with colors and more data
  const [events, setEvents] = useState<EventItem[]>([
    { id: '1', title: 'Carnaval', date: '10/02', color: 'blue', imageUrl: 'https://images.unsplash.com/photo-1516239482977-c550bbcae1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', attendees: 130, isUserConfirmed: true },
    { id: '2', title: 'Festa Junina', date: '06/06', color: 'emerald', imageUrl: 'https://images.unsplash.com/photo-1551846016-563b7ce85a85?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', attendees: 45, isUserConfirmed: false },
    { id: '3', title: 'Assembléia', date: '06/09', color: 'gray', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', attendees: 89, isUserConfirmed: false },
    { id: '4', title: 'Manutenção Piscina', date: '14/06', color: 'blue', attendees: 0, isUserConfirmed: false },
    { id: '5', title: 'Vacinação Pet', date: '14/06', color: 'emerald', imageUrl: 'https://images.unsplash.com/photo-1591823723491-3640e3a5342a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80', attendees: 12, isUserConfirmed: false },
    { id: '6', title: 'Reunião Síndico', date: '14/06', color: 'red', attendees: 5, isUserConfirmed: false },
    { id: '7', title: 'Dia Nacional da Vacinação', date: '09/06', color: 'emerald', attendees: 34, isUserConfirmed: true },
  ]);

  const handleAddEvent = (newEvent: Omit<EventItem, 'id'>) => {
    const eventWithId: EventItem = {
      ...newEvent,
      id: Date.now().toString(),
    };
    // Add new event and sort them by date for better display order
    setEvents(prevEvents => [...prevEvents, eventWithId].sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
    }));
  };

  const handleToggleEventAttendance = (eventId: string) => {
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === eventId) {
        const isJoining = !event.isUserConfirmed;
        return {
          ...event,
          isUserConfirmed: isJoining,
          attendees: event.attendees + (isJoining ? 1 : -1)
        };
      }
      return event;
    }));
  };

  const handleCategorySelect = (category: AdCategory) => {
    setSelectedCategory(category);
    setActivePage('anuncios');
    setIsChatOpen(false); // Fecha o chat se navegar pelo menu lateral
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsChatOpen(false);
    
    // Reset category to return to Dashboard view when clicking Home or Anúncios main menu
    if (page === 'home' || page === 'anuncios') {
      setSelectedCategory(null);
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onSelectCategory={handleCategorySelect}
      />

      {/* Center & Right Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header 
          onOpenChat={() => setIsChatOpen(!isChatOpen)} 
          userProfile={userProfile}
        />

        {/* Main Content Area (Includes Center Dashboard and Right Widgets OR Chat) */}
        <main className="flex-1 flex overflow-hidden relative">
          
          {isChatOpen ? (
            <ChatInterface onClose={() => setIsChatOpen(false)} />
          ) : (
            <>
              {/* Center Dashboard */}
              <MainContent 
                activePage={activePage} 
                selectedCategory={selectedCategory}
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onSelectCategory={handleCategorySelect}
                onAddEvent={handleAddEvent}
                onToggleEventAttendance={handleToggleEventAttendance}
                events={events}
              />
              
              {/* Right Sidebar - Events & Partners */}
              <RightSidebar events={events} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;