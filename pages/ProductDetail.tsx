import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  HelpCircle,
  MessageCircle,
  Check,
  ChevronRight,
  ShoppingBag,
  Headphones,
  Copy,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRightLeft,
  XCircle,
  MessageSquare,
  ChevronLeft,
  Share,
  MoreHorizontal,
  Settings,
  Edit3,
  BarChart2,
  Lock
} from 'lucide-react';
import ReportCard from '../components/ReportCard';
import PriceChart from '../components/PriceChart';
import { ACCESSORIES, PRODUCT_SPECS, RECOMMENDED_PRODUCTS } from '../constants';
import { UserRole, ListingStatus } from '../types';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  
  // --- Page State Definitions ---
  // 1. User Role State: 'buyer' (default) or 'seller' (owner of the item)
  const [userRole, setUserRole] = useState<UserRole>('buyer');
  
  // 2. Listing Status State: 'active', 'sold', or 'reserved'
  const [listingStatus, setListingStatus] = useState<ListingStatus>('active');
  
  // 3. Interaction State
  const [isLiked, setIsLiked] = useState(false);
  
  // Existing UI States
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDevTools, setShowDevTools] = useState(false); // Toggle for the simulator panel
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Section Refs for scrolling
  const overviewRef = useRef<HTMLElement>(null);
  const serviceRef = useRef<HTMLElement>(null);
  const specsRef = useRef<HTMLElement>(null);
  const sellerRef = useRef<HTMLElement>(null);

  // Handle image scroll tracking
  const handleImageScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setCurrentImageIndex(index);
    }
  };

  // Scroll to section handler
  const scrollToSection = (ref: React.RefObject<HTMLElement | null>, tabId: string) => {
    setActiveTab(tabId);
    if (ref.current) {
      const yOffset = -110; // Adjust for sticky header height
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Scroll listener for Sticky Nav and Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Toggle Sticky Nav visibility (show after scrolling past hero image approx 300px)
      setShowStickyNav(scrollY > 300);

      // Scroll Spy Logic
      const sections = [
        { id: 'overview', ref: overviewRef },
        { id: 'service', ref: serviceRef },
        { id: 'specs', ref: specsRef },
        { id: 'seller', ref: sellerRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          // Check if section is roughly in the top part of the viewport
          if (rect.top >= -100 && rect.top <= 250) {
            setActiveTab(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages = [
    "https://picsum.photos/800/800?random=1",
    "https://picsum.photos/800/800?random=2",
    "https://picsum.photos/800/800?random=3",
    "https://picsum.photos/800/800?random=4",
  ];

  const tabs = [
    { id: 'overview', label: '概覽', ref: overviewRef },
    { id: 'service', label: '代驗服務', ref: serviceRef },
    { id: 'specs', label: '規格', ref: specsRef },
    { id: 'seller', label: '賣家', ref: sellerRef },
  ];

  // --- Conditional Rendering Logic Helpers ---

  // Helper to determine the footer content based on state
  const renderFooter = () => {
    // Scenario 1: Item is SOLD
    if (listingStatus === 'sold') {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-200 px-4 pt-3 pb-6 flex items-center justify-between z-50 max-w-md mx-auto">
           <div className="flex-1 text-center font-bold text-gray-500 py-2.5 bg-gray-200 rounded-lg cursor-not-allowed">
              已售出 (Sold Out)
           </div>
        </div>
      );
    }

    // Scenario 2: User is the SELLER (Owner view)
    if (userRole === 'seller') {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 flex items-center justify-between z-50 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="flex flex-col items-center gap-1 text-gray-400 mr-4">
              <BarChart2 size={20} />
              <span className="text-[10px]">數據</span>
           </div>
           <div className="flex gap-3 flex-1">
             <button className="flex-1 border border-slate-200 text-slate-700 bg-white text-sm font-bold py-2.5 rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                 <Edit3 size={16} /> 編輯
             </button>
             <button className="flex-1 bg-slate-800 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                 <Lock size={16} /> 下架
             </button>
           </div>
        </div>
      );
    }

    // Scenario 3: User is a BUYER (Default view)
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 flex items-center justify-between z-50 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex gap-6 text-gray-400 text-[10px] font-medium mr-2">
             <button className="flex flex-col items-center gap-1 hover:text-emerald-600 transition-colors active:scale-95">
                 <Headphones size={22} strokeWidth={1.5} />
                 <span>客服</span>
             </button>
             <button className="flex flex-col items-center gap-1 hover:text-emerald-600 transition-colors active:scale-95">
                 <ShoppingBag size={22} strokeWidth={1.5} />
                 <span>賣同款</span>
             </button>
             <button className="flex flex-col items-center gap-1 hover:text-emerald-600 transition-colors active:scale-95">
                 <ShoppingBag size={22} strokeWidth={1.5} />
                 <span>求購</span>
             </button>
         </div>
         <div className="flex gap-3 ml-2 flex-1">
             <button className="flex-1 border border-emerald-600 text-emerald-700 bg-emerald-50 text-sm font-bold py-2.5 rounded-lg active:scale-95 transition-transform">
                 諮詢
             </button>
             {/* Updated Link to Order Page */}
             <button 
                onClick={() => navigate('/order')}
                className="flex-1 bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-lg shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
             >
                 立即出價
             </button>
         </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen relative pb-28 shadow-2xl overflow-hidden">
      
      {/* --- DEV TOOLS SIMULATOR (Floating Panel) --- */}
      {/* Changed to 'absolute' so it stays attached to the max-w-md container */}
      <div className="absolute top-20 right-0 z-[100] flex flex-col items-end pointer-events-none">
        <button 
          onClick={() => setShowDevTools(!showDevTools)}
          className="bg-slate-800 text-white p-2 rounded-l-lg shadow-lg pointer-events-auto hover:bg-slate-700 transition-colors flex items-center gap-1"
        >
          <Settings size={18} className={showDevTools ? "animate-spin" : ""} />
          {!showDevTools && <span className="text-[10px] font-bold">DEV</span>}
        </button>
        
        {showDevTools && (
          <div className="bg-slate-800/95 backdrop-blur text-white p-4 rounded-l-xl mt-2 w-48 shadow-2xl pointer-events-auto border-l border-slate-600">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">State Simulator</h4>
            
            <div className="mb-4">
              <label className="text-xs font-bold block mb-1">User Role</label>
              <div className="flex bg-slate-700 rounded p-1">
                <button 
                  onClick={() => setUserRole('buyer')}
                  className={`flex-1 text-[10px] py-1 rounded ${userRole === 'buyer' ? 'bg-emerald-500 text-white' : 'text-slate-300'}`}
                >Buyer</button>
                <button 
                  onClick={() => setUserRole('seller')}
                  className={`flex-1 text-[10px] py-1 rounded ${userRole === 'seller' ? 'bg-emerald-500 text-white' : 'text-slate-300'}`}
                >Seller</button>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-xs font-bold block mb-1">Listing Status</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-700 rounded p-1">
                <button 
                  onClick={() => setListingStatus('active')}
                  className={`text-[10px] py-1 rounded ${listingStatus === 'active' ? 'bg-blue-500 text-white' : 'text-slate-300'}`}
                >Active</button>
                <button 
                  onClick={() => setListingStatus('sold')}
                  className={`text-[10px] py-1 rounded ${listingStatus === 'sold' ? 'bg-red-500 text-white' : 'text-slate-300'}`}
                >Sold</button>
              </div>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 text-center">Toggle these to see layout changes</p>
          </div>
        )}
      </div>
      {/* --- END DEV TOOLS --- */}


      {/* Sticky Tab Bar */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-md transform transition-transform duration-300 ease-in-out max-w-md mx-auto ${showStickyNav ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex justify-between items-center px-2 pt-2 pb-0">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => scrollToSection(tab.ref, tab.id)}
               className={`flex-1 py-3 text-sm font-bold relative transition-colors ${activeTab === tab.id ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-800'}`}
             >
               {tab.label}
               {activeTab === tab.id && (
                 <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-emerald-600 rounded-full"></span>
               )}
             </button>
           ))}
        </div>
      </div>

      {/* 1. Header (Absolute - scrolls with page) */}
      <header className={`absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 pt-5 transition-opacity duration-300 ${showStickyNav ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={() => navigate('/list')}
          className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 transition-colors text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setIsLiked(!isLiked)}
             className={`p-2 rounded-full backdrop-blur-md transition-colors ${isLiked ? 'bg-white text-red-500 shadow-md' : 'bg-black/20 text-white hover:bg-black/30'}`}
          >
             <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 transition-colors text-white">
             <Share size={22} />
          </button>
          <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 transition-colors text-white">
             <MoreHorizontal size={22} />
          </button>
        </div>
      </header>

      {/* 2. Hero Image Gallery */}
      <div className="relative h-96 w-full bg-slate-100">
        <div 
          ref={scrollContainerRef}
          onScroll={handleImageScroll}
          className={`flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full ${listingStatus === 'sold' ? 'grayscale opacity-80' : ''}`}
        >
          {galleryImages.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`Watch view ${idx + 1}`} 
              className="w-full h-full object-cover snap-center flex-shrink-0"
            />
          ))}
        </div>
        
        {/* SOLD OUT Overlay Layer */}
        {listingStatus === 'sold' && (
           <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-black/50 backdrop-blur-sm flex items-center justify-center">
                 <span className="text-white font-black text-xl tracking-widest uppercase -rotate-12 border-4 border-white p-2">SOLD</span>
              </div>
           </div>
        )}
        
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
           {galleryImages.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
             />
           ))}
        </div>
        
        {/* Count Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full font-medium z-10 tracking-widest">
          {currentImageIndex + 1}/{galleryImages.length}
        </div>
      </div>

      {/* 3. Product Summary (Overview Ref) */}
      <section ref={overviewRef} className="bg-white p-5 pb-4 rounded-b-2xl shadow-sm mb-3 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 mr-2">
             <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-sm text-gray-500 font-medium">MOP</span>
                {/* CONDITIONAL PRICE STYLE */}
                <span className={`text-3xl font-bold tracking-tight leading-none ${listingStatus === 'sold' ? 'text-gray-400 line-through decoration-2' : 'text-slate-900'}`}>
                    490,000
                </span>
                
                {listingStatus === 'active' && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200 whitespace-nowrap align-middle">期货</span>
                )}
                {listingStatus === 'sold' && (
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200 whitespace-nowrap align-middle">已售出</span>
                )}
             </div>
             <div className="text-[11px] text-gray-400 mt-1.5 flex flex-wrap gap-2 items-center">
               <span>≈ USD 1,660,090</span>
               <span className="w-px h-3 bg-gray-300 hidden sm:block"></span>
               <span>官方價: MOP 540,000</span>
             </div>
          </div>
          <div className="flex-shrink-0 group active:scale-95 transition-transform border border-gray-200 rounded-lg px-2.5 py-1.5 flex flex-col items-center shadow-sm bg-gray-50">
              <span className="font-black italic text-lg leading-none text-slate-800 group-hover:text-blue-600">PK</span>
              <span className="text-[9px] text-gray-400 leading-none mt-1">同款对比</span>
          </div>
        </div>
        
        <h1 className="text-xl font-bold text-slate-900 mt-3 leading-snug">
          Cartier 坦克系列 212.128.1110.333 <span className="text-gray-500 font-normal text-base block sm:inline mt-1 sm:mt-0">(貓頭鷹BUCKS)</span>
        </h1>
        <div className="flex items-center gap-2 mt-2">
           <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">PATEK PHILIPPE</p>
           <button className="text-gray-400 hover:text-slate-800 p-1 rounded-full active:bg-gray-100"><Copy size={12} /></button>
        </div>

        {/* WM Check Banner */}
        <div className="mt-5 bg-gradient-to-r from-stone-50 to-white rounded-xl p-3 flex items-center justify-between border border-stone-100 shadow-sm relative overflow-hidden group active:bg-stone-50 transition-colors cursor-pointer">
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600"></div>
           <div className="flex items-center gap-3 z-10">
               <div className="bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm flex-shrink-0">WM代驗</div>
               <span className="text-xs text-gray-600 truncate">經平台驗貨中心鑒定通過後，再行交付。</span>
           </div>
           <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>

        {/* Basic Meta Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">商品狀態</span>
                <span className="text-slate-800 font-medium flex items-center gap-1">二手 · 極新 <HelpCircle size={14} className="text-gray-400"/></span>
            </div>
             <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
                <span className="text-gray-500">證書日期</span>
                <span className="text-slate-800 font-medium">2012.12</span>
            </div>
             <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-2">
                <span className="text-gray-500">附屬配件</span>
                <span className="text-slate-800 font-medium truncate ml-2">不附原版證書，不附原版包裝盒</span>
            </div>
        </div>
      </section>

      {/* 4. Trading Methods (Refined UI + Service Ref) */}
      <section ref={serviceRef} className="bg-white px-5 py-5 mb-3 mx-0 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-slate-800"/>
                <span className="text-base font-bold text-slate-800">交易方式選擇</span>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 items-stretch">
            {/* Direct - More subtle */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl flex flex-col relative overflow-hidden group active:border-gray-300">
                <div className="bg-gray-100/50 p-3 text-center border-b border-gray-200/60 h-[42px] flex items-center justify-center">
                    <h3 className="font-bold text-slate-600 text-sm">自行聯絡賣家</h3>
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1 pt-3 pb-3 justify-start">
                    <div className="flex items-start gap-2">
                        <MessageSquare size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-gray-500 leading-tight">私下溝通議價及交收方法</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <AlertCircle size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-gray-500 leading-tight">自行承擔真偽風險</p>
                    </div>
                     <div className="flex items-start gap-2">
                        <XCircle size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-gray-500 leading-tight">平台不介入糾紛</p>
                    </div>
                </div>
            </div>

            {/* WM Service - Prominent */}
            <div className="bg-white border-2 border-emerald-500/30 rounded-xl flex flex-col relative overflow-hidden shadow-sm ring-4 ring-emerald-50/50">
                {/* Recommended Badge */}
                <div className="absolute top-0 right-0 z-10">
                     <div className="bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg shadow-sm">
                        官方推薦
                     </div>
                </div>

                <div className="bg-emerald-50/80 p-3 text-center border-b border-emerald-100 h-[42px] flex items-center justify-center">
                    <h3 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5 pl-2">
                        <ShieldCheck size={15} className="text-emerald-600"/> WM 代驗服務
                    </h3>
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1 pt-3 pb-3 justify-start">
                    <div className="flex items-start gap-2">
                        <Check size={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-emerald-900 leading-tight font-medium">服務費 2% + 誠意金 1% (交易完成後退回)</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check size={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-emerald-900 leading-tight font-medium">AG 權威驗證，100% 正品保障</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check size={13} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[11px] text-emerald-900 leading-tight font-medium">專人跟進交收，保障買賣權益</p>
                    </div>
                </div>
                <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 py-2.5 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1 border-t border-emerald-100">
                    查看服務詳情 <ChevronRight size={10}/>
                </button>
            </div>
        </div>
      </section>

      {/* 5. Report */}
      <section className="px-4 mb-3">
        <ReportCard />
      </section>

      {/* 6. Product Info (Expandable) */}
      <section className="bg-white p-5 mb-3 rounded-2xl mx-4 shadow-sm border border-gray-100">
         <h2 className="text-lg font-bold text-slate-800 mb-3">商品信息</h2>
         
         <div className="mb-5">
            <h3 className="text-sm font-bold text-slate-700 mb-2">商品描述</h3>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                <p className={`text-xs text-gray-600 leading-relaxed transition-all duration-300 ${isDescExpanded ? '' : 'line-clamp-3'}`}>
                    這款 Cartier 坦克系列腕錶整體成色約九成新，散發著典雅高貴的氣質。白色錶盤清晰易讀，藍鋼指針走動準確有力，整體機械結構與外觀保養程度優異。目前專櫃價約 32,400，本店現貨供應。配件方面齊全，包含原廠錶帶與備用扣環。適合商務人士佩戴，展現專業形象。如有任何疑問，歡迎隨時諮詢。
                </p>
                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="w-full flex items-center justify-center gap-1 mt-2 text-xs font-bold text-emerald-600 pt-2 border-t border-gray-200 hover:bg-stone-100 rounded pb-1 transition-colors"
                >
                  {isDescExpanded ? '收起描述' : '展開全部'} {isDescExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                </button>
            </div>
         </div>

         <div>
             <h3 className="text-sm font-bold text-slate-700 mb-2">配件清單</h3>
             <div className="space-y-3">
                 {ACCESSORIES.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 last:border-0 pb-1.5">
                         <span className="text-gray-600 font-medium">{item.name}</span>
                         <div className="flex items-center gap-2">
                             {item.note && <span className="text-xs bg-gray-100 text-slate-700 px-1.5 py-0.5 rounded">{item.note}</span>}
                             {item.count && <span className="text-xs font-bold text-slate-900">x{item.count}</span>}
                             {item.name === '證書' && <HelpCircle size={14} className="text-gray-400"/>}
                             {item.included ? (
                                 <div className="bg-emerald-100 p-0.5 rounded-full">
                                    <Check size={12} className="text-emerald-700" />
                                 </div>
                             ) : (
                                <span className="text-xs text-gray-300">--</span>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* 7. Consultant */}
      <section className="bg-white p-5 mb-3 rounded-2xl mx-4 shadow-sm border border-gray-100">
         <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-slate-800">專屬顧問</h3>
             <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">EN / CN</span>
         </div>
         <div className="flex items-center gap-4 mb-4">
             <div className="relative flex-shrink-0">
                <img src="https://picsum.photos/60/60?random=20" className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" alt="Consultant" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
             </div>
             <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-800 text-base truncate">Bruce Yip</span>
                     <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">從業8年</span>
                 </div>
                 <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">
                     交易、驗表流程疑問？我隨時在線為您解答。
                 </p>
             </div>
         </div>
         <div className="grid grid-cols-2 gap-3">
             <button className="border border-gray-200 bg-white rounded-lg py-2.5 text-sm text-slate-700 font-bold hover:bg-gray-50 active:scale-95 transition-all">立即諮詢</button>
             <button className="border border-emerald-200 bg-emerald-50 rounded-lg py-2.5 text-sm text-emerald-700 font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 active:scale-95 transition-all">
                 <MessageCircle size={16} /> Whatsapp
             </button>
         </div>
      </section>

      {/* 8. Specs & Price Trend (Specs Ref) */}
      <section ref={specsRef} className="bg-white p-5 mb-3 rounded-2xl mx-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-emerald-600 rounded-full"></span>
            基本參數 & 價格走勢
        </h2>
        
        {/* Product Card inside Specs - Updated Style */}
        <div className="flex gap-4 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="w-20 h-24 bg-white rounded-lg p-1.5 border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                <img src="https://picsum.photos/200/200?random=1" className="w-full h-full object-contain mix-blend-multiply" alt="Thumbnail" />
            </div>
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">Cartier 坦克系列</h3>
                <h4 className="text-xs text-gray-500 mt-0.5 truncate">212.128.1110.333</h4>
                <div className="flex gap-2 mt-2">
                    <button className="flex-1 px-2 border border-slate-300 text-slate-700 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors">
                        <Heart size={10} /> 關注
                    </button>
                    <button className="flex-1 px-2 border border-slate-300 text-slate-700 text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-50 transition-colors">
                        <ArrowRightLeft size={10} /> 對比
                    </button>
                </div>
            </div>
        </div>

        {/* Specs List */}
        <div className="space-y-0.5 bg-white rounded-xl">
            {PRODUCT_SPECS.map((spec, idx) => (
                <div key={idx} className="flex justify-between text-xs py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 flex-shrink-0">{spec.label}</span>
                    <span className="text-slate-800 font-medium text-right truncate pl-2">{spec.value}</span>
                </div>
            ))}
        </div>
        
        <div className="text-center mt-3 mb-5">
            <button className="text-xs font-bold text-slate-500 bg-gray-50 flex items-center justify-center gap-1 mx-auto py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
                查看完整參數 <ChevronRight size={12} />
            </button>
        </div>

        <div className="border-t border-gray-100 pt-5">
            <PriceChart />
        </div>
      </section>

      {/* 9. Seller Info (Seller Ref) */}
      <section ref={sellerRef} className="bg-white p-5 mb-3 rounded-2xl mx-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
               <h3 className="font-bold text-slate-800 text-base">商家信息</h3>
               <button className="flex items-center text-xs text-gray-400 hover:text-slate-600 transition-colors">
                   查看主頁 <ChevronRight size={14} />
               </button>
          </div>

          <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white flex-shrink-0 overflow-hidden">
                        <img src="https://picsum.photos/100/100?random=88" className="w-full h-full object-cover" alt="S" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                        <Check size={8} strokeWidth={4} />
                    </div>
                  </div>
                  <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-base truncate flex items-center gap-1">
                          Super ABC 
                          <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1.5 rounded py-0.5">認證</span>
                      </h3>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-1 truncate">
                          日本 · 東京
                          <span className="w-0.5 h-2.5 bg-gray-300"></span>
                          <span className="text-emerald-600 font-medium">好評 4.9</span>
                      </p>
                  </div>
              </div>
              <button className="border border-slate-200 bg-white hover:bg-slate-50 rounded-full px-5 py-1.5 text-xs text-slate-700 font-bold transition-colors flex-shrink-0 shadow-sm">
                  + 關注
              </button>
          </div>

          {/* Conditional Seller Action: Only show if NOT the seller themselves */}
          {userRole !== 'seller' && (
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-gray-600 mb-5 flex items-center gap-3 border border-slate-100">
                <div className="flex-1 text-center border-r border-gray-200">
                    <p className="text-gray-400 text-[10px] mb-0.5">在售商品</p>
                    <p className="font-bold text-slate-800 text-lg">145</p>
                </div>
                <div className="flex-1 text-center border-r border-gray-200">
                    <p className="text-gray-400 text-[10px] mb-0.5">成交量</p>
                    <p className="font-bold text-slate-800 text-lg">328</p>
                </div>
                <div className="flex-1 text-center">
                    <p className="text-gray-400 text-[10px] mb-0.5">粉絲數</p>
                    <p className="font-bold text-slate-800 text-lg">2.1k</p>
                </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
               {[1,2,3].map((i) => (
                   <div key={i} className="group cursor-pointer">
                       <div className="overflow-hidden rounded-lg mb-2 relative aspect-square bg-gray-100 border border-gray-100">
                           <img src={`https://picsum.photos/200/200?random=${30+i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="item" />
                       </div>
                       <p className="text-[10px] font-bold text-slate-800 truncate px-0.5">Patek Philippe</p>
                       <p className="text-[10px] font-medium text-gray-500 px-0.5">HKD 490,000</p>
                   </div>
               ))}
          </div>
      </section>

      {/* 12. Recommended */}
      <section className="px-4 pb-4">
         <h2 className="text-lg font-bold text-slate-800 mb-4 pl-2 border-l-4 border-emerald-500">猜你喜歡</h2>
         <div className="grid grid-cols-2 gap-3">
             {RECOMMENDED_PRODUCTS.map((prod) => (
                 <div key={prod.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative border border-gray-100 group">
                     <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm active:scale-90 transition-transform">
                         <Heart size={14} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                     </div>
                     <div className="overflow-hidden h-40 bg-gray-100">
                        <img src={prod.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={prod.name} />
                     </div>
                     <div className="p-3">
                         <h3 className="text-xs font-bold text-slate-800 truncate mb-1">{prod.name}</h3>
                         <div className="flex items-baseline gap-1">
                             <span className="text-xs text-gray-400">MOP</span>
                             <p className="text-sm font-bold text-slate-900">{prod.price.replace('MOP ', '')}</p>
                         </div>
                     </div>
                 </div>
             ))}
         </div>
      </section>

      {/* Sticky Footer - Dynamic Rendering based on State */}
      {renderFooter()}
      
      {/* IOS Home Indicator spacer - ADDED pointer-events-none */}
      <div className="h-2 w-32 bg-slate-900 rounded-full mx-auto fixed bottom-1 left-0 right-0 z-50 opacity-20 max-w-md pointer-events-none"></div>

    </div>
  );
};

export default ProductDetail;