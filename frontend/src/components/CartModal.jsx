import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const CartModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Autofill if user is logged in
  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName || '');
      setCustomerEmail(user.email || '');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cartItems.length === 0) {
      setErrorMsg('Giỏ hàng trống!');
      return;
    }

    if (!customerName || !customerPhone || !customerAddress) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await orderAPI.create(orderData);
      clearCart();
      alert('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.');
      setIsSubmitting(false);
      onOrderSuccess(); // Call refresh store/orders
      onClose(); // Close cart modal
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.');
      setIsSubmitting(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(cartTotal);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Sliding Drawer Container */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        height: '100%',
        borderRadius: '0px',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🛒 Giỏ hàng của bạn</h2>
          <button 
            onClick={onClose} 
            className="btn btn-secondary" 
            style={{ padding: '0.4rem 0.8rem', minWidth: '40px', borderRadius: '50%' }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '200px', 
              color: 'var(--text-secondary)' 
            }}>
              <span style={{ fontSize: '3rem' }}>🛒</span>
              <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Chưa có sản phẩm nào trong giỏ hàng.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '0.8rem 0', 
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {(item.price).toLocaleString('vi-VN')} đ
                  </p>
                  
                  {/* Quantity Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-secondary"
                      style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem', minWidth: '22px' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-secondary"
                      disabled={item.quantity >= item.stock}
                      style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem', minWidth: '22px', opacity: item.quantity >= item.stock ? 0.4 : 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}
                  title="Xóa khỏi giỏ hàng"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Information Form */}
        {cartItems.length > 0 && (
          <form onSubmit={handleCheckout} style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>📋 Thông tin nhận hàng</h3>
            
            {errorMsg && (
              <div style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid var(--error)', 
                color: 'var(--error)', 
                padding: '0.75rem', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.85rem', 
                marginBottom: '1rem' 
              }}>
                {errorMsg}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Họ và tên *</label>
              <input 
                type="text" 
                className="form-input" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại *</label>
              <input 
                type="tel" 
                className="form-input" 
                value={customerPhone} 
                onChange={(e) => setCustomerPhone(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Tùy chọn)</label>
              <input 
                type="email" 
                className="form-input" 
                value={customerEmail} 
                onChange={(e) => setCustomerEmail(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ giao hàng *</label>
              <textarea 
                className="form-input" 
                rows="2"
                value={customerAddress} 
                onChange={(e) => setCustomerAddress(e.target.value)} 
                required
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            {/* Total & Order Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '1.5rem', 
              marginBottom: '1.5rem',
              backgroundColor: 'rgba(255,255,255,0.02)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{formattedTotal}</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
            >
              {isSubmitting ? 'Đang đặt hàng...' : '🛒 Xác nhận Đặt hàng'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CartModal;
