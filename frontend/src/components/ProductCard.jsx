import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.price);

  return (
    <div className="glass-panel fade-in" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'var(--transition-smooth)',
      position: 'relative'
    }}>
      {/* Category Badge */}
      <span className="badge" style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 10,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        color: '#a5b4fc',
        textTransform: 'none',
        padding: '0.2rem 0.5rem',
        borderRadius: 'var(--radius-sm)'
      }}>
        {product.category}
      </span>

      {/* Product Image Container */}
      <div style={{
        width: '100%',
        height: '200px',
        overflow: 'hidden',
        backgroundColor: '#0a0f1d',
        position: 'relative'
      }}>
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'} 
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>

      {/* Content */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: '0.5rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          lineHeight: 1.3,
          height: '2.6rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          color: 'var(--text-primary)'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          height: '2.5rem',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '0.5rem'
        }}>
          {product.description}
        </p>

        {/* Price & Stock */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginTop: 'auto'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {formattedPrice}
          </span>

          <span style={{
            fontSize: '0.75rem',
            color: product.stock > 0 ? 'var(--text-muted)' : 'var(--error)',
            fontWeight: 500
          }}>
            {product.stock > 0 ? `Còn: ${product.stock}` : 'Hết hàng'}
          </span>
        </div>

        {/* Actions */}
        <button 
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
          className="btn btn-primary"
          style={{
            width: '100%',
            marginTop: '0.75rem',
            padding: '0.6rem',
            fontSize: '0.9rem',
            opacity: product.stock <= 0 ? 0.5 : 1,
            cursor: product.stock <= 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {product.stock > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
