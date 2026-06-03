import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = ({ onOpenCart, activeTab, setActiveTab }) => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);

  return (
    <nav className="glass-panel" style={{
      margin: '1rem auto 2rem auto',
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: '1rem',
      zIndex: 100,
      width: '100%',
      maxWidth: '1200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff',
          fontSize: '1.2rem',
          boxShadow: '0 0 15px var(--primary-glow)'
        }}>S</div>
        <span style={{
          fontWeight: 800,
          fontSize: '1.4rem',
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #fff, var(--text-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>GlowStore</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <button 
              onClick={() => setActiveTab('store')} 
              className="btn" 
              style={{
                background: 'transparent',
                color: activeTab === 'store' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'store' ? '700' : '500',
                padding: '0.5rem 1rem'
              }}
            >
              Cửa hàng
            </button>

            {user.role === 'Admin' ? (
              <button 
                onClick={() => setActiveTab('admin')} 
                className="btn" 
                style={{
                  background: 'transparent',
                  color: activeTab === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'admin' ? '700' : '500',
                  padding: '0.5rem 1rem'
                }}
              >
                Quản lý
              </button>
            ) : (
              <button 
                onClick={() => setActiveTab('orders')} 
                className="btn" 
                style={{
                  background: 'transparent',
                  color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'orders' ? '700' : '500',
                  padding: '0.5rem 1rem'
                }}
              >
                Đơn hàng
              </button>
            )}

            {/* Cart Button */}
            {user.role !== 'Admin' && (
              <button 
                onClick={onOpenCart} 
                className="btn btn-secondary" 
                style={{
                  position: 'relative',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                🛒 Giỏ hàng
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Greeting & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.fullName}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}</span>
              </div>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Đăng xuất
              </button>
            </div>
          </>
        ) : (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Chào mừng bạn đến với GlowStore</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
