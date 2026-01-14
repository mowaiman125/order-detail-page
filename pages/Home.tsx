import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Filter, Heart } from 'lucide-react';
import { RECOMMENDED_PRODUCTS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      {/* Home Header */}
      <div className="bg-white p-5 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black text-slate-800 tracking-tight">WATCH MATCH</h1>
          <div className="flex gap-3 text-slate-800">
            <Bell size={20} />
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="搜索品牌、型號..." 
            className="w-full bg-gray-100 text-sm py-2.5 pl-9 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto p-4 no-scrollbar">
        {['全部', 'Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Omega'].map((brand, i) => (
          <button 
            key={i}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${i === 0 ? 'bg-slate-800 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-slate-800">最新上架</h2>
          <button className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            篩選 <Filter size={12} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Main Demo Product */}
          <div 
            onClick={() => navigate('/product/1')}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer active:scale-95 transition-transform"
          >
             <div className="relative h-40 bg-gray-100">
               <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">WM認證</span>
               <img src="https://picsum.photos/300/300?random=100" className="w-full h-full object-cover" alt="Cartier" />
               <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                 <Heart size={14} className="text-gray-400" />
               </div>
             </div>
             <div className="p-3">
               <h3 className="text-xs font-bold text-slate-800 truncate">Cartier 坦克系列</h3>
               <p className="text-[10px] text-gray-500 mb-1">212.128.1110.333</p>
               <div className="flex items-baseline gap-1">
                   <span className="text-xs text-gray-400">MOP</span>
                   <p className="text-sm font-bold text-slate-900">490,000</p>
               </div>
             </div>
          </div>

          {/* Other Products from Constants */}
          {RECOMMENDED_PRODUCTS.map((prod) => (
            <div key={prod.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
                <div className="relative h-40 bg-gray-100">
                  <img src={prod.img} className="w-full h-full object-cover" alt={prod.name} />
                  <div className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full">
                    <Heart size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs text-gray-400">MOP</span>
                      <p className="text-sm font-bold text-slate-900">{prod.price.replace('MOP ', '')}</p>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-3 pb-6 max-w-md mx-auto z-50">
          <div className="flex flex-col items-center gap-1 text-emerald-600">
             <div className="w-6 h-6 flex items-center justify-center">🏠</div>
             <span className="text-[10px] font-bold">首頁</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
             <div className="w-6 h-6 flex items-center justify-center">🔍</div>
             <span className="text-[10px] font-medium">發現</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
             <div className="w-6 h-6 flex items-center justify-center">➕</div>
             <span className="text-[10px] font-medium">發佈</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
             <div className="w-6 h-6 flex items-center justify-center">💬</div>
             <span className="text-[10px] font-medium">消息</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
             <div className="w-6 h-6 flex items-center justify-center">👤</div>
             <span className="text-[10px] font-medium">我的</span>
          </div>
      </div>
    </div>
  );
};

export default Home;