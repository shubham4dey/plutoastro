import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://http://plutoastro-api.onrender.com/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Mock data for testing
      setOrders([
        { _id: '1', userName: 'Rahul Sharma', astrologerName: 'Astrologer 1', type: 'Chat', amount: 150, duration: '15 mins', createdAt: '2024-06-15', status: 'completed' },
        { _id: '2', userName: 'Priya Patel', astrologerName: 'Astrologer 2', type: 'Call', amount: 300, duration: '20 mins', createdAt: '2024-06-16', status: 'completed' },
        { _id: '3', userName: 'Amit Kumar', astrologerName: 'Astrologer 3', type: 'Chat', amount: 100, duration: '10 mins', createdAt: '2024-06-17', status: 'pending' },
        { _id: '4', userName: 'Sneha Gupta', astrologerName: 'Astrologer 4', type: 'Call', amount: 250, duration: '25 mins', createdAt: '2024-06-17', status: 'in-progress' },
        { _id: '5', userName: 'Vikram Singh', astrologerName: 'Astrologer 5', type: 'Chat', amount: 200, duration: '20 mins', createdAt: '2024-06-18', status: 'completed' },
        { _id: '6', userName: 'Neha Verma', astrologerName: 'Astrologer 6', type: 'Call', amount: 180, duration: '18 mins', createdAt: '2024-06-19', status: 'pending' },
        { _id: '7', userName: 'Rajesh Kumar', astrologerName: 'Astrologer 7', type: 'Chat', amount: 120, duration: '12 mins', createdAt: '2024-06-20', status: 'cancelled' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const userName = order.userName || order.userId?.name || '';
    const astrologerName = order.astrologerName || order.astrologerId?.name || '';
    
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         astrologerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    return type === 'Chat' 
      ? { bg: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd' }
      : { bg: 'rgba(236, 72, 153, 0.3)', color: '#f9a8d4' };
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
        display: 'flex',
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          marginLeft: '260px',
          padding: '30px',
          color: '#fff',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '25px',
            borderRadius: '20px',
            marginBottom: '30px',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '10px' }}>
            💰 Orders Management
          </h1>
          <p style={{ color: '#cfcfcf' }}>Track and manage all orders.</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <p style={{ color: '#c4b5fd', fontSize: '13px', marginBottom: '8px' }}>Total Orders</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>{orders.length}</p>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <p style={{ color: '#6ee7b7', fontSize: '13px', marginBottom: '8px' }}>Completed</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <p style={{ color: '#fcd34d', fontSize: '13px', marginBottom: '8px' }}>Pending</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <p style={{ color: '#93c5fd', fontSize: '13px', marginBottom: '8px' }}>Total Revenue</p>
            <p style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>₹{totalRevenue}</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '20px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by user or astrologer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: '350px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              background: '#fff',
              color: '#111827',
              fontSize: '16px',
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              border: 'none',
              outline: 'none',
              background: '#fff',
              color: '#111827',
              fontSize: '16px',
              cursor: 'pointer',
              minWidth: '150px',
            }}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.08)' }}>
                <th style={th}>Order ID</th>
                <th style={th}>User</th>
                <th style={th}>Astrologer</th>
                <th style={th}>Type</th>
                <th style={th}>Duration</th>
                <th style={th}>Amount</th>
                <th style={th}>Date</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ padding: '30px', textAlign: 'center', color: '#fff' }}>
                    Loading orders...
                  </td>
                </tr>
              ) : currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '30px', textAlign: 'center', color: '#fff' }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => {
                  const typeColors = getTypeColor(order.type);
                  return (
                    <tr 
                      key={order._id}
                      style={{ transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={td}>
                        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#a78bfa' }}>
                          #{order._id.slice(0, 8)}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '35px',
                              height: '35px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '14px',
                            }}
                          >
                            {(order.userName || order.userId?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: '600' }}>{order.userName || order.userId?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={td}>{order.astrologerName || order.astrologerId?.name || 'N/A'}</td>
                      <td style={td}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: typeColors.bg,
                          color: typeColors.color,
                        }}>
                          {order.type}
                        </span>
                      </td>
                      <td style={td}>{order.duration}</td>
                      <td style={td}>
                        <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '16px' }}>
                          ₹{order.amount}
                        </span>
                      </td>
                      <td style={td}>
                        {order.createdAt 
                          ? new Date(order.createdAt).toLocaleDateString() 
                          : order.date || 'N/A'}
                      </td>
                      <td style={td}>
                        <span style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: getStatusColor(order.status),
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: '13px',
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={td}>
                        <button 
                          style={{
                            background: '#8B5CF6',
                            border: 'none',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#7c3aed';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#8B5CF6';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', gap: '10px', color: '#fff' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
                background: '#3b82f6',
                color: '#fff',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Prev
            </button>
            <span style={{ padding: '10px 20px', fontSize: '16px', fontWeight: '600' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
                background: '#3b82f6',
                color: '#fff',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const th = {
  padding: '16px',
  textAlign: 'left',
  color: '#fff',
  borderBottom: '2px solid rgba(255,255,255,0.1)',
  fontWeight: '600',
};

const td = {
  padding: '16px',
  borderTop: '1px solid rgba(255,255,255,0.08)',
  verticalAlign: 'middle',
};

export default OrdersAdmin;