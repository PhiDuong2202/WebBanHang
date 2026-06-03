import React, { useState, useEffect, useContext } from 'react';
import { productAPI, orderAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';

const Store = ({ activeTab, triggerRefresh }) => {
  const { user } = useContext(AuthContext);

  // Store view states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Orders view states
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAll(searchQuery, selectedCategory);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch Orders
  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await orderAPI.getMyOrders();
      setMyOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'store') {
      fetchProducts();
      fetchCategories();
    } else if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab, selectedCategory, triggerRefresh]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  if (activeTab === 'orders') {
    return (
      <div className="container fade-in" style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>📦 Đơn hàng của bạn</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Xem và theo dõi lịch sử mua hàng của bạn</p>
          </div>
          <button onClick={fetchMyOrders} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            🔄 Làm mới
          </button>
        </div>

        {loadingOrders ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Đang tải lịch sử đơn hàng...</div>
        ) : myOrders.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '3rem' }}>📦</span>
            <h3 style={{ marginTop: '1rem', fontWeight: 600 }}>Bạn chưa đặt đơn hàng nào.</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Các sản phẩm công nghệ tuyệt vời đang chờ bạn ngoài cửa hàng!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {myOrders.map((order) => (
              <div key={order.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border)' }}>
                {/* Order Top Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mã đơn hàng:</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, marginLeft: '0.5rem', color: 'var(--primary)' }}>#{order.id}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '1.5rem' }}>Ngày đặt:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, marginLeft: '0.5rem' }}>
                      {new Date(order.orderDate).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Trạng thái:</span>
                    <span className={`badge badge-${order.status.toLowerCase()}`}>
                      {order.status === 'Pending' ? 'Chờ xử lý' :
                       order.status === 'Processing' ? 'Đang xử lý' :
                       order.status === 'Shipped' ? 'Đã giao hàng' : 'Đã hủy'}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '1.25rem' }}>
                  {order.orderItems.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {item.productName} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                    </div>
                  ))}
                </div>

                {/* Delivery details & total */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>📍 Địa chỉ nhận hàng:</p>
                    <p>{order.customerName} - {order.customerPhone}</p>
                    <p>{order.customerAddress}</p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginRight: '0.75rem' }}>Tổng tiền:</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {(order.totalAmount).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Else, show Store View
  return (
    <div className="container fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Hero / Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #fff, var(--text-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Khám phá Công nghệ Đỉnh cao
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Chào mừng bạn đến với GlowStore, nơi cung cấp các sản phẩm công nghệ hiện đại hàng đầu với chất lượng tốt nhất và dịch vụ chu đáo.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Category List */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setSelectedCategory('')}
            className={`btn ${selectedCategory === '' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flexGrow: 1, maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 500 }}>Đang tải danh sách sản phẩm...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <h3 style={{ marginTop: '1rem', fontWeight: 600 }}>Không tìm thấy sản phẩm nào.</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="grid-3">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
