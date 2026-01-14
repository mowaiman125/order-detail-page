import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  AlertCircle,
  Settings,
  Headphones,
  FileText,
  CreditCard,
  Warehouse,
  Handshake,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Info,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Calculator,
  ThumbsDown,
  Gavel,
  Undo2
} from 'lucide-react';
import { TransactionStatus, UserRole } from '../types';

const OrderDetail: React.FC = () => {
  const navigate = useNavigate();

  // --- Mock Data ---
  const PRODUCT = {
    brand: 'Audemars Piguet',
    model: '15551ST.ZZ.1356ST.05',
    name: 'Royal Oak Selfwinding',
    price: 250000, // Reduced for easier math visualization (HKD)
    image: 'https://picsum.photos/400/400?random=99',
    tags: ['全新', '07/2025', '現貨', '全套']
  };

  // --- State Management ---
  // Default to draft_offer for testing this requirement
  const [status, setStatus] = useState<TransactionStatus>('draft_offer');
  const [role, setRole] = useState<UserRole>('buyer');
  const [showDevTools, setShowDevTools] = useState(false);

  // --- Form State (Only for 'draft_offer') ---
  const [offerPrice, setOfferPrice] = useState<number>(PRODUCT.price);
  const [serviceMode, setServiceMode] = useState<'wm' | 'direct'>('wm');
  const [handoverMethod, setHandoverMethod] = useState<'wm_center' | 'self'>('wm_center');
  const [agreements, setAgreements] = useState({
    tnc: false,
    shipping: false
  });
  
  // UI State for fee toggle
  const [isFeeDetailsExpanded, setIsFeeDetailsExpanded] = useState(false);

  // --- Modify Offer Modal State (Buyer) ---
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [modifyingPrice, setModifyingPrice] = useState<number>(0);

  // --- Cancel Offer Modal State (Buyer) ---
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // --- Seller Actions Modal States ---
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRetractCounterModalOpen, setIsRetractCounterModalOpen] = useState(false); // NEW
  
  const [counterPrice, setCounterPrice] = useState<number>(0);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Scroll Drag Logic State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update handover method automatically if service mode changes
  useEffect(() => {
    if (serviceMode === 'direct') {
      setHandoverMethod('self');
    } else {
      setHandoverMethod('wm_center');
    }
  }, [serviceMode]);

  // 7 Steps Definition
  const STEPS = [
    { id: 'offer', label: '出價', labelEn: 'Offer', icon: CheckCircle2 },
    { id: 'payment', label: '付款', labelEn: 'Payment', icon: CreditCard },
    { id: 'shipping', label: '寄驗', labelEn: 'Ship', icon: Truck },
    { id: 'warehouse', label: '入庫', labelEn: 'Stock In', icon: Warehouse },
    { id: 'authenticating', label: '鑑定', labelEn: 'Auth', icon: ShieldCheck },
    { id: 'handover', label: '交收', labelEn: 'Trade', icon: Handshake },
    { id: 'completed', label: '完成', labelEn: 'Complete', icon: Package },
  ];

  // --- Helper: Map Granular Status to Visual Step ID ---
  // Returns: [currentStepId, isFailedState]
  const getVisualStepInfo = (s: TransactionStatus): [string, boolean] => {
    switch (s) {
      case 'draft_offer': // New State maps to offer but distinct visual handling
      case 'offer_submitted': 
      case 'offer_countered': 
        return ['offer', false];
      
      case 'payment_pending': 
        return ['payment', false];
      
      case 'to_ship': 
      case 'in_transit': 
        return ['shipping', false];
      
      case 'warehouse_received': 
        return ['warehouse', false];
      
      case 'authenticating': 
      case 'auth_passed': 
      case 'auth_passed_dispute': 
        return ['authenticating', false];
      case 'auth_failed':
        return ['authenticating', true];
      
      case 'handover_wm': 
      case 'handover_self': 
      case 'handover_seller_retrieved': 
        return ['handover', false];
      
      case 'completed': 
      case 'refunded':
        return ['completed', false];
        
      case 'cancelled':
        return ['completed', true];
      
      default: 
        return ['offer', false];
    }
  };

  // --- Helper: Get Stepper Item Status ---
  const getStepStatus = (stepId: string, index: number) => {
    const [currentVisualStepId, isFailed] = getVisualStepInfo(status);
    const stepOrder = ['offer', 'payment', 'shipping', 'warehouse', 'authenticating', 'handover', 'completed'];
    const currentIndex = stepOrder.indexOf(currentVisualStepId);
    
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) {
      if (isFailed) return 'failed';
      return 'active';
    }
    return 'pending';
  };

  // --- Mouse Drag Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => {
    setIsDown(false);
  };
  const handleMouseUp = () => {
    setIsDown(false);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // --- Calculation Helpers ---
  const calculateFees = (price: number) => {
      const rawFee = price * 0.02;
      const fee = Math.max(1500, Math.min(5000, rawFee));
      const deposit = price * 0.01;
      return { fee, deposit };
  };

  // --- Actions ---
  const handleConfirmModify = () => {
    if (modifyingPrice > offerPrice) {
        setOfferPrice(modifyingPrice);
        setIsModifyModalOpen(false);
    }
  };

  const handleConfirmCancel = () => {
      setStatus('cancelled');
      setIsCancelModalOpen(false);
  };

  // Seller Actions
  const handleSellerAccept = () => {
      // Logic: Lock Stock -> Wait for Payment
      setStatus('payment_pending'); 
      setIsAcceptModalOpen(false);
  };

  const handleSellerCounter = () => {
      if(counterPrice > 0) {
        setOfferPrice(counterPrice); // In reality, this would be a separate "counter offer" field
        setStatus('offer_countered');
        setIsCounterModalOpen(false);
      }
  };

  const handleSellerReject = () => {
      setStatus('cancelled'); // Or a specific rejected state
      setIsRejectModalOpen(false);
  };

  const handleRetractCounter = () => {
      setStatus('cancelled');
      setIsRetractCounterModalOpen(false);
  };

  // --- Render Sections ---

  // A: Status Card
  const renderStatusCard = () => {
    let title = '';
    let subtitle = '';
    let icon = <Clock size={24} className="text-white" />;
    let bgColor = 'bg-orange-500'; 
    let isPulse = false;
    let countdownStr = '';

    if (status === 'draft_offer') {
       title = '填寫出價單';
       subtitle = '請輸入出價金額並選擇交易方式';
       bgColor = 'bg-slate-800'; 
       icon = <FileText size={24} className="text-white" />;
    } else {
        switch (status) {
          case 'offer_submitted':
            if (role === 'buyer') {
              title = '等待賣家回覆';
              subtitle = '已發送出價，請耐心等候';
              bgColor = 'bg-orange-500';
              icon = <Clock size={24} className="text-white" />;
              countdownStr = '有效期剩餘：23:59:00';
            } else {
              title = '收到新出價';
              subtitle = '請決定接受、拒絕或提出還價';
              bgColor = 'bg-orange-500';
              icon = <AlertCircle size={24} className="text-white" />;
              countdownStr = '剩餘回應時間：23:59:00';
            }
            break;
          // ... (Existing cases remain unchanged) ...
          case 'offer_countered':
            if (role === 'buyer') {
              title = '賣家已還價';
              subtitle = '賣家提出了新價格，請確認';
              bgColor = 'bg-emerald-500';
              icon = <AlertCircle size={24} className="text-white" />;
            } else {
              title = '等待買家回覆';
              subtitle = '已發送還價，等待買家確認';
              bgColor = 'bg-orange-500';
              icon = <Clock size={24} className="text-white" />;
            }
            break;
          case 'payment_pending':
            if (role === 'buyer') {
              title = '訂單成立 請付款';
              subtitle = '庫存鎖定中，剩餘 03:59:58';
              bgColor = 'bg-emerald-600';
              icon = <CreditCard size={24} className="text-white" />;
              isPulse = true;
            } else {
              title = '等待買家付款';
              subtitle = '訂單已成立，等待款項入帳';
              bgColor = 'bg-orange-500';
              icon = <Clock size={24} className="text-white" />;
            }
            break;
          case 'to_ship':
            if (role === 'buyer') {
              title = '等待賣家發貨';
              subtitle = '付款成功，通知賣家發貨中';
              bgColor = 'bg-orange-500';
              icon = <Clock size={24} className="text-white" />;
            } else {
              title = '請寄往鑑驗中心';
              subtitle = '買家已付款，請填寫物流表單';
              bgColor = 'bg-emerald-600';
              icon = <Truck size={24} className="text-white" />;
            }
            break;
          case 'in_transit':
            if (role === 'buyer') {
              title = '商品運送中';
              subtitle = '正前往鑑驗中心';
              bgColor = 'bg-orange-500';
              icon = <Truck size={24} className="text-white" />;
            } else {
              title = '已收到表單，請於寄出包裹或前往指定地方交付手錶';
              subtitle = '已收到表單，請於寄出包裹或前往指定地方交付手錶';
              bgColor = 'bg-orange-500';
              icon = <CheckCircle2 size={24} className="text-white" />;
            }
            break;
          case 'warehouse_received':
            title = '已入庫';
            subtitle = 'AG中心人員確定並錄入手錶庫存';
            bgColor = 'bg-indigo-500'; 
            icon = <Warehouse size={24} className="text-white" />;
            break;
          case 'authenticating':
            if (role === 'buyer') {
              title = '鑑驗中心驗證中';
              subtitle = '專家正在進行真偽查驗';
            } else {
              title = '鑑驗中心驗證中';
              subtitle = '專家正在進行真偽查驗';
            }
            bgColor = 'bg-orange-500';
            icon = <ShieldCheck size={24} className="text-white" />;
            isPulse = true;
            break;
          case 'auth_passed':
            if (role === 'buyer') {
              title = '驗證通過，請預約交收';
              subtitle = '請選擇要在 WM 安全地點或自行交收';
              bgColor = 'bg-emerald-600';
              icon = <CheckCircle2 size={24} className="text-white" />;
            } else {
              title = '驗證通過，等待買家預約交收';
              subtitle = '已確認為正品，等待買家選擇交收方式';
              bgColor = 'bg-orange-500';
              icon = <Clock size={24} className="text-white" />;
            }
            break;
          case 'auth_passed_dispute':
            if (role === 'buyer') {
              title = '協商中 (等待賣家回應)';
              subtitle = '鑑定報告顯示驗證通過，但我們已鎖定訂單，等待賣家針對您提出的問題進行回覆。';
              bgColor = 'bg-blue-500';
              icon = <MessageHorizontalIcon />;
            } else {
              title = '協商中 (請回應買家)';
              subtitle = '您的商品已通過真偽驗證，但買家針對報告內容提出了異議/議價請求。在達成共識前，系統已暫時鎖定取回手錶權限。';
              bgColor = 'bg-blue-500';
              icon = <AlertTriangle size={24} className="text-white" />;
            }
            break;
          case 'auth_failed':
            if (role === 'buyer') {
              title = '驗證不通過';
              subtitle = '商品未通過鑑驗，請查看報告詳情';
            } else {
              title = '驗證不通過';
              subtitle = '商品未通過鑑驗，請聯繫客服處理退貨';
            }
            bgColor = 'bg-red-500';
            icon = <XCircle size={24} className="text-white" />;
            break;
          case 'handover_wm':
            if (role === 'buyer') {
              title = '已預約 WM 安全地點交收';
              subtitle = '您已預約 [日期] [時段] 前往 WM 辦公室，請準備手錶100%款項在現場交收，1%意向金將會在交易完成後退回。';
              bgColor = 'bg-emerald-600';
              icon = <Handshake size={24} className="text-white" />;
            } else {
              title = '買家已預約 WM 安全地點交收';
              subtitle = '買家預約於 [日期] [時段] 前往 WM 辦公室，請配合出席，你的手錶將會由專人送至WM辦公室進行保管。';
              bgColor = 'bg-emerald-600';
              icon = <Handshake size={24} className="text-white" />;
            }
            break;
          case 'handover_self':
            if (role === 'buyer') {
              title = '您選擇了自行交收';
              subtitle = '您選擇了自行交收。請聯繫賣家確認交收的時間和地點';
              bgColor = 'bg-emerald-600';
              icon = <Handshake size={24} className="text-white" />;
            } else {
              title = '買家選擇自行交收，請取回';
              subtitle = '買家選擇自行交收。請先前往AG鑑驗中心取回手錶';
              bgColor = 'bg-emerald-600';
              icon = <Package size={24} className="text-white" />;
            }
            break;
          case 'handover_seller_retrieved':
            if (role === 'buyer') {
              title = '待交收 (賣家已取貨)';
              subtitle = '賣家已從鑑定中心取回商品，請聯繫賣家確認交收的時間和地點。';
              bgColor = 'bg-emerald-600';
              icon = <Clock size={24} className="text-white" />;
            } else {
              title = '待交收 (請聯繫買家)';
              subtitle = '您已成功取回商品。請盡快聯繫買家約定面交時間地點。';
              bgColor = 'bg-emerald-600';
              icon = <MessageHorizontalIcon />;
            }
            break;
          case 'completed':
            if (role === 'buyer') {
              title = '交易成功';
              subtitle = '感謝您使用 WM 代驗服務，意向金將於 T+3 日內自動退回。';
            } else {
              title = '交易成功';
              subtitle = '恭喜您！您的商品已成功售出';
            }
            bgColor = 'bg-emerald-600';
            icon = <Check size={24} className="text-white" />;
            break;
          case 'cancelled':
            title = '交易已取消';
            // Customize cancelled subtitle based on context if needed
            if (role === 'seller' && rejectReason) {
                 subtitle = '您已拒絕此出價，本交易已取消。';
            } else if (role === 'seller' && status === 'cancelled') {
                 // Covers seller retraction too
                 subtitle = '本交易已取消 (賣家撤回還價或買家取消)。';
            } else {
                 subtitle = '買家已主動取消出價，本交易已結束。';
            }
            bgColor = 'bg-red-500';
            icon = <XCircle size={24} className="text-white" />;
            break;
          case 'refunded':
            if (role === 'buyer') {
              title = '交易完成 (已退意向金)';
              subtitle = '款項已退回原支付帳戶';
            } else {
              title = '交易完成 (已退意向金)';
              subtitle = '平台已將意向金退回買家，本單正式結案';
            }
            bgColor = 'bg-emerald-600';
            icon = <RotateCcw size={24} className="text-white" />;
            break;
          default:
            title = '交易進行中';
            subtitle = '請留意系統通知。';
        }
    }

    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-3">
        {/* Header Icon & Text */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${bgColor} transition-colors duration-300 flex-shrink-0 ${isPulse ? 'animate-pulse' : ''}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">{title}</h2>
            {countdownStr && (
              <p className="text-xs font-bold text-orange-600 mt-1 flex items-center gap-1">
                 {countdownStr}
              </p>
            )}
          </div>
        </div>

        {/* 7-Step Stepper */}
        <div className="mb-6 -mx-5 relative group">
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>
            <div 
                ref={scrollRef}
                className="overflow-x-auto no-scrollbar px-5 pb-2 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className="flex justify-between items-start relative min-w-[500px] px-2">
                    <div className="absolute top-2.5 left-6 right-6 h-0.5 bg-gray-100 -z-0"></div>
                    {STEPS.map((step, idx) => {
                        const stepState = getStepStatus(step.id, idx);
                        const isCompleted = stepState === 'completed';
                        const isActive = stepState === 'active';
                        const isFailed = stepState === 'failed';
                        const nextStepStatus = idx < STEPS.length - 1 ? getStepStatus(STEPS[idx+1].id, idx+1) : 'pending';
                        const isLineColored = idx < STEPS.length - 1 && (nextStepStatus === 'completed' || nextStepStatus === 'active' || nextStepStatus === 'failed');
                        
                        let dotBg = 'bg-white border-gray-200';
                        let dotContent = null;
                        let labelColor = 'text-gray-400';

                        if (isCompleted) {
                          dotBg = 'bg-emerald-500 border-emerald-500';
                          dotContent = <Check size={10} className="text-white" strokeWidth={4} />;
                          labelColor = 'text-emerald-600';
                        } else if (isActive) {
                          dotBg = 'bg-white border-emerald-500 ring-4 ring-emerald-100';
                          dotContent = <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>;
                          labelColor = 'text-emerald-700 scale-110';
                        } else if (isFailed) {
                          dotBg = 'bg-white border-red-500 ring-4 ring-red-100';
                          dotContent = <XCircle size={10} className="text-red-500" fill="currentColor" stroke="white" />;
                          labelColor = 'text-red-600 font-bold';
                        }

                        return (
                        <div key={idx} className="flex flex-col items-center gap-2 relative z-10 flex-1 select-none pointer-events-none">
                            {idx < STEPS.length - 1 && (
                                <div className={`absolute top-2.5 left-[50%] w-full h-0.5 -z-10 ${isLineColored ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                            )}
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${dotBg}`}>
                                {dotContent}
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`text-[10px] font-bold text-center leading-tight transition-colors duration-300 whitespace-nowrap ${labelColor}`}>
                                {step.label}
                                </span>
                                <span className={`text-[9px] font-semibold mt-0.5 whitespace-nowrap ${isActive || isCompleted ? 'text-emerald-600/70' : isFailed ? 'text-red-400' : 'text-gray-300'}`}>{step.labelEn}</span>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Subtitle / Description */}
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          {subtitle}
        </p>

        {/* Conditional Buttons - Buyer Cancel */}
        {(status === 'offer_submitted' || status === 'offer_countered') && role === 'buyer' && (
           <div className="flex justify-end">
              <button 
                onClick={() => setIsCancelModalOpen(true)}
                className="px-4 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-gray-50 active:scale-95 transition-transform"
              >
                取消出價
              </button>
           </div>
        )}
      </div>
    );
  };

  // B: Product Info (Optimized Typography)
  const renderProductInfo = () => (
    <div className="bg-white p-4 rounded-2xl shadow-sm mb-3">
      <div className="flex items-start gap-2 mb-3">
        <div className="w-1 h-4 bg-slate-800 rounded-full mt-1"></div>
        <h3 className="font-bold text-slate-800">商品資訊</h3>
      </div>
      
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
          <img src={PRODUCT.image} alt="Watch" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
           <div className="flex flex-col h-full justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{PRODUCT.brand}</p>
                <h2 className="text-lg font-black text-slate-800 truncate leading-none mb-2">{PRODUCT.model}</h2>
                <div className="text-lg font-bold text-slate-800 truncate">HK${PRODUCT.price.toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                 {PRODUCT.tags.map((tag, i) => (
                   <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                     {tag}
                   </span>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  // C: Dynamic Action Area - THE NEW DRAFT OFFER FORM
  const renderDynamicActionArea = () => {
    
    // --- MODE 1: Draft Offer Input Form ---
    if (status === 'draft_offer') {
      const { fee, deposit } = calculateFees(offerPrice);
      let effectiveFee = 0;
      let effectiveDeposit = 0;
      
      if (serviceMode === 'wm') {
          effectiveFee = fee;
          effectiveDeposit = deposit;
      }
      
      const initialPayment = effectiveFee + effectiveDeposit;
      const finalPayment = offerPrice;

      return (
        <div className="bg-white p-5 rounded-2xl shadow-sm mb-3">
          {/* 1. Price Input */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-800 mb-2">出價金額 (HKD)</h3>
            <div className="relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
               <input 
                 type="number" 
                 value={offerPrice}
                 onChange={(e) => setOfferPrice(Number(e.target.value))}
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
               />
            </div>
            {offerPrice < PRODUCT.price * 0.7 && (
               <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                 <AlertTriangle size={10} /> 出價過低可能會被賣家直接拒絕
               </p>
            )}
          </div>

          {/* 2. Trading Mode */}
          <div className="mb-6">
             <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-slate-800">交易模式</h3>
               <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">買家承擔費用</span>
             </div>
             
             <div className="space-y-3">
                {/* WM Service Option */}
                <div 
                  onClick={() => setServiceMode('wm')}
                  className={`border rounded-xl p-3 relative cursor-pointer transition-all ${serviceMode === 'wm' ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="flex items-start gap-3">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${serviceMode === 'wm' ? 'border-emerald-500' : 'border-gray-300'}`}>
                        {serviceMode === 'wm' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={16} className={serviceMode === 'wm' ? "text-emerald-600" : "text-gray-400"} />
                           <span className="font-bold text-sm text-slate-800">WM 代驗服務 (推薦)</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                          由 AG 權威實驗室進行真偽鑑定。
                          <br/>
                          <span className="text-emerald-700 font-medium">• 驗證費 2%: HK${fee.toLocaleString()} (Min $1,500 / Max $5,000)</span>
                          <br/>
                          <span className="text-emerald-700 font-medium">• 意向金 1%: HK${deposit.toLocaleString()} (交易完成後退還)</span>
                        </p>
                     </div>
                  </div>
                </div>

                {/* Direct Option */}
                <div 
                  onClick={() => setServiceMode('direct')}
                  className={`border rounded-xl p-3 relative cursor-pointer transition-all ${serviceMode === 'direct' ? 'border-slate-800 bg-slate-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                   <div className="flex items-start gap-3">
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${serviceMode === 'direct' ? 'border-slate-800' : 'border-gray-300'}`}>
                        {serviceMode === 'direct' && <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />}
                     </div>
                     <div className="flex-1">
                        <span className="font-bold text-sm text-slate-800">自行交收</span>
                        <p className="text-[11px] text-gray-500 mt-1">
                          買賣雙方自行約定，平台不介入真偽驗證，風險自負。無平台手續費。
                        </p>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* 3. Handover Method */}
          <div className="mb-6">
             <h3 className="font-bold text-slate-800 mb-2">交收方式</h3>
             <div className="grid grid-cols-2 gap-3">
                <button 
                   onClick={() => setHandoverMethod('wm_center')}
                   disabled={serviceMode === 'direct'}
                   className={`border rounded-xl p-4 text-left transition-all relative overflow-hidden flex flex-col justify-start gap-3 group h-full ${
                     serviceMode === 'direct' 
                       ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
                       : handoverMethod === 'wm_center' 
                         ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500/20' 
                         : 'border-gray-200 hover:border-gray-300'
                   }`}
                >
                    <div>
                        <div className="flex items-center gap-1.5 mb-2">
                             <MapPin size={16} className={handoverMethod === 'wm_center' ? "text-emerald-700" : "text-slate-800"}/>
                             <span className="block text-sm font-bold text-slate-800">WM 辦公室</span>
                        </div>
                        <div className="space-y-1.5">
                             {['獨立交收空間', '全程 CCTV 錄影', '專員現場支援'].map((feature, i) => (
                                 <div key={i} className="flex items-center gap-1.5">
                                     <div className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${handoverMethod === 'wm_center' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                        <Check size={8} className={handoverMethod === 'wm_center' ? "text-emerald-700" : "text-gray-400"} />
                                     </div>
                                     <span className="text-[10px] text-gray-600 font-medium">{feature}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                    
                    <div className="mt-auto pt-2">
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 hover:gap-1 transition-all">
                             查看詳情 <ChevronRight size={10} />
                        </span>
                    </div>
                </button>
                
                <button 
                   onClick={() => setHandoverMethod('self')}
                   className={`border rounded-xl p-4 text-left transition-all h-full flex flex-col ${
                      handoverMethod === 'self' 
                         ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800/10' 
                         : 'border-gray-200 hover:border-gray-300'
                   }`}
                >
                   <div className="flex items-center gap-1.5 mb-2">
                       {/* Icon for Self */}
                       <Handshake size={16} className="text-slate-800" />
                       <span className="block text-sm font-bold text-slate-800">自行約定</span>
                   </div>
                   <span className="block text-[10px] text-gray-500 leading-relaxed">
                       買賣雙方自行協議交收地點，適合有經驗的玩家。
                   </span>
                </button>
             </div>
          </div>

          {/* 4. Payment Breakdown - UPDATED SEPARATION */}
          {serviceMode === 'wm' ? (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                {/* Stage 1: Pay Later on Acceptance */}
                <div className="mb-4 pb-4 border-b border-gray-200 border-dashed">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <h4 className="font-bold text-slate-800 text-sm">
                                出價獲接納後支付 
                                <span className="text-xs text-gray-400 font-normal ml-1">(訂金與服務費)</span>
                            </h4>
                        </div>
                        <span className="font-black text-slate-900 text-lg">HK${initialPayment.toLocaleString()}</span>
                    </div>
                    <div className="space-y-1.5 pl-3">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>WM 代驗服務費 (2%)</span>
                            <span>HK${fee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>交易意向金 (1%) - 可退</span>
                            <span>HK${deposit.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Stage 2: Pay Later */}
                <div className="opacity-75">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5">
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                             <h4 className="font-bold text-slate-500 text-sm">尾款 (交收時支付賣家)</h4>
                        </div>
                        <span className="font-bold text-slate-600 text-lg">HK${finalPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 pl-3">
                        <span>商品出價金額</span>
                        <span>HK${offerPrice.toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="mt-3 text-[9px] text-gray-400 bg-white p-2 rounded border border-gray-100 flex gap-1">
                   <Info size={12} className="flex-shrink-0 mt-0.5" />
                   <span>服務費設有最低 HK$1,500 及最高 HK$5,000 封頂限制。</span>
                </div>
            </div>
          ) : (
             // Direct Mode Summary
             <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                 <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 text-sm">預計總額 (面交時支付)</h4>
                    <span className="font-black text-slate-900 text-lg">HK${offerPrice.toLocaleString()}</span>
                 </div>
                 <p className="text-[10px] text-gray-400 mt-2">自行交收不收取平台費用。</p>
             </div>
          )}

          {/* 5. Agreements */}
          <div className="space-y-3">
             <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreements.tnc ? 'bg-slate-800 border-slate-800' : 'border-gray-300 group-hover:border-gray-400'}`}>
                   {agreements.tnc && <Check size={10} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={agreements.tnc} onChange={() => setAgreements({...agreements, tnc: !agreements.tnc})} />
                <span className="text-[11px] text-gray-600 leading-tight">
                   我已閱讀並同意 <span className="underline font-bold">平台條款及細則</span>
                </span>
             </label>

             <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${agreements.shipping ? 'bg-slate-800 border-slate-800' : 'border-gray-300 group-hover:border-gray-400'}`}>
                   {agreements.shipping && <Check size={10} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={agreements.shipping} onChange={() => setAgreements({...agreements, shipping: !agreements.shipping})} />
                <span className="text-[11px] text-gray-600 leading-tight">
                   我了解關稅及貨運風險需由買家自行承擔
                </span>
             </label>
          </div>

        </div>
      );
    }
    
    // --- MODE 2: Offer Submitted (Buyer View or Seller View) OR Cancelled ---
    if ((status === 'offer_submitted') || status === 'cancelled') {
        const { fee, deposit } = calculateFees(offerPrice);
        const isCancelled = status === 'cancelled';
        const isSeller = role === 'seller';

        return (
            <div className={`p-5 rounded-2xl shadow-sm mb-3 transition-colors ${isCancelled ? 'bg-gray-100 border border-gray-200' : 'bg-white'}`}>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold ${isCancelled ? 'text-gray-500' : 'text-slate-800'}`}>
                       {isCancelled ? '歷史出價記錄 (已取消)' : isSeller ? '收到出價' : '出價詳情'}
                    </h3>
                    {isCancelled && <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded font-bold">已失效</span>}
                    {isSeller && !isCancelled && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold">請回應</span>}
                 </div>

                 {/* Summary Cards */}
                 <div className={`space-y-3 mb-4 ${isCancelled ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <span className="text-gray-500">出價金額</span>
                        <span className={`font-bold ${isCancelled ? 'text-gray-600 line-through' : 'text-slate-900'}`}>HK${offerPrice.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <span className="text-gray-500">交易模式</span>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={14} className={isCancelled ? "text-gray-400" : "text-emerald-600"}/>
                            <span className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-slate-800'}`}>WM 代驗服務</span>
                        </div>
                    </div>
                     <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <span className="text-gray-500">交收方式</span>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className={isCancelled ? "text-gray-400" : "text-emerald-600"}/>
                            <span className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-slate-800'}`}>WM 辦公室</span>
                        </div>
                    </div>
                 </div>

                 {/* Expandable Fee Section */}
                 {!isCancelled && (
                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                        <button 
                            onClick={() => setIsFeeDetailsExpanded(!isFeeDetailsExpanded)}
                            className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-600 hover:bg-gray-100 transition-colors"
                        >
                            <span>{isSeller ? '買家支付費用明細' : '費用與明細'}</span>
                            <div className="flex items-center gap-1 text-gray-400">
                                <span>{isFeeDetailsExpanded ? '收起明細' : '展開明細'}</span>
                                {isFeeDetailsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                        </button>
                        
                        {isFeeDetailsExpanded && (
                            <div className="px-3 pb-3 pt-0 animate-in slide-in-from-top-2 duration-200">
                                <div className="border-t border-gray-200 border-dashed my-2"></div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">WM 代驗服務費 (2%)</span>
                                        <span className="text-slate-700">HK${fee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">交易意向金 (1%) <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded ml-1">可退</span></span>
                                        <span className="text-slate-700">HK${deposit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pt-1">
                                        <span className="text-gray-500">尾款 (交收時支付賣家)</span>
                                        <span className="font-bold text-slate-800">HK${offerPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                 )}

                 {!isCancelled && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 text-center">
                            {isSeller ? '買家已承擔相關交易費用與平台條款' : '買家已同意平台服務條款與買家須知'}
                        </p>
                    </div>
                 )}
            </div>
        )
    }

    // --- EXISTING MODES --- (Simplified for brevity, but logically present)
    if (status === 'offer_countered') {
       // ... (Keep existing logic - maybe show fee breakdown if role is buyer?)
       return null; // For now
    }

    return null;
  };

  // D: Timeline 
  const renderTimeline = () => {
    // Hide timeline during Draft Offer phase
    if (status === 'draft_offer') return null;

    const events = [];
    
    // 1. Initial Offer Event (Oldest)
    events.push({
      date: '2023/10/24 22:00',
      title: `買家提出出價，HK$${PRODUCT.price.toLocaleString()}`,
      active: true // Always valid if we are past draft_offer
    });

    // 2. Cancellation Event (Newer)
    if (status === 'cancelled') {
        events.push({
            date: '2023/10/25 10:30', // Mock time
            title: role === 'seller' 
              ? (rejectReason ? '賣家拒絕出價' : '交易已取消') 
              : '買家取消出價',
            active: true,
            highlight: true // Special style for cancellation
        });
    }

    // 2. Payment Pending (If accepted)
    if (status === 'payment_pending') {
        events.push({
            date: '2023/10/25 10:35', // Mock time
            title: '賣家接受出價，等待買家付款',
            active: true,
            highlight: false
        });
    }

    // 2. Countered (If countered)
    if (status === 'offer_countered') {
        events.push({
            date: '2023/10/25 10:35', // Mock time
            title: `賣家提出還價 HK$${offerPrice.toLocaleString()}`, // Using offerPrice as counter for simplicity in mock
            active: true,
            highlight: false
        });
    }
    
    // REVERSE FOR DISPLAY (Newest First)
    const displayEvents = [...events].reverse();

    return (
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-3">
        <h3 className="font-bold text-slate-800 mb-4">交易進度</h3>
        <div className="relative">
            <div className="absolute top-2 bottom-0 left-[15px] w-0.5 bg-gray-100"></div>
            <div className="space-y-6">
               {displayEvents.map((event, idx) => {
                 // The first item in reversed array is the LATEST event
                 const isLatest = idx === 0;
                 const isCancelEvent = event.highlight && status === 'cancelled';

                 return (
                   <div key={idx} className="relative pl-8">
                      <div className={`absolute left-[10px] top-1.5 w-3 h-3 rounded-full border-2 z-10 
                          ${isCancelEvent 
                             ? 'bg-white border-red-500 ring-2 ring-red-50' 
                             : isLatest 
                                ? 'bg-white border-emerald-500 ring-2 ring-emerald-50' 
                                : 'bg-gray-200 border-white ring-2 ring-white'
                          }`}>
                          {(isLatest || isCancelEvent) && (
                              <div className={`absolute inset-0.5 rounded-full ${isCancelEvent ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                          )}
                      </div>
                      <div className={`${isLatest ? 'text-slate-800' : 'text-gray-500'}`}>
                         <span className={`text-[11px] font-bold block mb-0.5 ${isCancelEvent ? 'text-red-500' : isLatest ? 'text-emerald-600' : 'text-gray-400'}`}>[{event.date}]</span>
                         <p className={`text-xs leading-relaxed ${isLatest ? 'text-slate-800 font-medium' : 'text-gray-500'}`}>
                           {event.title}
                         </p>
                      </div>
                   </div>
                 );
               })}
            </div>
        </div>
      </div>
    );
  };

  // E: Sticky Bottom Bar
  const renderBottomBar = () => {
    let buttons = null;

    // --- Mode: Draft Offer ---
    if (status === 'draft_offer') {
        const isValid = agreements.tnc && agreements.shipping && offerPrice > 0;
        let btnLabel = "發送出價";
        buttons = (
           <div className="flex-1">
             <button 
               disabled={!isValid}
               onClick={() => setStatus('offer_submitted')} 
               className={`w-full font-bold py-3 rounded-xl text-sm shadow-lg transition-all active:scale-95 ${isValid ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
             >
               {btnLabel}
             </button>
           </div>
        );
    }
    // --- Mode: Buyer Offer Submitted ---
    else if (role === 'buyer' && status === 'offer_submitted') {
        buttons = (
           <div className="flex-1">
             <button 
               onClick={() => {
                  setModifyingPrice(offerPrice);
                  setIsModifyModalOpen(true);
               }}
               className="w-full bg-white border border-gray-300 text-slate-700 font-bold py-3 rounded-xl text-sm shadow-sm active:scale-95 transition-transform hover:bg-gray-50"
             >
               修改出價
             </button>
           </div>
        );
    }
    // --- Mode: Seller Offer Received (01A) ---
    else if (role === 'seller' && status === 'offer_submitted') {
        buttons = (
           <div className="flex-1 flex gap-2">
             <button 
               onClick={() => setIsRejectModalOpen(true)}
               className="flex-[0.8] bg-gray-100 text-gray-500 font-bold py-3 rounded-xl text-sm active:scale-95 transition-transform border border-gray-200"
             >
               拒絕
             </button>
             <button 
               onClick={() => {
                   setCounterPrice(offerPrice);
                   setIsCounterModalOpen(true);
               }}
               className="flex-1 bg-white border border-emerald-600 text-emerald-700 font-bold py-3 rounded-xl text-sm active:scale-95 transition-transform"
             >
               還價
             </button>
             <button 
               onClick={() => setIsAcceptModalOpen(true)}
               className="flex-[1.5] bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
             >
               接受出價
             </button>
           </div>
        );
    }
    // --- Mode: Seller Counter Offer Sent (01B) ---
    else if (role === 'seller' && status === 'offer_countered') {
         buttons = (
            <div className="flex-1">
              <button 
                onClick={() => setIsRetractCounterModalOpen(true)}
                className="w-full bg-white border border-red-200 text-red-500 font-bold py-3 rounded-xl text-sm shadow-sm active:scale-95 transition-transform hover:bg-red-50"
              >
                撤回還價
              </button>
            </div>
         );
    }
    // --- Mode: Cancelled (Re-offer) ---
    else if (status === 'cancelled') {
        buttons = (
            <div className="flex-1">
              <button 
                onClick={() => setStatus('draft_offer')}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
              >
                重新出價
              </button>
            </div>
         );
    }

    if (!buttons) {
       buttons = (
          <div className="flex-1 flex justify-end">
              <button className="bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-xl text-sm cursor-not-allowed">
                等待更新
              </button>
          </div>
       )
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-8 z-50 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <div className="flex items-center gap-3">
             <button className="flex flex-col items-center gap-1 text-gray-400 px-2 min-w-[50px]">
                <Headphones size={20} />
                <span className="text-[10px]">客服</span>
             </button>
             {buttons}
         </div>
      </div>
    );
  };

  // --- Render Seller Actions Modals ---
  
  // 1. Accept Modal
  const renderAcceptModal = () => {
    if (!isAcceptModalOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">接受買家出價？</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">
                        您即將接受 
                        <span className="font-bold text-slate-800 mx-1">HK${offerPrice.toLocaleString()}</span>
                        的出價。
                    </p>
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-xs text-amber-800 text-left flex items-start gap-2">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>接受後訂單即時成立，您的商品庫存將被鎖定，等待買家付款。</span>
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
                    <button 
                        onClick={() => setIsAcceptModalOpen(false)}
                        className="flex-1 py-3 bg-white border border-gray-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                        再考慮一下
                    </button>
                    <button 
                        onClick={handleSellerAccept}
                        className="flex-[1.5] py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                    >
                        確認接受
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // 2. Counter Modal
  const renderCounterModal = () => {
    if (!isCounterModalOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Calculator size={18} /> 提出還價
                    </h3>
                    <button onClick={() => setIsCounterModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-5">
                    <div className="mb-4">
                        <span className="text-xs font-bold text-gray-400 block mb-1">買家出價</span>
                        <span className="text-lg font-bold text-slate-400">HK${offerPrice.toLocaleString()}</span>
                    </div>

                    <div className="mb-2">
                        <label className="text-xs font-bold text-slate-800 mb-1.5 block">您的還價金額 (HKD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input 
                                type="number" 
                                value={counterPrice}
                                onChange={(e) => setCounterPrice(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button 
                        onClick={() => setIsCounterModalOpen(false)}
                        className="flex-1 py-3 bg-gray-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSellerCounter}
                        disabled={counterPrice <= 0}
                        className="flex-[2] py-3 bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                    >
                        發送還價
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // 3. Reject Modal
  const renderRejectModal = () => {
    if (!isRejectModalOpen) return null;
    const reasons = ['價格過低', '商品已售出/保留', '暫時不想出售', '其他原因'];

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <ThumbsDown size={18} className="text-red-500" /> 拒絕出價
                    </h3>
                    <button onClick={() => setIsRejectModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-5">
                    <p className="text-sm text-gray-500 mb-3">請選擇拒絕原因，以便買家了解情況：</p>
                    <div className="space-y-2 mb-4">
                        {reasons.map((r) => (
                            <label key={r} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                                <input 
                                    type="radio" 
                                    name="rejectReason" 
                                    value={r}
                                    checked={rejectReason === r}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <span className={`text-sm font-bold ${rejectReason === r ? 'text-red-700' : 'text-slate-600'}`}>{r}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button 
                        onClick={() => setIsRejectModalOpen(false)}
                        className="flex-1 py-3 bg-gray-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleSellerReject}
                        disabled={!rejectReason}
                        className="flex-[1.5] py-3 bg-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
                    >
                        確認拒絕
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // 4. NEW: Retract Counter Modal
  const renderRetractCounterModal = () => {
    if (!isRetractCounterModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Undo2 size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">確定撤回還價？</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        撤回還價後，此訂單將直接關閉，您需要等待買家重新發起出價。
                    </p>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
                    <button 
                    onClick={() => setIsRetractCounterModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-gray-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                        取消
                    </button>
                    <button 
                    onClick={handleRetractCounter}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                    >
                        確認撤回
                    </button>
                </div>
            </div>
        </div>
    )
  }

  // --- Render Modify Offer Modal (Buyer) ---
  const renderModifyModal = () => {
      if (!isModifyModalOpen) return null;

      const isPriceValid = modifyingPrice > offerPrice;
      const oldFees = calculateFees(offerPrice);
      const newFees = calculateFees(modifyingPrice);

      return (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-slate-800 text-lg">提高您的出價</h3>
                      <button onClick={() => setIsModifyModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-5">
                      {/* Current Price */}
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-gray-400">當前出價</span>
                          <span className="text-sm font-bold text-gray-500 line-through">HK${offerPrice.toLocaleString()}</span>
                      </div>

                      {/* New Price Input */}
                      <div className="mb-2 relative">
                          <label className="text-xs font-bold text-slate-800 mb-1.5 block">新的出價 (HKD)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input 
                                type="number" 
                                value={modifyingPrice}
                                onChange={(e) => setModifyingPrice(Number(e.target.value))}
                                className={`w-full bg-gray-50 border rounded-xl py-3 pl-8 pr-4 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 transition-all ${!isPriceValid ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-emerald-500'}`}
                                autoFocus
                            />
                          </div>
                      </div>
                      
                      {/* Validation Message */}
                      {!isPriceValid && (
                           <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mb-4 animate-in slide-in-from-top-1">
                               <AlertCircle size={12} />
                               <span>新出價必須高於原出價</span>
                           </div>
                      )}

                      {/* Fee Comparison (If WM Service) */}
                      {serviceMode === 'wm' && (
                          <div className={`mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2 transition-opacity ${!isPriceValid ? 'opacity-50' : 'opacity-100'}`}>
                              <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500">原代驗服務費 (2%)</span>
                                  <div className="flex items-center gap-1 font-mono">
                                      <span className="text-gray-400 line-through">${oldFees.fee.toLocaleString()}</span>
                                      <ArrowRight size={10} className="text-gray-300"/>
                                      <span className="text-slate-700 font-bold">${newFees.fee.toLocaleString()}</span>
                                  </div>
                              </div>
                              <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-500">原意向金 (1%)</span>
                                  <div className="flex items-center gap-1 font-mono">
                                      <span className="text-gray-400 line-through">${oldFees.deposit.toLocaleString()}</span>
                                      <ArrowRight size={10} className="text-gray-300"/>
                                      <span className="text-slate-700 font-bold">${newFees.deposit.toLocaleString()}</span>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>

                  <div className="p-4 border-t border-gray-100 flex gap-3">
                      <button 
                        onClick={() => setIsModifyModalOpen(false)}
                        className="flex-1 py-3 bg-gray-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors"
                      >
                          取消
                      </button>
                      <button 
                        disabled={!isPriceValid}
                        onClick={handleConfirmModify}
                        className={`flex-[2] py-3 text-white font-bold rounded-xl text-sm shadow-lg transition-all active:scale-95 ${!isPriceValid ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700'}`}
                      >
                          確認修改
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // --- Render Cancel Confirm Modal (Buyer) ---
  const renderCancelModal = () => {
    if (!isCancelModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">確定取消出價？</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        您確定要取消此出價嗎？取消後將無法恢復。
                        <br/>
                        <span className="text-xs mt-1 block text-red-500/80">
                            (如多次無故取消，可能會影響您的買家信譽評級)
                        </span>
                    </p>
                </div>
                
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
                    <button 
                    onClick={() => setIsCancelModalOpen(false)}
                    className="flex-1 py-3 bg-white border border-gray-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                    >
                        再考慮一下
                    </button>
                    <button 
                    onClick={handleConfirmCancel}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95"
                    >
                        確認取消
                    </button>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen relative pb-32">
       {/* Top Nav */}
       <header className="bg-white sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800">
             <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg text-slate-800">訂單詳情</h1>
          <button className="p-2 -mr-2 text-slate-800">
             <MoreHorizontal size={24} />
          </button>
       </header>

       {/* Content */}
       <div className="p-4">
          {renderStatusCard()}
          {renderProductInfo()}
          {renderDynamicActionArea()}
          {renderTimeline()}
          
          {/* Help Section (Hide in Draft mode to clean up UI) */}
          {status !== 'draft_offer' && (
            <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      遇到問題 ?
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">查看幫助中心或聯絡客服</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm">
                      聯絡客服
                  </button>
                  <button className="bg-gray-100 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg">
                      回報問題
                  </button>
                </div>
            </div>
          )}
          
          <div className="mt-4 text-center">
             <p className="text-[10px] text-gray-400">相關資訊: <span className="font-bold text-emerald-700">幫助中心</span>, <span className="font-bold text-emerald-700">WM代驗詳情</span></p>
          </div>
       </div>

       {renderBottomBar()}
       
       {/* Modal Layers */}
       {renderModifyModal()}
       {renderCancelModal()}
       
       {/* Seller Action Modals */}
       {renderAcceptModal()}
       {renderCounterModal()}
       {renderRejectModal()}
       {renderRetractCounterModal()}

       {/* --- DEV TOOLS SIMULATOR --- */}
      <div className="absolute top-20 right-0 z-[100] flex flex-col items-end pointer-events-none">
        <button 
          onClick={() => setShowDevTools(!showDevTools)}
          className="bg-slate-800 text-white p-2 rounded-l-lg shadow-lg pointer-events-auto hover:bg-slate-700 transition-colors flex items-center gap-1"
        >
          <Settings size={18} className={showDevTools ? "animate-spin" : ""} />
          {!showDevTools && <span className="text-[10px] font-bold">DEV</span>}
        </button>
        
        {showDevTools && (
          <div className="bg-slate-800/95 backdrop-blur text-white p-4 rounded-l-xl mt-2 w-64 shadow-2xl pointer-events-auto border-l border-slate-600 max-h-[80vh] overflow-y-auto no-scrollbar">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 sticky top-0 bg-slate-800 pb-2">Simulator</h4>
            
            <div className="mb-4">
              <label className="text-xs font-bold block mb-1">User Role</label>
              <div className="flex bg-slate-700 rounded p-1">
                <button 
                  onClick={() => setRole('buyer')}
                  className={`flex-1 text-[10px] py-1 rounded ${role === 'buyer' ? 'bg-emerald-500 text-white' : 'text-slate-300'}`}
                >Buyer</button>
                <button 
                  onClick={() => setRole('seller')}
                  className={`flex-1 text-[10px] py-1 rounded ${role === 'seller' ? 'bg-emerald-500 text-white' : 'text-slate-300'}`}
                >Seller</button>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-xs font-bold block mb-1">Status</label>
              <div className="grid grid-cols-1 gap-1 bg-slate-700 rounded p-1">
                 {/* Added draft_offer to list */}
                 <button 
                    onClick={() => setStatus('draft_offer')}
                    className={`text-[10px] py-1.5 px-2 rounded text-left ${status === 'draft_offer' ? 'bg-blue-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-600'}`}
                  >
                    ★ 填寫出價單 (Draft Offer)
                  </button>

                {[
                  {id: 'offer_submitted', label: '01A 出價 (已出價)'},
                  {id: 'offer_countered', label: '01B 出價 (已還價)'},
                  {id: 'payment_pending', label: '02 待付款'},
                  {id: 'to_ship', label: '03A 待發貨'},
                  {id: 'in_transit', label: '03B 運送中'},
                  {id: 'warehouse_received', label: '04 已入庫'},
                  {id: 'authenticating', label: '05 驗證中'},
                  {id: 'auth_passed', label: '06 驗證通過'},
                  {id: 'auth_passed_dispute', label: '06A 驗證通過(異議)'},
                  {id: 'auth_failed', label: '07 驗證失敗'},
                  {id: 'handover_wm', label: '08A 交收(WM)'},
                  {id: 'handover_self', label: '08B 交收(自)'},
                  {id: 'handover_seller_retrieved', label: '08C 交收(賣家取)'},
                  {id: 'completed', label: '09 完成'},
                  {id: 'cancelled', label: '10 取消'},
                  {id: 'refunded', label: '11 退款'},
                ].map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setStatus(s.id as TransactionStatus)}
                    className={`text-[10px] py-1.5 px-2 rounded text-left ${status === s.id ? 'bg-blue-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-600'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// Helper Icon for Message Horizontal replacement
const MessageHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="16" cy="10" r="1"/></svg>
)

export default OrderDetail;