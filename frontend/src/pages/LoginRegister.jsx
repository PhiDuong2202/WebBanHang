import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useContext(AuthContext);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      const res = await login(username, password);
      setLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    } else {
      if (!username || !password || !fullName || !email) {
        setError('Vui lòng điền đầy đủ các thông tin.');
        setLoading(false);
        return;
      }
      const res = await register(username, password, fullName, email);
      setLoading(false);
      if (res.success) {
        setSuccess('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        // Clear registration fields
        setFullName('');
        setEmail('');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 40px)',
      padding: '2rem 1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glowing circles */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.12)',
        filter: 'blur(80px)',
        top: '20%',
        left: '25%',
        zIndex: 0
      }}></div>
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(168, 85, 247, 0.12)',
        filter: 'blur(80px)',
        bottom: '20%',
        right: '25%',
        zIndex: 0
      }}></div>

      <div className="glass-panel fade-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: 'bold',
            marginBottom: '0.8rem',
            boxShadow: '0 8px 20px var(--primary-glow)'
          }}>S</div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isLogin ? 'Chào mừng quay trở lại với GlowStore' : 'Tham gia mua sắm hàng công nghệ cao cấp'}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ Email</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="username@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
          >
            {loading ? 'Vui lòng đợi...' : isLogin ? 'Đăng nhập' : 'Đăng ký ngay'}
          </button>
        </form>

        {/* Form Toggle */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {isLogin ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
