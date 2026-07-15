import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const usersPerPage = 10;
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://https://plutoastro-production.up.railway.app/api/admin/users?page=${currentPage}&limit=${usersPerPage}&search=${searchTerm}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
        setTotalUsers(data.total || data.count || 0);
        setActiveUsers(data.users?.filter(u => u.status === 'active').length || 0);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users. Please try again.');
      
      // Optional: Show mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Showing mock data for development');
        setMockData();
      }
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockUsers = [
      { _id: '1', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', createdAt: '2024-01-15T00:00:00.000Z', status: 'active', orders: 5 },
      { _id: '2', name: 'Priya Patel', email: 'priya@gmail.com', phone: '9876543211', createdAt: '2024-02-20T00:00:00.000Z', status: 'active', orders: 3 },
      { _id: '3', name: 'Amit Kumar', email: 'amit@gmail.com', phone: '9876543212', createdAt: '2024-03-10T00:00:00.000Z', status: 'inactive', orders: 1 },
      { _id: '4', name: 'Sneha Gupta', email: 'sneha@gmail.com', phone: '9876543213', createdAt: '2024-04-05T00:00:00.000Z', status: 'active', orders: 8 },
      { _id: '5', name: 'Vikram Singh', email: 'vikram@gmail.com', phone: '9876543214', createdAt: '2024-05-12T00:00:00.000Z', status: 'active', orders: 2 },
    ];
    setUsers(mockUsers);
    setTotalUsers(mockUsers.length);
    setActiveUsers(mockUsers.filter(u => u.status === 'active').length);
  };

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`);
    
    if (!confirmed) return;

    try {
      setDeletingId(userId);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://https://plutoastro-production.up.railway.app/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
        setTotalUsers(prev => prev - 1);
        
        // Show success message
        alert('User deleted successfully');
        
        // Refresh data
        fetchUsers();
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      default: return '#6b7280';
    }
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
            👥 Users Management
          </h1>
          <p style={{ color: '#cfcfcf' }}>Manage all registered users from one place.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#fca5a5',
              padding: '15px 20px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Search & Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
                background: '#fff',
                color: '#111827',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1,
              }}
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.2)', 
              padding: '12px 24px', 
              borderRadius: '12px', 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#c4b5fd', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Total Users</span>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '24px' }}>
                {loading ? '...' : totalUsers}
              </span>
            </div>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              padding: '12px 24px', 
              borderRadius: '12px', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              <span style={{ color: '#6ee7b7', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Active</span>
              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '24px' }}>
                {loading ? '...' : activeUsers}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(139, 92, 246, 0.3)',
                borderTop: '4px solid #8B5CF6',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }}></div>
              <p style={{ color: '#c4b5fd', fontSize: '16px' }}>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
              <p style={{ color: '#fff', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                No users found
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Users will appear here once they register'}
              </p>
            </div>
          ) : (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <th style={th}>User</th>
                    <th style={th}>Email</th>
                    <th style={th}>Phone</th>
                    <th style={th}>Joined Date</th>
                    <th style={th}>Orders</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={user._id} 
                      style={{ 
                        transition: 'all 0.2s',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '45px',
                              height: '45px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${['#8B5CF6', '#EC4899', '#10b981', '#f59e0b', '#3b82f6'][index % 5]}, ${['#EC4899', '#8B5CF6', '#f59e0b', '#10b981', '#8B5CF6'][index % 5]})`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '18px',
                              boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
                            }}
                          >
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>{user.name || 'N/A'}</div>
                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>ID: {user._id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={td}>
                        <div>
                          <div style={{ color: '#e5e7eb' }}>{user.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td style={td}>{user.phone || 'N/A'}</td>
                      <td style={td}>{formatDate(user.createdAt || user.joinedDate)}</td>
                      <td style={td}>
                        <span style={{ 
                          background: 'rgba(139, 92, 246, 0.3)', 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '13px', 
                          fontWeight: '600',
                          color: '#c4b5fd'
                        }}>
                          {user.orders || 0}
                        </span>
                      </td>
                      <td style={td}>
                        <span
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: getStatusColor(user.status),
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '13px',
                            textTransform: 'capitalize',
                            display: 'inline-block',
                            minWidth: '80px',
                            textAlign: 'center',
                          }}
                        >
                          {user.status || 'inactive'}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            style={{
                              background: '#3b82f6',
                              border: 'none',
                              color: '#fff',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                            onClick={() => alert('Edit functionality - Coming soon!')}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={deletingId === user._id}
                            style={{
                              background: deletingId === user._id ? '#991b1b' : '#ef4444',
                              border: 'none',
                              color: '#fff',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              cursor: deletingId === user._id ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              fontSize: '13px',
                              opacity: deletingId === user._id ? 0.6 : 1,
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                            onMouseEnter={(e) => {
                              if (deletingId !== user._id) {
                                e.currentTarget.style.background = '#dc2626';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (deletingId !== user._id) {
                                e.currentTarget.style.background = '#ef4444';
                              }
                            }}
                          >
                            {deletingId === user._id ? (
                              <>
                                <div style={{
                                  width: '14px',
                                  height: '14px',
                                  border: '2px solid rgba(255,255,255,0.3)',
                                  borderTop: '2px solid #fff',
                                  borderRadius: '50%',
                                  animation: 'spin 0.8s linear infinite',
                                }}></div>
                                Deleting...
                              </>
                            ) : (
                              <>🗑️ Delete</>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ 
                  marginTop: '25px', 
                  padding: '20px', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '10px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: currentPage === 1 || loading ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 || loading ? 0.5 : 1,
                      background: '#3b82f6',
                      color: '#fff',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1 && !loading) {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ← Previous
                  </button>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '5px',
                    padding: '0 20px',
                  }}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: currentPage === pageNum ? '#8B5CF6' : 'rgba(255,255,255,0.1)',
                            color: currentPage === pageNum ? '#fff' : '#e5e7eb',
                            fontWeight: currentPage === pageNum ? 'bold' : '500',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== pageNum && !loading) {
                              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage !== pageNum) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: currentPage === totalPages || loading ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages || loading ? 0.5 : 1,
                      background: '#3b82f6',
                      color: '#fff',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages && !loading) {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Showing info */}
              <div style={{ 
                marginTop: '15px', 
                padding: '15px 20px', 
                textAlign: 'center', 
                color: '#9ca3af',
                fontSize: '14px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const th = {
  padding: '16px',
  textAlign: 'left',
  color: '#c4b5fd',
  borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
  fontWeight: '600',
  fontSize: '14px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const td = {
  padding: '16px',
  verticalAlign: 'middle',
  color: '#e5e7eb',
  fontSize: '14px',
};

export default UsersAdmin;