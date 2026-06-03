import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI, dashboardAPI, userAPI } from '../services/api';

const AdminDashboard = () => {
  const [subTab, setSubTab] = useState('stats'); // stats, products, orders, users

  // --- STATS STATES ---
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- PRODUCTS STATES ---
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null if adding new

  // Product Form Fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [prodImageUrl, setProdImageUrl] = useState('');
  const [prodDescription, setProdDescription] = useState('');

  // --- ORDERS STATES ---
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // --- USERS STATES ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await orderAPI.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (subTab === 'stats') {
      fetchStats();
    } else if (subTab === 'products') {
      fetchProducts();
    } else if (subTab === 'orders') {
      fetchOrders();
    } else if (subTab === 'users') {
      fetchUsers();
    }
  }, [subTab]);

  // Open Product Modal for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('');
    setProdPrice('');
    setProdStock('');
    setProdImageUrl('');
    setProdDescription('');
    setIsProductModalOpen(true);
  };

  // Open Product Modal for Edit
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price);
    setProdStock(product.stock);
    setProdImageUrl(product.imageUrl);
    setProdDescription(product.description);
    setIsProductModalOpen(true);
  };

  // Save/Update Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const productData = {
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      stock: parseInt(prodStock),
      imageUrl: prodImageUrl,
      description: prodDescription
    };

    try {
      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await productAPI.create(productData);
        alert('Thêm sản phẩm mới thành công!');
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await productAPI.delete(id);
        alert('Đã xóa sản phẩm.');
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert('Xóa sản phẩm thất bại.');
      }
    }
  };

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      alert(`Đã cập nhật trạng thái đơn hàng sang ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert('Cập nhật trạng thái đơn hàng thất bại.');
    }
  };

  // Update User Role
  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      alert(`Đã cập nhật vai trò người dùng thành ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Cập nhật vai trò thất bại.');
    }
  };

  // Delete User Account
  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này? Người dùng sẽ không thể đăng nhập được nữa.')) {
      try {
        await userAPI.delete(id);
        alert('Đã xóa tài khoản người dùng.');
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Xóa tài khoản thất bại.');
      }
    }
  };

  return (
    <div className="container fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Tab Navigation header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>⚙️ Trang quản lý</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Bảng quản trị kinh doanh của hệ thống</p>
        </div>

        {/* Sub Tabs */}
        <div className="glass-panel" style={{ display: 'flex', padding: '0.25rem', gap: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button 
            onClick={() => setSubTab('stats')}
            className="btn" 
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              background: subTab === 'stats' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              color: subTab === 'stats' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            📊 Tổng quan
          </button>
          <button 
            onClick={() => setSubTab('products')}
            className="btn" 
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              background: subTab === 'products' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              color: subTab === 'products' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            📦 Sản phẩm
          </button>
          <button 
            onClick={() => setSubTab('orders')}
            className="btn" 
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              background: subTab === 'orders' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              color: subTab === 'orders' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            📋 Đơn hàng
          </button>
          <button 
            onClick={() => setSubTab('users')}
            className="btn" 
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              background: subTab === 'users' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
              color: subTab === 'users' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            👥 Tài khoản
          </button>
        </div>
      </div>

      {/* --- 1. OVERVIEW (STATS) VIEW --- */}
      {subTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {loadingStats ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Đang tải số liệu...</div>
          ) : stats ? (
            <>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                
                {/* Card Revenue */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Doanh thu (Ước tính)</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {(stats.totalRevenue).toLocaleString('vi-VN')} đ
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chưa tính đơn bị hủy</span>
                </div>

                {/* Card Orders */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tổng số đơn hàng</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stats.totalOrders}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mọi trạng thái đơn hàng</span>
                </div>

                {/* Card Products */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tổng loại sản phẩm</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stats.totalProducts}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trong cơ sở dữ liệu</span>
                </div>

                {/* Card Customers */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Khách hàng đã đăng ký</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {stats.totalCustomers}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Không tính tài khoản Admin</span>
                </div>
              </div>

              {/* Charts & Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Sales By Category */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>📊 Phân bố doanh số theo danh mục</h3>
                  {stats.salesByCategory.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chưa có doanh số bán hàng để hiển thị biểu đồ.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {stats.salesByCategory.map((cat, idx) => {
                        const totalAll = stats.salesByCategory.reduce((sum, item) => sum + item.amount, 0);
                        const percentage = totalAll > 0 ? (cat.amount / totalAll) * 100 : 0;
                        
                        return (
                          <div key={idx}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                              <span style={{ fontWeight: 600 }}>{cat.category}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                {cat.amount.toLocaleString('vi-VN')} đ ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: idx % 2 === 0 ? 'var(--primary)' : 'var(--secondary)',
                                borderRadius: '4px'
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Orders List */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>⚡ Đơn hàng mới nhất</h3>
                  {stats.recentOrders.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chưa có đơn hàng nào.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {stats.recentOrders.map((ord) => (
                        <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>#{ord.id}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.75rem' }}>{ord.customerName}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ord.totalAmount.toLocaleString('vi-VN')} đ</span>
                            <span className={`badge badge-${ord.status.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                              {ord.status === 'Pending' ? 'Chờ duyệt' : ord.status === 'Processing' ? 'Đang làm' : ord.status === 'Shipped' ? 'Đã giao' : 'Đã hủy'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Không tìm thấy dữ liệu thống kê.</p>
          )}
        </div>
      )}

      {/* --- 2. PRODUCTS CRUD VIEW --- */}
      {subTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Danh sách sản phẩm</h3>
            <button onClick={handleOpenCreateModal} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              ➕ Thêm sản phẩm mới
            </button>
          </div>

          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Đang tải danh sách sản phẩm...</div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem' }}>Ảnh</th>
                    <th style={{ padding: '1rem' }}>Tên sản phẩm</th>
                    <th style={{ padding: '1rem' }}>Danh mục</th>
                    <th style={{ padding: '1rem' }}>Giá bán</th>
                    <th style={{ padding: '1rem' }}>Tồn kho</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <img src={prod.imageUrl} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{prod.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', textTransform: 'none' }}>
                          {prod.category}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {prod.price.toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500, color: prod.stock <= 5 ? 'var(--error)' : 'var(--text-primary)' }}>
                        {prod.stock}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button onClick={() => handleOpenEditModal(prod)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Sửa
                          </button>
                          <button onClick={() => handleDeleteProduct(prod.id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- 3. ORDERS VIEW --- */}
      {subTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Danh sách đơn đặt hàng</h3>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Đang tải danh sách đơn hàng...</div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem' }}>Mã đơn</th>
                    <th style={{ padding: '1rem' }}>Khách hàng</th>
                    <th style={{ padding: '1rem' }}>Chi tiết sản phẩm</th>
                    <th style={{ padding: '1rem' }}>Tổng tiền</th>
                    <th style={{ padding: '1rem' }}>Địa chỉ nhận</th>
                    <th style={{ padding: '1rem' }}>Trạng thái</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Xử lý trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', verticalAlign: 'top' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>#{ord.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.customerPhone}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          {ord.orderItems.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.8rem' }}>
                              • {item.productName} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>
                        {ord.totalAmount.toLocaleString('vi-VN')} đ
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', maxWidth: '180px', wordBreak: 'break-word' }}>
                        {ord.customerAddress}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${ord.status.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                          {ord.status === 'Pending' ? 'Chờ xử lý' :
                           ord.status === 'Processing' ? 'Đang xử lý' :
                           ord.status === 'Shipped' ? 'Đã giao' : 'Đã hủy'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <select 
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{
                            backgroundColor: 'var(--surface-hover)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border)',
                            padding: '0.3rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'inherit',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Pending">Chờ xử lý</option>
                          <option value="Processing">Đang xử lý</option>
                          <option value="Shipped">Đã giao hàng</option>
                          <option value="Cancelled">Đã hủy đơn</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- 4. USERS VIEW --- */}
      {subTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Danh sách tài khoản người dùng</h3>

          {loadingUsers ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Đang tải danh sách tài khoản...</div>
          ) : (
            <div className="glass-panel" style={{ overflowX: 'auto', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Tên đăng nhập</th>
                    <th style={{ padding: '1rem' }}>Họ và tên</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Ngày đăng ký</th>
                    <th style={{ padding: '1rem' }}>Vai trò</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>#{u.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--primary)' }}>{u.username}</td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{u.fullName}</td>
                      <td style={{ padding: '1rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${u.role === 'Admin' ? 'badge-processing' : 'badge-shipped'}`} style={{ textTransform: 'none' }}>
                          {u.role === 'Admin' ? 'Admin' : 'Khách hàng'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {u.username === 'admin' ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Hệ thống mặc định</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                            <select 
                              value={u.role}
                              onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                              style={{
                                backgroundColor: 'var(--surface-hover)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                padding: '0.2rem 0.4rem',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'inherit',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Customer">Khách hàng</option>
                              <option value="Admin">Admin</option>
                            </select>
                            <button 
                              onClick={() => handleDeleteUser(u.id)} 
                              className="btn btn-danger" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- PRODUCT FORM DIALOG MODAL --- */}
      {isProductModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '550px',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {editingProduct ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
            </h3>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Tên sản phẩm *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={prodName} 
                  onChange={(e) => setProdName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Danh mục *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Điện thoại, Laptop..." 
                    value={prodCategory} 
                    onChange={(e) => setProdCategory(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng tồn kho *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={prodStock} 
                    onChange={(e) => setProdStock(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Đơn giá (VND) *</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={prodPrice} 
                    onChange={(e) => setProdPrice(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  {/* Image Preview Helper (Optional) */}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.8rem', textAlign: 'center' }}>
                    {prodImageUrl ? '✔️ Có ảnh preview' : '❌ Chưa có ảnh'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Ảnh URL (Unsplash/Imgur...)</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://images.unsplash.com/..."
                  value={prodImageUrl} 
                  onChange={(e) => setProdImageUrl(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Mô tả sản phẩm</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={prodDescription} 
                  onChange={(e) => setProdDescription(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-secondary">
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
