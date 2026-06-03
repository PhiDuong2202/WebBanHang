import React, { useState, useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartModal from './components/CartModal';
import LoginRegister from './pages/LoginRegister';
import Store from './pages/Store';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

const MainApp = () => {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Set default tab to 'admin' if the user is Admin
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('store');
      }
    }
  }, [user]);

  const handleOrderSuccess = () => {
    setTriggerRefresh(prev => prev + 1);
    setActiveTab('orders');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        Đang khởi động hệ thống cửa hàng...
      </div>
    );
  }

  if (!user) {
    return <LoginRegister />;
  }

  // Adjust active tab for safety
  const currentTab = (user.role === 'Admin' && activeTab === 'orders') ? 'admin' : activeTab;

  return (
    <div>
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        activeTab={currentTab} 
        setActiveTab={setActiveTab} 
      />

      <main style={{ minHeight: 'calc(100vh - 160px)', padding: '0 1rem' }}>
        {currentTab === 'store' && (
          <Store activeTab="store" triggerRefresh={triggerRefresh} />
        )}
        {currentTab === 'orders' && user.role !== 'Admin' && (
          <Store activeTab="orders" triggerRefresh={triggerRefresh} />
        )}
        {currentTab === 'admin' && user.role === 'Admin' && (
          <AdminDashboard />
        )}
      </main>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onOrderSuccess={handleOrderSuccess} 
      />

      <footer style={{
        textAlign: 'center',
        padding: '2.5rem 1rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        borderTop: '1px solid var(--border)',
        marginTop: '4rem',
        letterSpacing: '0.5px'
      }}>
        © 2026 GlowStore. Dự án mẫu Bán hàng Premium - ReactJS & ASP.NET Core & MySQL.
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
