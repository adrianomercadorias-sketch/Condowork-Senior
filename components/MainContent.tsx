import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, Cog, HeartHandshake, Building2, ChevronRight, ChevronLeft, 
  MessageCircle, AlertTriangle, Package, Megaphone, Calendar as CalendarIcon, Clock,
  MapPin, Heart, ArrowLeft, Upload, DollarSign, Check, Image as ImageIcon,
  Briefcase, PawPrint, Sofa, Music, User, Camera, Mail, Phone, Save,
  X, ZoomIn, ZoomOut, Move, Edit2, Trash2, LifeBuoy, GraduationCap, Lightbulb, FileQuestion, Search, Filter, Box, Ticket, Plus, Building, File as FileIcon, Paperclip, ChevronDown, Users
} from 'lucide-react';
import { Announcement, MarketplaceAd, AdCategory, UserProfile, PackageItem, EventItem, ReportItem, EventColor, WarningItem, AttachedFile } from '../types';

const initialAnnouncements: Announcement[] = [
  { id: '1', title: 'Estacionamento interditado', actionLabel: 'saiba mais' },
  { id: '2', title: 'Elevador em manutenção', actionLabel: 'saiba mais' },
  { id: '3', title: 'Fechamento de gás', actionLabel: 'saiba mais' },
];

const holidays: Record<string, string> = {
  '1-1': 'Ano Novo',
  '12-2': 'Carnaval',
  '13-2': 'Carnaval',
  '29-3': 'Paixão de Cristo',
  '21-4': 'Tiradentes',
  '1-5': 'Dia do Trabalho',
  '30-5': 'Corpus Christi',
  '7-9': 'Independência',
  '12-10': 'N. Sra. Aparecida',
  '2-11': 'Finados',
  '15-11': 'Proclamação da Rep.',
  '25-12': 'Natal'
};

interface MainContentProps {
  activePage: string;
  selectedCategory: AdCategory | null;
  userProfile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
  onSelectCategory?: (category: AdCategory) => void;
  onAddEvent?: (event: Omit<EventItem, 'id'>) => void;
  onToggleEventAttendance?: (eventId: string) => void;
  events?: EventItem[];
}

