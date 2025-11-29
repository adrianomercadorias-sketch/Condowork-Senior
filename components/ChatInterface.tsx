import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Send, Paperclip, Shield, Check, CheckCheck, Smile, ChevronLeft, Ban, Archive, Flag, RefreshCcw } from 'lucide-react';
import { ChatConversation, ChatMessage } from '../types';

interface ChatInterfaceProps {
  onClose: () => void;
}

// Dados mockados baseados nos anúncios existentes - IMAGENS SINCRONIZADAS COM MAINCONTENT
const initialConversations: ChatConversation[] = [
  {
    id: '1',
    userName: 'Jade',
    userUnit: 'BL2APT101',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80',
    adTitle: 'Vaga Coberta Próxima ao Elevador',
    adPrice: 'R$ 150,00',
    adImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    lastMessage: 'Está no local hoje?',
    lastMessageTime: '15:24',
    unreadCount: 0,
    isOnline: true,
    status: 'active',
    messages: [
      { id: 'm1', text: 'Olá, a vaga ainda está disponível?', sender: 'me', timestamp: '15:20', read: true },
      { id: 'm2', text: 'Oi! Está sim.', sender: 'other', timestamp: '15:22', read: true },
      { id: 'm3', text: 'Está no local hoje?', sender: 'other', timestamp: '15:24', read: true },
    ]
  },
  {
    id: '2',
    userName: 'Fabio Augusto',
    userUnit: 'BL4APT404',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80',
    adTitle: 'Dra. Ana - Advocacia Civil',
    adPrice: 'Consulta R$ 250',
    adImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    lastMessage: 'Disponível',
    lastMessageTime: 'Ontem',
    unreadCount: 2,
    isOnline: true,
    status: 'active',
    messages: [
      { id: 'm1', text: 'Boa tarde, gostaria de agendar um horário.', sender: 'me', timestamp: '10:00', read: true },
      { id: 'm2', text: 'Claro! Tenho vaga para amanhã às 14h.', sender: 'other', timestamp: '10:15', read: true },
    ]
  },
  {
    id: '3',
    userName: 'Diego Gouvea',
    userUnit: 'BL1APT102',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80',
    adTitle: 'Doação de Gatinhos',
    adPrice: 'Grátis',
    adImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    lastMessage: 'bom dia',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    isOnline: false,
    status: 'active',
    messages: [
      { id: 'm1', text: 'Ainda tem filhotes?', sender: 'me', timestamp: '09:00', read: true },
      { id: 'm2', text: 'bom dia', sender: 'other', timestamp: '09:10', read: true },
      { id: 'm3', text: 'Tem 1 sobrando ainda.', sender: 'other', timestamp: '09:11', read: true },
    ]
  },
  {
    id: '4',
    userName: 'Julio Cesar',
    userUnit: 'BL3APT303',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80',
    adTitle: 'Apto 2 Quartos Reformado',
    adPrice: 'R$ 2.500/mês',
    adImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    lastMessage: 'Aceita proposta?',
    lastMessageTime: '04/02',
    unreadCount: 0,
    isOnline: false,
    status: 'active', 
    messages: []
  }
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [conversations, setConversations] = useState(initialConversations);
  const [showArchived, setShowArchived] = useState(false);
  const [activeTab, setActiveTab] = useState<'todos' | 'negociacoes'>('todos');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Ref para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter conversations based on view mode
  const displayedConversations = conversations.filter(c => 
    showArchived ? c.status === 'archived' : c.status === 'active'
  );

  const activeChat = conversations.find(c => c.id === selectedChatId);
  const archivedCount = conversations.filter(c => c.status === 'archived').length;

  // Set initial selected chat when list changes or loads
  useEffect(() => {
    if (displayedConversations.length > 0) {
      // Keep selected if present in new list, else select first
      if (!selectedChatId || !displayedConversations.find(c => c.id === selectedChatId)) {
         handleSelectChat(displayedConversations[0].id);
      }
    } else {
      setSelectedChatId(null);
    }
  }, [showArchived, activeTab]); 
  // removed displayedConversations from dependency to avoid infinite loops if we change conversation state inside useEffect, 
  // but logically we want to reset selection if the view mode changes.

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    
    // Mark as read (reset unreadCount)
    setConversations(prev => prev.map(c => 
      c.id === chatId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setConversations(prev => prev.map(c => 
      c.id === selectedChatId 
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: inputText, lastMessageTime: newMessage.timestamp }
        : c
    ));
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("O arquivo é muito grande. O tamanho máximo permitido é 10MB.");
      return;
    }

    // Validate type (Images only)
    if (!file.type.startsWith('image/')) {
      alert("Apenas imagens são permitidas.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: '', // Text is empty for image only messages
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        imageUrl: base64String
      };

      setConversations(prev => prev.map(c => 
        c.id === selectedChatId 
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: 'Imagem enviada', lastMessageTime: newMessage.timestamp }
          : c
      ));
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAction = (action: 'block' | 'archive' | 'unarchive' | 'report') => {
    if (!activeChat) return;
    
    if (action === 'block') {
      alert(`O usuário ${activeChat.userName} foi bloqueado.`);
    } else if (action === 'archive') {
      alert(`A conversa com ${activeChat.userName} foi arquivada.`);
      setConversations(prev => prev.map(c => c.id === selectedChatId ? { ...c, status: 'archived' } : c));
      setSelectedChatId(null); 
    } else if (action === 'unarchive') {
      alert(`A conversa com ${activeChat.userName} foi restaurada para a caixa de entrada.`);
      setConversations(prev => prev.map(c => c.id === selectedChatId ? { ...c, status: 'active' } : c));
      setSelectedChatId(null);
    } else if (action === 'report') {
      alert(`Denúncia enviada contra ${activeChat.userName}. Nossa equipe analisará o caso.`);
    }
    setIsMenuOpen(false);
  };

  const toggleArchivedView = () => {
    setShowArchived(!showArchived);
    setIsMenuOpen(false);
  };

  const handleTabChange = (tab: 'todos' | 'negociacoes') => {
    setActiveTab(tab);
    setShowArchived(false); // Ensure we show active chats when clicking tabs
  };

  return (
    <div className="flex flex-1 h-full bg-white overflow-hidden rounded-tl-2xl relative">
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 min-w-[320px] flex flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {showArchived ? 'Arquivadas' : 'Chat'}
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Busque por produto ou usuário..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => handleTabChange('todos')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors ${activeTab === 'todos' && !showArchived ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => handleTabChange('negociacoes')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-colors ${activeTab === 'negociacoes' && !showArchived ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50'}`}
            >
              Negociações
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {displayedConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">Nenhuma conversa {showArchived ? 'arquivada' : 'encontrada'}.</p>
            </div>
          ) : (
            displayedConversations.map(chat => (
              <div 
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer transition-colors ${selectedChatId === chat.id ? 'bg-emerald-50/50 border-l-4 border-l-emerald-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.adImage} alt="Ad" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                     <span className="flex items-center justify-center h-full w-full text-[10px] font-bold bg-white text-gray-700">{chat.userName.charAt(0)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs text-gray-500 truncate mb-0.5">{chat.adTitle}</h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{chat.lastMessageTime}</span>
                  </div>
                  <h3 className={`font-semibold text-sm mb-0.5 truncate flex items-center gap-1 ${chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                    {chat.userName} 
                    {chat.isOnline && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{chat.lastMessage}</p>
                    {chat.unreadCount > 0 && (
                      <span className="ml-2 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          <div 
            onClick={toggleArchivedView}
            className="p-4 bg-gray-50 text-xs text-gray-500 font-medium flex items-center justify-between cursor-pointer hover:bg-gray-100 border-t border-gray-100"
          >
            <span>{showArchived ? 'Voltar para conversas ativas' : `Conversas inativas (${archivedCount})`}</span>
            <ChevronLeft size={14} className={showArchived ? "" : "rotate-180"} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex-col h-full bg-gray-50 ${!activeChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {!activeChat ? (
          <div className="text-center text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield size={32} />
            </div>
            <p>Selecione uma conversa para iniciar</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm z-20 relative">
              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <h3 className="text-lg font-bold text-gray-800">{activeChat.userName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{activeChat.userUnit}</span>
                    <span>|</span>
                    <span>Último acesso hoje às 15:40</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end mr-2">
                   <span className="text-xs text-gray-500 line-clamp-1 max-w-[150px]">{activeChat.adTitle}</span>
                   <span className="font-bold text-gray-800 text-sm">{activeChat.adPrice}</span>
                 </div>
                 <img src={activeChat.adImage} className="w-10 h-10 rounded object-cover border border-gray-100" alt="Produto" />
                 
                 <div className="relative">
                   <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)} 
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                   >
                     <MoreVertical size={20} />
                   </button>
                   
                   {/* Dropdown Menu */}
                   {isMenuOpen && (
                     <>
                       <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                       <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                         {activeChat.status === 'active' ? (
                           <button onClick={() => handleAction('archive')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                             <Archive size={16} className="text-gray-400" /> Arquivar
                           </button>
                         ) : (
                           <button onClick={() => handleAction('unarchive')} className="w-full text-left px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-3 transition-colors">
                             <RefreshCcw size={16} className="text-emerald-500" /> Desarquivar
                           </button>
                         )}
                         <button onClick={() => handleAction('block')} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-50">
                           <Ban size={16} className="text-gray-400" /> Bloquear
                         </button>
                         <button onClick={() => handleAction('report')} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-gray-50">
                           <Flag size={16} className="text-red-500" /> Denunciar
                         </button>
                       </div>
                     </>
                   )}
                 </div>
              </div>
            </div>

            {/* Safety Banner */}
            <div className="bg-gray-900 text-white px-6 py-3 flex items-start gap-3 text-xs md:text-sm shadow-md z-10 relative">
               <Shield className="text-white shrink-0 mt-0.5" size={16} />
               <p className="leading-snug">
                 É expressamente proibido qualquer tipo de assédio sexual, moral, insinuação erótica, convites ou tentativa de golpe financeiro. Denuncie este usuário caso ocorra.
               </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8f9fa]">
              {/* Day Divider */}
              <div className="flex justify-center my-4">
                <span className="bg-white border border-gray-200 text-gray-400 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-medium shadow-sm">Hoje</span>
              </div>

              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                   {msg.sender === 'other' && (
                     <div className="mr-2 text-[10px] text-gray-400 self-end mb-1">{activeChat.userName.split(' ')[0]}</div>
                   )}
                   <div className={`max-w-[70%] sm:max-w-[60%] rounded-2xl px-4 py-2 relative shadow-sm ${
                     msg.sender === 'me' 
                       ? 'bg-emerald-100 text-gray-800 rounded-tr-none' 
                       : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                   }`}>
                     {msg.imageUrl && (
                       <img src={msg.imageUrl} alt="Anexo" className="max-w-full rounded-lg mb-2 mt-1 border border-black/5" />
                     )}
                     {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                     
                     <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'me' ? 'text-emerald-600' : 'text-gray-400'}`}>
                       {msg.timestamp}
                       {msg.sender === 'me' && (
                         msg.read ? <CheckCheck size={12} /> : <Check size={12} />
                       )}
                     </div>
                   </div>
                </div>
              ))}
            </div>

            {/* Quick Actions (Chips) */}
            <div className="px-6 pb-2 pt-2 bg-white border-t border-gray-100 overflow-x-auto no-scrollbar flex gap-2">
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors">Desculpe, não aceito oferta.</button>
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors">Qual é a sua oferta?</button>
              <button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors">Sim, ainda está disponível.</button>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white">
              <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-white shadow-sm">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-full transition-colors"
                  title="Anexar imagem"
                >
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite uma mensagem..." 
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                />
                <button className="text-gray-400 hover:text-gray-600"><Smile size={20} /></button>
                {inputText.trim() && (
                  <button onClick={handleSendMessage} className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm">
                    <Send size={16} className="ml-0.5" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;