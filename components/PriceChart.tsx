import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PRICE_HISTORY } from '../constants';

const PriceChart: React.FC = () => {
  return (
    <div className="w-full mt-4 flex flex-col">
      <div className="text-xs text-gray-500 mb-2">
        从2021年5月以来: <span className="text-red-500">- HKD 23,850 -75%</span>
      </div>
      <div className="text-[10px] text-gray-400 mb-3">(单位为千HKD)</div>
      
      {/* Chart Container - Fixed height for the chart area only */}
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={PRICE_HISTORY}
            margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{fontSize: 10, fill: '#9ca3af'}} 
              axisLine={false}
              tickLine={false}
              interval={2}
            />
            <YAxis 
              tick={{fontSize: 10, fill: '#9ca3af'}} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
               contentStyle={{borderRadius: '8px', fontSize: '12px'}}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Time Filters - Layout fixed to prevent overlap */}
      <div className="flex justify-between mt-4 px-1 gap-1 overflow-x-auto no-scrollbar">
          {['最高', '3年', '1年', '6个月', '3个月', '1个月'].map((label, i) => (
              <button 
                key={i}
                className={`text-[10px] px-2.5 py-1 rounded-full border flex-shrink-0 transition-colors ${i === 1 ? 'border-emerald-600 text-emerald-700 bg-emerald-50 font-bold' : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'}`}
              >
                  {label}
              </button>
          ))}
      </div>
    </div>
  );
};

export default PriceChart;