// Mock Data for Categories
const initialParkingAds: MarketplaceAd[] = [
  {
    id: 'p1', category: 'vagas', title: 'Vaga Coberta Próxima ao Elevador', subtitle: 'Bloco 2 - Térreo',
    date: '3 de nov', time: '08:49', price: 'R$ 150,00', isOnline: true, isLiked: false,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p2', category: 'vagas', title: 'Alugo Vaga para Moto', subtitle: 'Bloco 4 - G2',
    date: 'Ontem', time: '22:53', price: 'R$ 80,00', isOnline: false, isLiked: false,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const initialServiceAds: MarketplaceAd[] = [
  {
    id: 's1', category: 'servicos', title: 'Dra. Ana - Advocacia Civil', subtitle: 'OAB/RJ 12345',
    date: 'Hoje', time: '10:00', price: 'Consulta R$ 250', isOnline: true, isLiked: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's2', category: 'servicos', title: 'Aulas de Violão e Guitarra', subtitle: 'Professor Pedro',
    date: 'Ontem', time: '16:20', price: 'R$ 80/hora', isOnline: false, isLiked: false,
    image: 'https://images.unsplash.com/photo-1510915361408-d877ba646d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's3', category: 'servicos', title: 'Limpeza Residencial e Pós-Obra', subtitle: 'Clara Limpezas',
    date: '28 de out', time: '09:15', price: 'A combinar', isOnline: true, isLiked: false,
    image: 'https://images.unsplash.com/photo-1581578731117-10d52143b1e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const initialDonationAds: MarketplaceAd[] = [
  {
    id: 'd1', category: 'doacoes', title: 'Doação de Gatinhos', subtitle: '3 filhotes disponíveis',
    date: 'Hoje', time: '12:30', price: 'Grátis', isOnline: true, isLiked: false,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'd2', category: 'doacoes', title: 'Sofá 2 Lugares', subtitle: 'Retirar no Bloco 4',
    date: 'Ontem', time: '19:45', price: 'Grátis', isOnline: false, isLiked: true,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    details: { condition: 'Usado - Bom estado' }
  }
];

const initialRentAds: MarketplaceAd[] = [
  {
    id: 'r1', category: 'aluga', title: 'Apto 2 Quartos Reformado', subtitle: 'Bloco 1 - Apto 504',
    date: 'Hoje', time: '11:00', price: 'R$ 2.500/mês', isOnline: true, isLiked: false,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    details: { bedrooms: '2 Quartos' }
  },
  {
    id: 'r2', category: 'aluga', title: 'Kitnet Mobiliada', subtitle: 'Bloco 3 - Apto 101',
    date: '30 de out', time: '14:20', price: 'R$ 1.200/mês', isOnline: true, isLiked: false,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    details: { bedrooms: '1 Quarto' }
  }
];

// Dados iniciais de encomendas
const initialPackages: PackageItem[] = [
  { id: 'pk1', type: 'Marketplace - Médio', code: 'AMZ-998877', unit: 'BL2APT503', date: 'Recebido hoje às 10:30', status: 'Aguardando Retirada' },
  { id: 'pk2', type: 'Carta', code: 'REG-112233', unit: 'BL2APT503', date: 'Ontem às 14:00', status: 'Retirado' }
];

// Dados iniciais de denúncias
const initialReports: ReportItem[] = [
    { id: 'rep1', unit: 'BL3APT902', infractionType: 'Som alto após as 22h', description: 'Festa com som muito alto vindo do apartamento.', reportedBy: 'BL3APT901', date: 'Ontem às 23:15', status: 'Em Análise' },
    { id: 'rep2', unit: 'VISITANTE', infractionType: 'Uso indevido da vaga de visitante', description: 'Carro parado na vaga de visitante há 3 dias.', reportedBy: 'Portaria', date: '04/02', status: 'Verificado' }
];

// Dados iniciais de advertências
const initialWarnings: WarningItem[] = [
    { id: 'w1', unit: 'BL1APT801', infractionType: 'Barulho excessivo após 22h', description: 'Música alta e festa durante a madrugada de sábado.', date: 'Ontem', status: 'Pendente' },
    { id: 'w2', unit: 'BL4APT203', infractionType: 'Estacionamento em vaga incorreta', description: 'Veículo Honda Civic placa XYZ-1234 estacionado na vaga de visitante por mais de 24h.', date: '05/02', status: 'Resolvido' }
];

// Helper component for lists
const ListItem: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
  status: string;
  onStatusChange?: () => void;
}> = ({ icon: Icon, title, subtitle, status, onStatusChange }) => {
  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    'Pendente': { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    'Resolvido': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Aguardando Retirada': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Retirado': { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
    'Em Análise': { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Verificado': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  };

  const style = statusStyles[status] || statusStyles['Retirado'];

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${style.bg}`}>
          <Icon size={24} className={style.text} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onStatusChange}
        disabled={!onStatusChange}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-transform transform hover:scale-105 active:scale-95 ${style.bg} ${onStatusChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
        <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
        <span className={style.text}>{status}</span>
      </button>
    </div>
  );
};

// Defined outside to avoid "used before declaration"
const QuickAction = ({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-gray-600 hover:text-emerald-700">
    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3 text-emerald-600 transition-colors">
      <Icon size={24} />
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// --- Custom Select Component ---
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon?: React.ElementType;
  placeholder?: string;
  prefix?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, icon: Icon, placeholder, prefix = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 bg-white cursor-pointer flex items-center shadow-sm hover:border-emerald-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />}
        <span className={`text-sm ${value ? 'text-gray-800' : 'text-gray-400'}`}>
          {value ? `${prefix}${value}` : placeholder}
        </span>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={16} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === option ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {prefix}{option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


const MainContent: React.FC<MainContentProps> = ({ activePage, selectedCategory, userProfile, onUpdateProfile, onSelectCategory, onAddEvent, onToggleEventAttendance, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  // Navigation State
  const [internalView, setInternalView] = useState<'dashboard' | 'list' | 'create'>('dashboard');
  const [currentCategory, setCurrentCategory] = useState<AdCategory>('vagas');
  
  // Data State
  const [parkingAds, setParkingAds] = useState<MarketplaceAd[]>(initialParkingAds);
  const [serviceAds, setServiceAds] = useState<MarketplaceAd[]>(initialServiceAds);
  const [donationAds, setDonationAds] = useState<MarketplaceAd[]>(initialDonationAds);
  const [rentAds, setRentAds] = useState<MarketplaceAd[]>(initialRentAds);

  // Announcement State
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(initialAnnouncements);
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState<boolean>(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [announcementFiles, setAnnouncementFiles] = useState<File[]>([]);
  const [isDraggingAnnouncementFile, setIsDraggingAnnouncementFile] = useState(false);
  const announcementFileInputRef = useRef<HTMLInputElement>(null);

  // New Announcement Creation State
  const [showCreateAnnouncementForm, setShowCreateAnnouncementForm] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [createAnnouncementFiles, setCreateAnnouncementFiles] = useState<File[]>([]);
  const [isDraggingCreateAnnouncementFile, setIsDraggingCreateAnnouncementFile] = useState(false);
  const newAnnouncementFileInputRef = useRef<HTMLInputElement>(null);

  // Package State
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageForm, setPackageForm] = useState({
    block: '01',
    apt: '101',
    type: 'Carta',
    code: ''
  });

  // Report State
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState({ block: '01', apt: '101', infractionType: 'Som alto após as 22h', description: '' });
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [isDraggingReportFile, setIsDraggingReportFile] = useState(false);
  const reportFileInputRef = useRef<HTMLInputElement>(null);
  
  // Warning State
  const [warnings, setWarnings] = useState<WarningItem[]>(initialWarnings);
  const [showWarningForm, setShowWarningForm] = useState(false);
  const [warningForm, setWarningForm] = useState({
    block: '01',
    apt: '101',
    infractionType: 'Som alto após as 22h',
    description: ''
  });
  const [warningFiles, setWarningFiles] = useState<File[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const warningFileInputRef = useRef<HTMLInputElement>(null);


  // Filter State for "All Ads" view
  const [filterCategory, setFilterCategory] = useState<'todos' | AdCategory>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    extra: '' // Used for Bedrooms, Condition, etc.
  });
  
  // Image Preview State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Profile Edit State
  const [profileData, setProfileData] = useState<UserProfile>({
    name: '',
    avatar: '',
    email: '',
    phone: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  // --- Image Cropper State ---
  const [isCropping, setIsCropping] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // --- Events State ---
  const [eventCalendarDate, setEventCalendarDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<{ name: string; image: string | null; color: EventColor }>({ name: '', image: null, color: 'emerald' });
  const eventImageInputRef = useRef<HTMLInputElement>(null);
  const [viewingEvent, setViewingEvent] = useState<EventItem | null>(null);
  
  // Refs for crop calculation
  const cropImageRef = useRef<HTMLImageElement>(null);

  // Effect to sync profile data from props
  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  // Effect to update viewingEvent when events prop changes (to reflect attendance changes)
  useEffect(() => {
    if (viewingEvent && events) {
      const updatedEvent = events.find(e => e.id === viewingEvent.id);
      if (updatedEvent) {
        setViewingEvent(updatedEvent);
      }
    }
  }, [events, viewingEvent]);


  // Effect: Sync external selection (Sidebar) with internal state
  useEffect(() => {
    if (activePage === 'anuncios' && selectedCategory) {
      setCurrentCategory(selectedCategory);
      setInternalView('list');
    } else if (activePage === 'anuncios' && !selectedCategory) {
       // Reset to ensure the "All Ads" view is shown when clicking the main "Anúncios" link
       setInternalView('dashboard'); // Logic handled in render based on activePage
       setFilterCategory('todos');
    } else if (activePage === 'home') {
       setInternalView('dashboard');
    }
  }, [activePage, selectedCategory]);

  const toggleLike = (id: string, category: AdCategory) => {
    const updateLike = (ads: MarketplaceAd[]) => 
      ads.map(ad => ad.id === id ? { ...ad, isLiked: !ad.isLiked } : ad);

    if (category === 'vagas') setParkingAds(prev => updateLike(prev));
    if (category === 'servicos') setServiceAds(prev => updateLike(prev));
    if (category === 'doacoes') setDonationAds(prev => updateLike(prev));
    if (category === 'aluga') setRentAds(prev => updateLike(prev));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Open Cropper
        setTempAvatar(reader.result as string);
        setIsCropping(true);
        setZoom(1);
        setCropOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  // --- Package Logic ---
  const handleRegisterPackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageForm.block || !packageForm.apt || !packageForm.code) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const now = new Date();
    const formattedDate = `Recebido hoje às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    const newPackage: PackageItem = {
      id: Date.now().toString(),
      type: packageForm.type,
      code: packageForm.code,
      unit: `BL${packageForm.block}APT${packageForm.apt}`,
      date: formattedDate,
      status: 'Aguardando Retirada'
    };

    setPackages([newPackage, ...packages]);
    setPackageForm({ block: '01', apt: '101', type: 'Carta', code: '' });
    setShowPackageForm(false);
  };
  
  // --- Warning File Handlers ---
  const handleWarningFileSelect = (files: FileList | null) => {
      if (files) {
        const newFiles = Array.from(files);
        setWarningFiles(prev => [...prev, ...newFiles]);
      }
  };
  const handleWarningDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingFile(true); };
  const handleWarningDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingFile(false); };
  const handleWarningDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingFile(false); handleWarningFileSelect(e.dataTransfer.files); };
  const removeWarningFile = (fileName: string) => { setWarningFiles(prev => prev.filter(f => f.name !== fileName)); };

  // --- Warning Logic ---
  const handleRegisterWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningForm.block || !warningForm.apt || !warningForm.description) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    const newWarning: WarningItem = {
      id: Date.now().toString(),
      unit: `BL${warningForm.block}APT${warningForm.apt}`,
      infractionType: warningForm.infractionType,
      description: warningForm.description,
      date: `Hoje, ${formattedDate}`,
      status: 'Pendente',
      files: warningFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
    };
    setWarnings([newWarning, ...warnings]);
    setWarningForm({ block: '01', apt: '101', infractionType: 'Som alto após as 22h', description: '' });
    setWarningFiles([]);
    setShowWarningForm(false);
  };

  // --- Report File Handlers ---
  const handleReportFileSelect = (files: FileList | null) => {
      if (files) {
        const newFiles = Array.from(files);
        setReportFiles(prev => [...prev, ...newFiles]);
      }
  };
  const handleReportDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingReportFile(true); };
  const handleReportDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingReportFile(false); };
  const handleReportDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingReportFile(false); handleReportFileSelect(e.dataTransfer.files); };
  const removeReportFile = (fileName: string) => { setReportFiles(prev => prev.filter(f => f.name !== fileName)); };

  // --- Report Logic ---
  const handleRegisterReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.block || !reportForm.apt || !reportForm.description) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    const newReport: ReportItem = {
      id: Date.now().toString(),
      unit: `BL${reportForm.block}APT${reportForm.apt}`,
      infractionType: reportForm.infractionType,
      description: reportForm.description,
      reportedBy: userProfile?.name || 'Usuário',
      date: `Hoje, ${formattedDate}`,
      status: 'Em Análise',
      files: reportFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
    };
    setReports([newReport, ...reports]);
    setReportForm({ block: '01', apt: '101', infractionType: 'Som alto após as 22h', description: '' });
    setReportFiles([]);
    setShowReportForm(false);
  };
  
  // --- Announcement Logic ---
  const handleEditAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    // Simulating loading files if there were any, currently just clearing or keeping new ones
    setAnnouncementFiles([]); 
    setIsEditingAnnouncement(true);
  };
  
  const handleDeleteAnnouncement = (id: string) => {
    // Delete immediately without confirmation
    setAnnouncementsList(prev => prev.filter(item => item.id !== id));
  };

  const handleAnnouncementFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAnnouncementFiles(prev => [...prev, ...newFiles]);
    }
  };
  const handleAnnouncementDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingAnnouncementFile(true); };
  const handleAnnouncementDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingAnnouncementFile(false); };
  const handleAnnouncementDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingAnnouncementFile(false); handleAnnouncementFileSelect(e.dataTransfer.files); };
  const removeAnnouncementFile = (fileName: string) => { setAnnouncementFiles(prev => prev.filter(f => f.name !== fileName)); };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnnouncement) return;
    
    // Attach files to the announcement object
    // Fix: Merge existing files with new files instead of overwriting
    const updatedAnnouncement: Announcement = {
      ...currentAnnouncement,
      files: [
        ...(currentAnnouncement.files || []),
        ...announcementFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      ]
    };

    setAnnouncementsList(prev => prev.map(item => item.id === updatedAnnouncement.id ? updatedAnnouncement : item));
    setIsEditingAnnouncement(false);
    setCurrentAnnouncement(null);
    setAnnouncementFiles([]);
  };

  // --- Create Announcement Logic ---
  const handleCreateAnnouncementFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setCreateAnnouncementFiles(prev => [...prev, ...newFiles]);
    }
  };
  const handleCreateAnnouncementDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingCreateAnnouncementFile(true); };
  const handleCreateAnnouncementDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingCreateAnnouncementFile(false); };
  const handleCreateAnnouncementDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDraggingCreateAnnouncementFile(false); handleCreateAnnouncementFileSelect(e.dataTransfer.files); };
  const removeCreateAnnouncementFile = (fileName: string) => { setCreateAnnouncementFiles(prev => prev.filter(f => f.name !== fileName)); };

  const handleRegisterNewAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementTitle) return;

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newAnnouncementTitle,
      actionLabel: 'saiba mais',
      files: createAnnouncementFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
    };

    setAnnouncementsList(prev => [newAnnouncement, ...prev]);
    setNewAnnouncementTitle('');
    setCreateAnnouncementFiles([]);
    setShowCreateAnnouncementForm(false);
  };

  const renderAnnouncementModal = () => {
    if (!isEditingAnnouncement || !currentAnnouncement) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Editar Comunicado</h3>
            <button onClick={() => setIsEditingAnnouncement(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleSaveAnnouncement}>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título do Comunicado</label>
                <input 
                  type="text" 
                  value={currentAnnouncement.title} 
                  onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anexar Fotos ou Documentos</label>
                <div 
                  onDragOver={handleAnnouncementDragOver} 
                  onDragLeave={handleAnnouncementDragLeave} 
                  onDrop={handleAnnouncementDrop} 
                  onClick={() => announcementFileInputRef.current?.click()} 
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDraggingAnnouncementFile ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400'}`}
                >
                  <input ref={announcementFileInputRef} type="file" multiple onChange={(e) => handleAnnouncementFileSelect(e.target.files)} className="hidden" />
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Arraste e solte arquivos aqui, ou <span className="font-semibold text-emerald-600">clique para selecionar</span></p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (max 10MB)</p>
                </div>
                {announcementFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Arquivos Novos:</h4>
                    {announcementFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileIcon size={16} className="text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button type="button" onClick={() => removeAnnouncementFile(file.name)} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Visualização de arquivos já existentes (apenas ilustrativo se tivesse backend) */}
                {currentAnnouncement.files && currentAnnouncement.files.length > 0 && (
                   <div className="mt-4 space-y-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Arquivos Existentes:</h4>
                      {currentAnnouncement.files.map((file, index) => (
                         <div key={`existing-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 overflow-hidden">
                               <FileIcon size={16} className="text-gray-500 flex-shrink-0" />
                               <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button type="button" onClick={() => setIsEditingAnnouncement(false)} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition flex items-center gap-2">
                <Save size={18} /> Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  // --- Cropper Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) { setCropOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); } };
  const handleMouseUp = () => { setIsDragging(false); };
  const handleCropSave = () => {
    if (!tempAvatar || !cropImageRef.current) return;
    const canvas = document.createElement('canvas'); const size = 300; canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, size, size);
      const img = cropImageRef.current; const centerX = size / 2; const centerY = size / 2;
      ctx.translate(centerX, centerY); ctx.scale(zoom, zoom); ctx.translate(-centerX, -centerY);
      const drawX = centerX - (img.naturalWidth / 2) + cropOffset.x; const drawY = centerY - (img.naturalHeight / 2) + cropOffset.y;
      ctx.drawImage(img, drawX, drawY);
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      setProfileData(prev => ({ ...prev, avatar: croppedImage }));
      setIsCropping(false); setTempAvatar(null);
    }
  };

  const renderCropModal = () => {
    if (!isCropping || !tempAvatar) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between"><h3 className="font-bold text-gray-800">Ajustar Foto</h3><button onClick={() => setIsCropping(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button></div>
          <div className="p-6 bg-gray-50 flex flex-col items-center">
            <div className="relative w-64 h-64 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-move touch-none mb-6">
              <div className="absolute inset-0 z-10" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}></div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${zoom})`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}><img ref={cropImageRef} src={tempAvatar} alt="Crop target" className="max-w-none" draggable={false}/></div>
            </div>
            <div className="w-full space-y-4 px-4">
              <div className="flex items-center gap-3 text-gray-500"><ZoomOut size={18} /><input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" /><ZoomIn size={18} /></div>
              <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1"><Move size={12} /><span>Arraste a imagem para posicionar</span></div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 flex gap-3">
             <button onClick={() => setIsCropping(false)} className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
             <button onClick={handleCropSave} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"><Check size={18} /> Confirmar</button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => { e.preventDefault(); if (onUpdateProfile) { onUpdateProfile(profileData); setIsSaved(true); setTimeout(() => setIsSaved(false), 3000); } };
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault(); if (!previewImage) { alert("Por favor, adicione uma foto."); return; }
    const now = new Date(); const formattedDate = now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', ''); const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newAd: MarketplaceAd = { id: Date.now().toString(), category: currentCategory, title: formData.title, subtitle: formData.subtitle, price: formData.price && currentCategory !== 'doacoes' ? `R$ ${formData.price}` : (currentCategory === 'doacoes' ? 'Grátis' : 'A combinar'), date: formattedDate, time: formattedTime, isOnline: true, image: previewImage, isLiked: false, details: currentCategory === 'aluga' ? { bedrooms: formData.extra } : (currentCategory === 'doacoes' ? { condition: formData.extra } : undefined) };
    if (currentCategory === 'vagas') setParkingAds([newAd, ...parkingAds]); if (currentCategory === 'servicos') setServiceAds([newAd, ...serviceAds]); if (currentCategory === 'doacoes') setDonationAds([newAd, ...donationAds]); if (currentCategory === 'aluga') setRentAds([newAd, ...rentAds]);
    setFormData({ title: '', subtitle: '', price: '', extra: '' }); setPreviewImage(null); if (fileInputRef.current) fileInputRef.current.value = '';
    setInternalView('list');
  };
  
  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setNewEvent(prev => ({ ...prev, image: reader.result as string })); }; reader.readAsDataURL(file); } };
  const handleCreateEvent = (e: React.FormEvent) => {
      e.preventDefault(); if (!newEvent.name || !onAddEvent || !selectedEventDate) return;
      // Initialize new events with 0 attendees
      const newEventData = { title: newEvent.name, imageUrl: newEvent.image || undefined, date: `${selectedEventDate.getDate().toString().padStart(2, '0')}/${(selectedEventDate.getMonth() + 1).toString().padStart(2, '0')}`, color: newEvent.color, attendees: 0, isUserConfirmed: false };
      onAddEvent(newEventData);
      setIsEventModalOpen(false); setNewEvent({ name: '', image: null, color: 'emerald' }); setSelectedEventDate(null);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  // --- Status Change Handlers ---
  const handleWarningStatusChange = (id: string) => {
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'Pendente' ? 'Resolvido' : 'Pendente' } : w));
  };
  const handleReportStatusChange = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Em Análise' ? 'Verificado' : 'Em Análise' } : r));
  };
  const handlePackageStatusChange = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Aguardando Retirada' ? 'Retirado' : 'Aguardando Retirada' } : p));
  };

  const renderEventsPage = () => {
    const year = eventCalendarDate.getFullYear(); const month = eventCalendarDate.getMonth(); const daysInMonth = getDaysInMonth(year, month); const firstDay = getFirstDayOfMonth(year, month); const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const handleDayClick = (day: number) => { setNewEvent({ name: '', image: null, color: 'emerald' }); setSelectedEventDate(new Date(year, month, day)); setIsEventModalOpen(true); };
    const handlePrevMonth = () => setEventCalendarDate(new Date(year, month - 1, 1)); const handleNextMonth = () => setEventCalendarDate(new Date(year, month + 1, 1));
    const colorClasses: Record<string, string> = { emerald: 'bg-emerald-500 hover:bg-emerald-600', blue: 'bg-blue-500 hover:bg-blue-600', red: 'bg-red-500 hover:bg-red-600', gray: 'bg-gray-500 hover:bg-gray-600', }
    const calendarDays = []; for (let i = 0; i < firstDay; i++) { calendarDays.push(<div key={`empty-${i}`} className="h-28"></div>); }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}`;
      const eventsOnThisDay = events?.filter(e => e.date === dateStr); const MAX_PILLS = 2;
      calendarDays.push(
        <button key={day} onClick={() => handleDayClick(day)} className="h-28 w-full p-1.5 text-left relative transition-colors group bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-400 z-10">
          <span className="text-xs font-semibold text-gray-700">{day}</span>
          {eventsOnThisDay && eventsOnThisDay.length > 0 && (
            <div className="mt-1 space-y-1 overflow-hidden">
              {eventsOnThisDay.slice(0, MAX_PILLS).map(event => (<button key={event.id} onClick={(e) => { e.stopPropagation(); setViewingEvent(event); }} className={`w-full text-left text-white text-[10px] font-semibold px-1.5 py-0.5 rounded truncate transition-colors ${colorClasses[event.color]}`}>{event.title}</button>))}
              {eventsOnThisDay.length > MAX_PILLS && (<div className="text-gray-500 text-[10px] font-semibold px-1.5 py-0.5">+{eventsOnThisDay.length - MAX_PILLS} mais</div>)}
            </div>
          )}
        </button>
      );
    }
    const renderEventCreationModal = () => { if (!isEventModalOpen) return null; return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"><form onSubmit={handleCreateEvent}><div className="p-6"><h3 className="text-xl font-bold text-gray-800 mb-6">Adicionar Novo Evento</h3><div className="space-y-5"><div><label className="block text-sm font-medium text-gray-600 mb-1.5">Nome do Evento</label><input type="text" value={newEvent.name} onChange={e => setNewEvent(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-emerald-500 outline-none transition" required /></div><div><label className="block text-sm font-medium text-gray-600 mb-1.5">Imagem (Opcional)</label><input type="file" ref={eventImageInputRef} onChange={handleEventImageUpload} accept="image/*" className="hidden" /><div onClick={() => eventImageInputRef.current?.click()} className="mt-1 border-2 border-dashed rounded-xl h-40 flex items-center justify-center text-center cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-emerald-400 transition">{newEvent.image ? <img src={newEvent.image} alt="Preview" className="h-full w-full object-contain p-2 rounded-lg" /> : <span className="text-sm text-gray-400">Clique para adicionar</span>}</div></div><div><label className="block text-sm font-medium text-gray-600 mb-1.5">Cor do Evento</label><div className="flex gap-3">{(['emerald', 'blue', 'red', 'gray'] as EventColor[]).map(color => (<button type="button" key={color} onClick={() => setNewEvent(prev => ({ ...prev, color }))} className={`w-8 h-8 rounded-full ${colorClasses[color]} transition-transform hover:scale-110 ${newEvent.color === color ? `ring-2 ring-offset-2 ring-emerald-600` : ''}`} />))}</div></div></div></div><div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100"><button type="button" onClick={() => setIsEventModalOpen(false)} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition">Cancelar</button><button type="submit" className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition flex items-center gap-2"><Check size={18} /> Confirmar</button></div></form></div></div> ); };
    
    // UPDATED: Modal details with attendance counter
    const renderEventDetailsModal = () => { 
      if (!viewingEvent) return null; 
      return ( 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {viewingEvent.imageUrl && (
              <div className="h-48 bg-gray-100 relative">
                <img src={viewingEvent.imageUrl} alt={viewingEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${colorClasses[viewingEvent.color]}`}></div>
                <h3 className="text-xl font-bold text-gray-800">{viewingEvent.title}</h3>
              </div>
              <p className="text-gray-500 mb-4">Data: {viewingEvent.date}</p>
              
              {/* Attendance Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2 text-gray-600">
                      <Users size={18} className="text-gray-400" />
                      <span className="font-bold text-gray-800">{viewingEvent.attendees}</span>
                      <span className="text-sm">confirmados</span>
                   </div>
                </div>
                <button 
                  onClick={() => onToggleEventAttendance && onToggleEventAttendance(viewingEvent.id)}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    viewingEvent.isUserConfirmed 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                      : 'bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {viewingEvent.isUserConfirmed ? (
                    <>
                      <Check size={18} /> Presença Confirmada
                    </>
                  ) : (
                    'Confirmar Presença'
                  )}
                </button>
              </div>

            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
              <button onClick={() => setViewingEvent(null)} className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition">Fechar</button>
            </div>
          </div>
        </div> 
      ); 
    }

    return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative">{renderEventCreationModal()}{renderEventDetailsModal()}<div className="mb-6"><h2 className="text-2xl font-bold text-gray-800 mb-2">Calendário de Eventos</h2><p className="text-gray-500">Clique em uma data para adicionar um novo evento ou em um evento para ver detalhes.</p></div><div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"><button onClick={handlePrevMonth} className="p-2 hover:bg-gray-200 rounded-full transition"><ChevronLeft size={20}/></button><h3 className="text-lg font-semibold text-gray-700 capitalize">{monthNames[month]} {year}</h3><button onClick={handleNextMonth} className="p-2 hover:bg-gray-200 rounded-full transition"><ChevronRight size={20}/></button></div><div className="grid grid-cols-7 text-center">{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i} className={`py-3 text-xs font-bold uppercase tracking-wider ${i === 0 || i === 6 ? 'text-red-400' : 'text-gray-500'}`}>{d}</div>)}</div><div className="grid grid-cols-7 border-t border-gray-200">{calendarDays.map((day, index) => <div key={index} className="border-r border-b border-gray-100">{day}</div>)}</div></div></div> );
  };

  const renderCalendarPage = (title: string, description: string, isDateDisabled: (date: Date) => boolean, renderExtras?: (date: Date) => React.ReactNode) => {
    const year = currentDate.getFullYear(); const month = currentDate.getMonth(); const daysInMonth = getDaysInMonth(year, month); const firstDay = getFirstDayOfMonth(year, month); const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]; const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border-r border-b border-gray-100/50"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateToCheck = new Date(year, month, day); const disabled = isDateDisabled(dateToCheck); const isSelected = selectedDate === day;
      days.push( <div key={day} onClick={() => !disabled && setSelectedDate(day)} className={`h-24 border-r border-b border-gray-100 p-2 relative transition-all group ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-emerald-50 cursor-pointer'} ${isSelected ? 'ring-2 ring-emerald-500 z-10' : ''}`}> <span className={`text-sm font-medium ${isSelected ? 'text-emerald-700' : ''}`}>{day}</span> {renderExtras && renderExtras(dateToCheck)} {isSelected && <div className="absolute bottom-2 right-2"><span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">Selecionado</span></div>} </div> );
    }
    return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar"><div className="mb-6"><h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2><p className="text-gray-500">{description}</p></div><div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50"><button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 hover:bg-gray-200 rounded-full transition"><ChevronLeft size={20}/></button><h3 className="text-lg font-semibold text-gray-700 capitalize">{monthNames[month]} {year}</h3><button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 hover:bg-gray-200 rounded-full transition"><ChevronRight size={20}/></button></div><div className="grid grid-cols-7 text-center bg-gray-50 border-b border-gray-200">{['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i} className={`py-3 text-xs font-semibold uppercase tracking-wider ${i === 0 || i === 6 ? 'text-red-400' : 'text-gray-500'}`}>{d}</div>)}</div><div className="grid grid-cols-7 bg-white">{days}</div></div>{selectedDate && <div className="mt-6 flex justify-end"><button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors flex items-center gap-2"><CalendarIcon size={18} /> Agendar para dia {selectedDate}</button></div>}</div> );
  };

  const renderCreateForm = () => {
    let titleLabel = "Título do Anúncio"; let subLabel = "Localização"; let subPlaceholder = "Ex: Bloco 2, Vaga 104"; let extraField = null;
    if (currentCategory === 'servicos') { titleLabel = "Nome do Profissional / Empresa"; subLabel = "Especialidade / Registro"; subPlaceholder = "Ex: OAB 1234, CRC 5678, Diarista"; } else if (currentCategory === 'doacoes') { titleLabel = "O que você está doando?"; subLabel = "Onde retirar?"; subPlaceholder = "Ex: Bloco 3, Portaria"; extraField = ( <div><label className="block text-sm font-medium text-gray-700 mb-2">Estado de Conservação</label><select value={formData.extra} onChange={(e) => setFormData({...formData, extra: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-white"><option value="">Selecione...</option><option value="Novo">Novo</option><option value="Seminovo">Seminovo</option><option value="Usado - Bom estado">Usado - Bom estado</option><option value="Para peças">Para peças</option></select></div> ); } else if (currentCategory === 'aluga') { titleLabel = "Título do Anúncio"; subLabel = "Localização"; subPlaceholder = "Ex: Bloco 1, Apto 502"; extraField = ( <div><label className="block text-sm font-medium text-gray-700 mb-2">Dormitórios</label><select value={formData.extra} onChange={(e) => setFormData({...formData, extra: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none bg-white"><option value="">Selecione...</option><option value="1 Quarto">1 Quarto</option><option value="2 Quartos">2 Quartos</option><option value="3 Quartos">3 Quartos</option><option value="4+ Quartos">4+ Quartos</option></select></div> ); }
    return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar"><div className="max-w-3xl mx-auto"><div className="flex items-center gap-4 mb-8"><button onClick={() => setInternalView('list')} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"><ArrowLeft size={24} /></button><div><h2 className="text-2xl font-bold text-gray-800">Anunciar {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</h2><p className="text-gray-500 text-sm">Preencha os dados do seu anúncio</p></div></div><form onSubmit={handleCreateAd} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div className="p-8 space-y-6"><div><label className="block text-sm font-medium text-gray-700 mb-2">{titleLabel}</label><input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{currentCategory !== 'doacoes' && (<div><label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0,00" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div>)}{extraField}</div><div><label className="block text-sm font-medium text-gray-700 mb-2">{subLabel}</label><div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input required type="text" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} placeholder={subPlaceholder} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Foto</label><input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" /><div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition relative overflow-hidden ${previewImage ? 'border-emerald-500 bg-gray-50 h-64' : 'border-gray-300 hover:bg-gray-50 hover:border-emerald-400 h-48'}`}>{previewImage ? <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" /> : <><div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3"><Upload className="text-gray-400" size={24} /></div><p className="text-sm font-medium text-gray-700">Clique para adicionar foto</p></>}</div></div></div><div className="bg-gray-50 px-8 py-5 flex items-center justify-end gap-3 border-t border-gray-200"><button type="button" onClick={() => { setInternalView('list'); setPreviewImage(null); setFormData({ title: '', subtitle: '', price: '', extra: '' }); }} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition">Cancelar</button><button type="submit" className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition flex items-center gap-2"><Check size={18} /> Publicar</button></div></form></div></div> );
  };

  const renderCategoryList = () => {
    let ads: MarketplaceAd[] = []; let title = ""; let desc = "";
    switch (currentCategory) { case 'vagas': ads = parkingAds; title = "Aluguel e Venda de Vagas"; desc = "Encontre ou anuncie uma vaga no condomínio"; break; case 'servicos': ads = serviceAds; title = "Profissionais e Serviços"; desc = "Encontre vizinhos que oferecem serviços qualificados"; break; case 'doacoes': ads = donationAds; title = "Doações e Desapegos"; desc = "Doe o que não usa mais ou encontre algo que precisa"; break; case 'aluga': ads = rentAds; title = "Aluguel e Venda de Imóveis"; desc = "Oportunidades de moradia dentro do condomínio"; break; }
    return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar"><div className="flex items-center gap-4 mb-8"><button onClick={() => setInternalView('dashboard')} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"><ArrowLeft size={24} /></button><div><h2 className="text-2xl font-bold text-gray-800">{title}</h2><p className="text-gray-500 text-sm">{desc}</p></div><button onClick={() => setInternalView('create')} className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition flex items-center gap-2 capitalize"><Megaphone size={18} /> Anunciar {currentCategory}</button></div><div className="grid grid-cols-1 gap-6">{ads.map((ad) => (<div key={ad.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row h-auto sm:h-48"><div className="relative w-full sm:w-64 h-48 sm:h-full flex-shrink-0 group"><img src={ad.image} alt={ad.title} className="w-full h-full object-cover" /><button onClick={(e) => { e.stopPropagation(); toggleLike(ad.id, ad.category); }} className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer z-10"><Heart size={18} className={ad.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} /></button></div><div className="flex-1 p-5 flex flex-col justify-between"><div><div className="flex justify-between items-start mb-1"><h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{ad.title}</h3>{ad.price && <span className="font-bold text-gray-900 text-lg">{ad.price}</span>}</div>{ad.isOnline && <div className="flex items-center gap-1.5 mb-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-xs font-medium text-emerald-600">Online</span></div>}<div className="flex flex-col gap-1 text-gray-500 text-sm mb-1"><div className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400" /> {ad.subtitle}</div>{ad.details?.bedrooms && <div className="flex items-center"><Building2 size={14} className="mr-1.5 text-gray-400" /> {ad.details.bedrooms}</div>}{ad.details?.condition && <div className="flex items-center"><Package size={14} className="mr-1.5 text-gray-400" /> {ad.details.condition}</div>}</div></div><div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2"><div className="flex items-center text-xs text-gray-400"><span>{ad.date}, {ad.time}</span></div><button className="text-emerald-600 text-sm font-medium hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">Ver detalhes</button></div></div></div>))}</div></div> );
  };

  const renderAllAds = () => {
    const allAds = [...parkingAds, ...serviceAds, ...donationAds, ...rentAds];
    const filteredAds = allAds.filter(ad => { const matchesCategory = filterCategory === 'todos' || ad.category === filterCategory; const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || ad.subtitle.toLowerCase().includes(searchTerm.toLowerCase()); return matchesCategory && matchesSearch; });
    const categories: {id: 'todos' | AdCategory, label: string}[] = [ { id: 'todos', label: 'Todos' }, { id: 'vagas', label: 'Vagas' }, { id: 'servicos', label: 'Serviços' }, { id: 'doacoes', label: 'Doações' }, { id: 'aluga', label: 'Aluga' } ];
    return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar"><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-800">Todos os Anúncios</h2><span className="text-sm text-gray-500">{filteredAds.length} resultados</span></div><div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-0 z-10"><div className="flex flex-col gap-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="Buscar em todos os anúncios..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div><div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">{categories.map(cat => ( <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${ filterCategory === cat.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50' }`}>{cat.label}</button>))}</div></div></div><div className="grid grid-cols-1 gap-6">{filteredAds.length > 0 ? filteredAds.map((ad) => (<div key={ad.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row h-auto sm:h-48"><div className="relative w-full sm:w-64 h-48 sm:h-full flex-shrink-0 group"><img src={ad.image} alt={ad.title} className="w-full h-full object-cover" /><div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-md text-white text-[10px] uppercase font-bold tracking-wide">{ad.category}</div><button onClick={(e) => { e.stopPropagation(); toggleLike(ad.id, ad.category); }} className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer z-10"><Heart size={18} className={ad.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} /></button></div><div className="flex-1 p-5 flex flex-col justify-between"><div><div className="flex justify-between items-start mb-1"><h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{ad.title}</h3>{ad.price && <span className="font-bold text-gray-900 text-lg">{ad.price}</span>}</div>{ad.isOnline && <div className="flex items-center gap-1.5 mb-3"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div><span className="text-xs font-medium text-emerald-600">Online</span></div>}<div className="flex flex-col gap-1 text-gray-500 text-sm mb-1"><div className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-400" /> {ad.subtitle}</div>{ad.details?.bedrooms && <div className="flex items-center"><Building2 size={14} className="mr-1.5 text-gray-400" /> {ad.details.bedrooms}</div>}{ad.details?.condition && <div className="flex items-center"><Package size={14} className="mr-1.5 text-gray-400" /> {ad.details.condition}</div>}</div></div><div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2"><div className="flex items-center text-xs text-gray-400"><span>{ad.date}, {ad.time}</span></div><button className="text-emerald-600 text-sm font-medium hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">Ver detalhes</button></div></div></div>)) : ( <div className="text-center py-20 text-gray-400"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search size={32} /></div><p>Nenhum anúncio encontrado para esta categoria.</p></div>)}</div></div> );
  };

  const renderSettings = () => { return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative">{renderCropModal()}<div className="max-w-3xl mx-auto"><div className="mb-8"><h2 className="text-2xl font-bold text-gray-800">Ajustes do Perfil</h2><p className="text-gray-500 text-sm">Gerencie suas informações pessoais e de exibição</p><div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3"><AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} /><p className="text-sm text-yellow-700">Ao optar em trocar o nickname, o usuário é responsável pela divulgação do seu nome.</p></div></div><div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"><div className="p-8"><form onSubmit={handleSaveProfile} className="space-y-8"><div className="flex flex-col items-center justify-center"><div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}><div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-emerald-200 transition-colors shadow-sm"><img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" /></div><div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={32} /></div><div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full border-2 border-white shadow-sm"><Upload size={16} /></div></div><p className="mt-3 text-sm text-gray-500">Clique para alterar a foto</p><input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Nome de Exibição / Unidade</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ex: BL2APT503 ou Seu Nome" /></div><p className="mt-1.5 text-xs text-gray-500">Este nome aparecerá para os outros condôminos e no chat.</p></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="seu@email.com" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="(00) 00000-0000" /></div></div></div><div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">{isSaved && <span className="text-emerald-600 text-sm font-medium flex items-center gap-1 animate-pulse"><Check size={16}/> Salvo com sucesso!</span>}<button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors flex items-center gap-2"><Save size={18} /> Salvar Alterações</button></div></form></div></div></div></div> ); };
  const renderSupport = () => { return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar"><div className="max-w-4xl mx-auto"><div className="text-center mb-12 mt-4"><h2 className="text-3xl font-bold text-gray-800 mb-2">Como podemos te ajudar? :)</h2><div className="max-w-xl mx-auto mt-6 relative"><input type="text" placeholder="Ex: como reservar o salão de festas" className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" /><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"><div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group flex flex-col items-center text-center"><div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors"><LifeBuoy size={28} /></div><h3 className="font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">Abrir Chamado</h3><p className="text-sm text-gray-500">Relate problemas técnicos, manutenções ou ocorrências no condomínio.</p></div><div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col items-center text-center"><div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-100 transition-colors"><GraduationCap size={28} /></div><h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">Solicitar Treinamento</h3><p className="text-sm text-gray-500">Agende capacitações sobre regras, segurança ou uso das áreas comuns.</p></div><div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-200 transition-all cursor-pointer group flex flex-col items-center text-center"><div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-yellow-100 transition-colors"><Lightbulb size={28} /></div><h3 className="font-bold text-gray-800 mb-2 group-hover:text-yellow-700 transition-colors">Feedback e Melhorias</h3><p className="text-sm text-gray-500">Envie suas sugestões para tornar nosso condomínio ainda melhor.</p></div></div><div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm"><h3 className="text-xl font-bold text-gray-800 mb-6">Perguntas frequentes</h3><ul className="space-y-4">{[ 'Exclusão de conta', 'Reativação de conta', 'Como emitir a segunda via do boleto?', 'Regras para uso da piscina e academia', 'Como cadastrar visitantes na portaria virtual?', 'Horários permitidos para obras e reformas', 'Política de animais de estimação nas áreas comuns', 'Golpe do WhatsApp' ].map((faq, index) => ( <li key={index}><a href="#" className="text-emerald-600 hover:text-emerald-800 hover:underline transition-colors font-medium text-base">{faq}</a></li>))}</ul></div></div></div> ); };

  // 1. Dashboard Logic
  if (activePage === 'home') { return ( <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative">{renderAnnouncementModal()}<div className="w-full bg-gray-900 rounded-2xl overflow-hidden shadow-lg mb-8 relative text-white h-[500px]"><div className="absolute inset-0"><img src="https://images.unsplash.com/photo-1576765611819-c07413254092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Campanha Vacinação" className="h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div></div><div className="relative z-10 h-full flex flex-col justify-center px-12 w-full md:w-1/2"><div className="flex gap-2 mb-6"><button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm"><ChevronLeft size={20}/></button><button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition backdrop-blur-sm"><ChevronRight size={20}/></button></div><h2 className="text-4xl font-bold tracking-wide mb-3 drop-shadow-md">CAMPANHAS</h2><p className="text-white text-xl mb-8 font-medium leading-relaxed drop-shadow-md">Chegou a hora de vacinar o seu filho. Proteja quem você ama.</p><button className="bg-emerald-600 text-white font-bold py-3 px-10 rounded-full w-fit shadow-lg hover:bg-emerald-700 transition-colors text-base flex items-center gap-2">Inserir</button></div></div><div className="grid grid-cols-4 gap-3 mb-12 max-w-2xl"><QuickAction icon={Car} label="Vagas" onClick={() => { if (onSelectCategory) onSelectCategory('vagas'); else { setCurrentCategory('vagas'); setInternalView('list'); } }} /><QuickAction icon={Briefcase} label="Serviços" onClick={() => { if (onSelectCategory) onSelectCategory('servicos'); else { setCurrentCategory('servicos'); setInternalView('list'); } }} /><QuickAction icon={HeartHandshake} label="Doações" onClick={() => { if (onSelectCategory) onSelectCategory('doacoes'); else { setCurrentCategory('doacoes'); setInternalView('list'); } }} /><QuickAction icon={Building2} label="Aluga" onClick={() => { if (onSelectCategory) onSelectCategory('aluga'); else { setCurrentCategory('aluga'); setInternalView('list'); } }} /></div><div><div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md shadow-red-200"><MessageCircle size={24} fill="currentColor" className="text-white" /></div><h3 className="text-red-500 font-bold text-lg tracking-wide uppercase">Comunicados</h3></div><div className="space-y-4">{announcementsList.map((item) => (<div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"><span className="text-gray-600 font-medium">{item.title}</span><div className="flex gap-2"><button onClick={() => handleEditAnnouncement(item)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Editar"><Edit2 size={14} /></button><button onClick={() => handleDeleteAnnouncement(item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Apagar"><Trash2 size={14} /></button></div></div>))}</div><div className="h-2 bg-gray-100 mt-4 rounded-full w-full"></div></div></div> ); }
  // 2. Ads Logic
  if (activePage === 'anuncios') { if (selectedCategory) { if (internalView === 'list') return renderCategoryList(); if (internalView === 'create') return renderCreateForm(); } else { return renderAllAds(); } }
  // Other Pages
  if (activePage === 'ajustes') return renderSettings();
  if (activePage === 'suporte') return renderSupport();
  if (activePage === 'mudanca') return renderCalendarPage('Agendamento de Mudança', 'Selecione uma data disponível para realizar sua mudança. Domingos não são permitidos.', (date) => date.getDay() === 0);
  if (activePage === 'salao') return renderCalendarPage('Reserva do Salão/Churrasqueira', 'Confira a disponibilidade e reserve o espaço para seu evento.', () => false, (date) => { const key = `${date.getDate()}-${date.getMonth() + 1}`; return holidays[key] ? <div className="mt-1"><div className="bg-blue-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded truncate">{holidays[key]}</div></div> : null; });
  if (activePage === 'eventos') return renderEventsPage();

  const otherPagesContent = () => {
    const blockOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    // Otimização: Gerar apenas apartamentos válidos (1-16 andares, 1-5 por andar) para evitar lista gigante que quebra o layout
    const apartmentOptions = [];
    for (let floor = 1; floor <= 16; floor++) {
      for (let unit = 1; unit <= 5; unit++) {
        apartmentOptions.push(`${floor}${unit.toString().padStart(2, '0')}`);
      }
    }
    
    switch (activePage) {
      case 'comunicados':
        return (
          <>
            {showCreateAnnouncementForm ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setShowCreateAnnouncementForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                    <ArrowLeft size={20} />
                  </button>
                  <h3 className="text-lg font-bold text-gray-800">Novo Comunicado</h3>
                </div>
                <form onSubmit={handleRegisterNewAnnouncement} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título do Comunicado</label>
                    <input 
                      type="text" 
                      value={newAnnouncementTitle} 
                      onChange={(e) => setNewAnnouncementTitle(e.target.value)} 
                      placeholder="Ex: Manutenção do Elevador"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anexar Fotos ou Documentos</label>
                    <div 
                      onDragOver={handleCreateAnnouncementDragOver} 
                      onDragLeave={handleCreateAnnouncementDragLeave} 
                      onDrop={handleCreateAnnouncementDrop} 
                      onClick={() => newAnnouncementFileInputRef.current?.click()} 
                      className={`mt-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDraggingCreateAnnouncementFile ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400'}`}
                    >
                      <input ref={newAnnouncementFileInputRef} type="file" multiple onChange={(e) => handleCreateAnnouncementFileSelect(e.target.files)} className="hidden" />
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Arraste e solte arquivos aqui, ou <span className="font-semibold text-emerald-600">clique para selecionar</span></p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (max 10MB)</p>
                    </div>
                    {createAnnouncementFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Arquivos Anexados:</h4>
                        {createAnnouncementFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileIcon size={16} className="text-gray-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button type="button" onClick={() => removeCreateAnnouncementFile(file.name)} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button type="button" onClick={() => setShowCreateAnnouncementForm(false)} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition">Cancelar</button>
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                      <Check size={18} /> Publicar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                 {announcementsList.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50 text-red-500">
                             <MessageCircle size={24} />
                          </div>
                          <span className="text-gray-800 font-medium">{item.title}</span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleEditAnnouncement(item)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="Editar">
                             <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteAnnouncement(item.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Apagar">
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                 ))}
                 <div className="flex justify-end mt-6">
                    <button onClick={() => setShowCreateAnnouncementForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition flex items-center gap-2">
                       <Plus size={18} /> Publicar Novo
                    </button>
                 </div>
              </div>
            )}
            {renderAnnouncementModal()}
          </>
        );
      case 'advertencias':
        return (
           <>
            {showWarningForm ? ( <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300"><div className="flex items-center gap-3 mb-6"><button onClick={() => setShowWarningForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={20} /></button><h3 className="text-lg font-bold text-gray-800">Registrar Advertência</h3></div><form onSubmit={handleRegisterWarning} className="space-y-6"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Bloco</label><div className="relative"><CustomSelect value={warningForm.block} onChange={(val) => setWarningForm({...warningForm, block: val})} options={blockOptions} icon={Building} prefix="Bloco " /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Apartamento</label><div className="relative"><CustomSelect value={warningForm.apt} onChange={(val) => setWarningForm({...warningForm, apt: val})} options={apartmentOptions} icon={Building} /></div></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Infração</label><select value={warningForm.infractionType} onChange={(e) => setWarningForm({...warningForm, infractionType: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none"><option>Som alto após as 22h</option><option>Uso indevido de vaga de garagem</option><option>Descarte irregular de lixo</option><option>Animais em área comum não permitida</option><option>Danos às áreas comuns</option><option>Outro</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Ocorrência</label><textarea value={warningForm.description} onChange={(e) => setWarningForm({...warningForm, description: e.target.value})} rows={4} placeholder="Descreva detalhadamente a ocorrência, incluindo datas, horários e outras informações relevantes." className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" required></textarea></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Anexar Fotos ou Documentos</label><div onDragOver={handleWarningDragOver} onDragLeave={handleWarningDragLeave} onDrop={handleWarningDrop} onClick={() => warningFileInputRef.current?.click()} className={`mt-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDraggingFile ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400'}`}><input ref={warningFileInputRef} type="file" multiple onChange={(e) => handleWarningFileSelect(e.target.files)} className="hidden" /><Upload size={32} className="text-gray-400 mb-2" /><p className="text-sm text-gray-600">Arraste e solte arquivos aqui, ou <span className="font-semibold text-emerald-600">clique para selecionar</span></p><p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (max 10MB)</p></div>{warningFiles.length > 0 && (<div className="mt-4 space-y-2"><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Arquivos Anexados:</h4>{warningFiles.map((file, index) => (<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"><div className="flex items-center gap-2 overflow-hidden"><FileIcon size={16} className="text-gray-500 flex-shrink-0" /><span className="text-sm text-gray-700 truncate">{file.name}</span><span className="text-xs text-gray-400 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span></div><button type="button" onClick={() => removeWarningFile(file.name)} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0"><X size={14} /></button></div>))}</div>)}</div><div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100"><button type="button" onClick={() => setShowWarningForm(false)} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition">Cancelar</button><button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2"><Check size={18} /> Registrar</button></div></form></div> ) : ( <div className="space-y-4">{warnings.map((item) => <ListItem key={item.id} icon={AlertTriangle} title={item.infractionType} subtitle={`${item.unit} • ${item.date}`} status={item.status} onStatusChange={() => handleWarningStatusChange(item.id)} />)}</div> )}
           </>
        );
      case 'denuncias':
        return (
          <>
            {showReportForm ? (
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300"><div className="flex items-center gap-3 mb-6"><button onClick={() => setShowReportForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={20} /></button><h3 className="text-lg font-bold text-gray-800">Registrar Denúncia</h3></div><form onSubmit={handleRegisterReport} className="space-y-6"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Bloco</label><div className="relative"><CustomSelect value={reportForm.block} onChange={(val) => setReportForm({...reportForm, block: val})} options={blockOptions} icon={Building} prefix="Bloco " /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Apartamento</label><div className="relative"><CustomSelect value={reportForm.apt} onChange={(val) => setReportForm({...reportForm, apt: val})} options={apartmentOptions} icon={Building} /></div></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Denúncia</label><select value={reportForm.infractionType} onChange={(e) => setReportForm({...reportForm, infractionType: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none"><option>Som alto após as 22h</option><option>Uso indevido de vaga de garagem</option><option>Perturbação da ordem</option><option>Outro</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Ocorrência</label><textarea value={reportForm.description} onChange={(e) => setReportForm({...reportForm, description: e.target.value})} rows={4} placeholder="Descreva detalhadamente a ocorrência..." className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" required></textarea></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Anexar Evidências</label><div onDragOver={handleReportDragOver} onDragLeave={handleReportDragLeave} onDrop={handleReportDrop} onClick={() => reportFileInputRef.current?.click()} className={`mt-1 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${isDraggingReportFile ? 'bg-emerald-50 border-emerald-400' : 'bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400'}`}><input ref={reportFileInputRef} type="file" multiple onChange={(e) => handleReportFileSelect(e.target.files)} className="hidden" /><Upload size={32} className="text-gray-400 mb-2" /><p className="text-sm text-gray-600">Arraste e solte arquivos aqui, ou <span className="font-semibold text-emerald-600">clique para selecionar</span></p></div>{reportFiles.length > 0 && (<div className="mt-4 space-y-2">{reportFiles.map((file, index) => (<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"><div className="flex items-center gap-2 overflow-hidden"><FileIcon size={16} className="text-gray-500 flex-shrink-0" /><span className="text-sm text-gray-700 truncate">{file.name}</span></div><button type="button" onClick={() => removeReportFile(file.name)} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0"><X size={14} /></button></div>))}</div>)}</div><div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100"><button type="button" onClick={() => setShowReportForm(false)} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition">Cancelar</button><button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2"><Check size={18} /> Registrar</button></div></form></div>
            ) : (
              <div className="space-y-4">{reports.map((item) => <ListItem key={item.id} icon={Megaphone} title={item.infractionType} subtitle={`Unidade: ${item.unit} • Reportado por ${item.reportedBy} • ${item.date}`} status={item.status} onStatusChange={() => handleReportStatusChange(item.id)} />)}</div>
            )}
          </>
        );
      case 'encomendas':
        return (
          <>
            {showPackageForm ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <button onClick={() => setShowPackageForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={20} /></button>
                  <h3 className="text-lg font-bold text-gray-800">Notificar Encomenda</h3>
                </div>
                <form onSubmit={handleRegisterPackage} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bloco</label>
                      <div className="relative">
                        <CustomSelect value={packageForm.block} onChange={(val) => setPackageForm({...packageForm, block: val})} options={blockOptions} icon={Building2} prefix="Bloco " />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apartamento</label>
                      <div className="relative">
                        <CustomSelect value={packageForm.apt} onChange={(val) => setPackageForm({...packageForm, apt: val})} options={apartmentOptions} icon={Building2} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Encomenda</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Carta', 'Pequeno', 'Médio', 'Grande'].map(type => (
                        <div key={type} onClick={() => setPackageForm({...packageForm, type})} className={`cursor-pointer text-center py-3 px-2 rounded-lg border transition-all ${packageForm.type === type ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium ring-1 ring-emerald-500' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                          <span className="text-sm">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Código de Rastreio / Identificação</label>
                     <div className="relative">
                        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={packageForm.code} onChange={(e) => setPackageForm({...packageForm, code: e.target.value})} placeholder="Ex: BR123456789BR" className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none font-mono uppercase" />
                     </div>
                  </div>
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-50 mt-2">
                     <button type="button" onClick={() => setShowPackageForm(false)} className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition">Cancelar</button>
                     <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-8 rounded-lg shadow-md transition-colors flex items-center gap-2">
                       <Check size={18} /> Enviar
                     </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-4">{packages.map((item) => <ListItem key={item.id} icon={Package} title={`${item.type} - ${item.code}`} subtitle={`${item.unit} • ${item.date}`} status={item.status} onStatusChange={() => handlePackageStatusChange(item.id)} />)}</div>
            )}
          </>
        );
      default:
        return <div className="flex flex-col items-center justify-center h-96 text-gray-400"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Cog size={32} /></div><p>Funcionalidade de {activePage} em desenvolvimento.</p></div>;
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {activePage === 'denuncias' ? 'Denúncias' : activePage === 'anuncios' ? 'Anúncios' : activePage === 'advertencias' ? 'Advertências' : activePage.replace('-', ' ')}
        </h2>
        {activePage === 'encomendas' && !showPackageForm && (
           <button onClick={() => setShowPackageForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition flex items-center gap-2">
             <Package size={18} /> Notificar
           </button>
        )}
        {activePage === 'advertencias' && !showWarningForm && (
           <button onClick={() => setShowWarningForm(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg shadow-sm transition flex items-center gap-2">
             <Plus size={18} /> Registrar
           </button>
        )}
      </div>
      {otherPagesContent()}
    </div>
  );
};

export default MainContent;