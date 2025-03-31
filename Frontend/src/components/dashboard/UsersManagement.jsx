import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Eye, ChevronLeft, ChevronRight, Download, Lock, Unlock, Mail, Shield, ShieldAlert, X, Check, UserPlus, User, Users, RefreshCw, AlertCircle } from 'lucide-react';
import AdminLayout from '../layout/AdminLayout';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Available roles
  const availableRoles = [
    { id: 'ADMIN', name: 'Admin', description: 'Full system access' },
    { id: 'STAFF', name: 'Staff', description: 'Restaurant staff access' },
    { id: 'CUSTOMER', name: 'Customer', description: 'Customer account' }
  ];

  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    role: 'all'
  });

  // State for viewing user details
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // State for editing user
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  // State for creating new user
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setError(null);
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);

      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }

      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const handleAddUser = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/users', newUserData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Add new user to state
        setUsers([...users, response.data.data]);

        // Reset form and close it
        setShowNewUserForm(false);
        setNewUserData({
          name: '',
          email: '',
          password: '',
          phone: '',
          role: 'CUSTOMER'
        });

        // Show success message
        alert('User created successfully');
      } else {
        alert(response.data.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      alert(err.response?.data?.message || 'Error creating user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing user
  const handleSaveUser = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Prepare update data (only send name and phone for update)
      const updateData = {
        name: editedUser.name,
        phone: editedUser.phone
      };

      const response = await axios.put(`http://localhost:5000/api/users/${editedUser.id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update user in state
        setUsers(users.map(user =>
          user.id === editedUser.id ? { ...user, ...updateData } : user
        ));

        // Update selected user if it's the one being edited
        if (selectedUser && selectedUser.id === editedUser.id) {
          setSelectedUser({ ...selectedUser, ...updateData });
        }

        setEditMode(false);

        // Show success message
        alert('User updated successfully');
      } else {
        alert(response.data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert(err.response?.data?.message || 'Error updating user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Remove user from state
        setUsers(users.filter(user => user.id !== userId));

        // Close details modal if it's open for this user
        if (selectedUser && selectedUser.id === userId) {
          handleCloseDetails();
        }

        // Show success message
        alert('User deleted successfully');
      } else {
        alert(response.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.message || 'Error deleting user. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Send password reset email
  const handleSendPasswordReset = async (userId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');

      // This endpoint would need to be implemented on your backend
      const response = await axios.post(`http://localhost:5000/api/users/${userId}/reset-password`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Password reset email sent successfully');
      } else {
        alert(response.data.message || 'Failed to send password reset email');
      }
    } catch (err) {
      console.error('Error sending password reset:', err);
      alert(err.response?.data?.message || 'Error sending password reset. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Function to handle viewing user details
  const handleViewUser = (userId) => {
    const user = users.find(user => user.id === userId);
    setSelectedUser(user);
    setShowDetails(true);
    setEditMode(false);
  };

  // Function to close user details
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  // Function to enter edit mode
  const handleEditUser = () => {
    setEditedUser({ ...selectedUser });
    setEditMode(true);
  };

  // Function to export users as CSV
  const handleExportUsers = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add headers
    csvContent += "ID,Name,Email,Phone,Role,Created At\n";

    // Add data rows
    filteredUsers.forEach(user => {
      const row = [
        user.id,
        user.name,
        user.email,
        user.phone || 'N/A',
        user.role,
        user.createdAt
      ];

      csvContent += row.map(value => `"${value}"`).join(",") + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);

    // Download the CSV file
    link.click();
    document.body.removeChild(link);
  };

  // Filter users based on filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.toLowerCase().includes(searchLower));

    // Role filter
    const matchesRole = filters.role === 'all' || user.role === filters.role;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      role: 'all'
    });
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-GB', options);
  };

  // Bootstrap badge class helper
  const getBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-danger';
      case 'STAFF':
        return 'bg-primary';
      case 'CUSTOMER':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout title="Users Management">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-warning mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      </AdminLayout>
    );
  }

  // New User Form Component
  const NewUserForm = () => {
    return (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowNewUserForm(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name*</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email*</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={newUserData.phone}
                      onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Role*</label>
                    <select
                      className="form-select"
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      required
                    >
                      {availableRoles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Password*</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      required
                      minLength="8"
                    />
                    <div className="form-text">
                      Password must be at least 8 characters long
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info d-flex align-items-center">
                <AlertCircle size={18} className="me-2 flex-shrink-0" />
                <div>
                  A confirmation email will be sent to the user upon account creation.
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowNewUserForm(false)}
                className="btn btn-light"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="btn btn-success"
                disabled={actionLoading || !newUserData.name || !newUserData.email || !newUserData.password}
              >
                {actionLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="me-1" /> Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </div>
    );
  };

  // User Details Modal Component
  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editMode ? 'Edit User' : 'User Details'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseDetails}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {editMode ? (
                // Edit Form
                <div className="mb-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editedUser.email}
                        disabled
                      />
                      <div className="form-text">Email cannot be changed</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editedUser.phone || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={editedUser.role}
                        disabled
                      >
                        {availableRoles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                      <div className="form-text">Role cannot be changed</div>
                    </div>
                  </div>
                </div>
              ) : (
                // View Details
                <div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6 className="text-muted mb-3">User Information</h6>
                      <dl className="row">
                        <dt className="col-sm-4">Full Name</dt>
                        <dd className="col-sm-8">{selectedUser.name}</dd>

                        <dt className="col-sm-4">Email</dt>
                        <dd className="col-sm-8">{selectedUser.email}</dd>

                        <dt className="col-sm-4">Phone</dt>
                        <dd className="col-sm-8">{selectedUser.phone || 'Not provided'}</dd>

                        <dt className="col-sm-4">Role</dt>
                        <dd className="col-sm-8">
                          <span className={`badge ${getBadgeClass(selectedUser.role)}`}>
                            {selectedUser.role}
                          </span>
                        </dd>
                      </dl>
                    </div>

                    <div className="col-md-6">
                      <h6 className="text-muted mb-3">Account Information</h6>
                      <dl className="row">
                        <dt className="col-sm-4">Created</dt>
                        <dd className="col-sm-8">{formatDate(selectedUser.createdAt)}</dd>

                        <dt className="col-sm-4">ID</dt>
                        <dd className="col-sm-8">
                          <small className="text-muted">{selectedUser.id}</small>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {!editMode ? (
                <>
                  <button
                    onClick={() => handleSendPasswordReset(selectedUser.id)}
                    className="btn btn-secondary"
                    disabled={actionLoading}
                  >
                    <Mail size={16} className="me-1" /> Send Password Reset
                  </button>
                  <button
                    onClick={handleEditUser}
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    <Edit size={16} className="me-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="btn btn-danger"
                    disabled={actionLoading}
                  >
                    <Trash size={16} className="me-1" /> Delete
                  </button>
                  <button
                    onClick={handleCloseDetails}
                    className="btn btn-light"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="btn btn-light"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUser}
                    className="btn btn-success"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={16} className="me-1" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="modal-backdrop show"></div>
      </div>
    );
  };

  return (
    <AdminLayout title="Users Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-0">Users Management</h1>
            <p className="text-muted">Manage system users, customers and staff</p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={fetchUsers}
              className="btn btn-outline-secondary"
              disabled={loading}
            >
              <RefreshCw size={18} className={`me-1 ${loading ? 'spinner' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExportUsers}
              className="btn btn-outline-primary d-flex align-items-center"
            >
              <Download size={18} className="me-1" />
              Export
            </button>
            <button
              onClick={() => setShowNewUserForm(true)}
              className="btn btn-warning text-white d-flex align-items-center"
            >
              <UserPlus size={18} className="me-1" />
              Add User
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4">
            <AlertCircle size={18} className="me-2" />
            {error}
          </div>
        )}

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    className="form-control"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="d-flex gap-2">
                  <select
                    className="form-select"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  >
                    <option value="all">All Roles</option>
                    {availableRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                    title="Clear filters"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-medium">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge ${getBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewUser(user.id)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User"
                              disabled={actionLoading}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <AlertCircle size={24} className="mb-2" />
                          <p>No users found</p>
                          {filters.search || filters.role !== 'all' ? (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={resetFilters}
                            >
                              Clear Filters
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > itemsPerPage && (
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        aria-label="Previous"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    </li>
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                      let pageToShow = currentPage;
                      if (totalPages <= 5) {
                        pageToShow = index + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + index;
                      } else {
                        pageToShow = currentPage - 2 + index;
                      }

                      return (
                        <li key={pageToShow} className={`page-item ${currentPage === pageToShow ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(pageToShow)}
                          >
                            {pageToShow}
                          </button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        aria-label="Next"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <div className="d-flex align-items-start mb-3">
              <ShieldAlert size={24} className="text-warning me-3" />
              <h5 className="card-title mb-0">User Security Best Practices</h5>
            </div>
            <ul className="list-group list-group-flush ms-4">
              <li className="list-group-item border-0 ps-0 py-1">Assign admin roles only to trusted staff members</li>
              <li className="list-group-item border-0 ps-0 py-1">Regularly review user accounts and remove unused ones</li>
              <li className="list-group-item border-0 ps-0 py-1">Encourage users to set strong, unique passwords</li>
              <li className="list-group-item border-0 ps-0 py-1">Send password reset links to users' registered email addresses</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagement;

