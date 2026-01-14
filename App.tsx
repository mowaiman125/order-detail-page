import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProductDetail from './pages/ProductDetail';
import OrderDetail from './pages/OrderDetail';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      {/* Use HashRouter for better compatibility in preview environments */}
      <HashRouter>
        <Routes>
          {/* Default to ProductDetail per user preference */}
          <Route path="/" element={<ProductDetail />} />
          
          <Route path="/list" element={<Home />} />
          
          {/* New Order Detail Route */}
          <Route path="/order" element={<OrderDetail />} />
          
          {/* Redirect unknown routes to the product detail */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;