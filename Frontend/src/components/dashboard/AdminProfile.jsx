import React, { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Camera, Mail, Phone, MapPin, Lock, Check, X } from 'lucide-react';
import axios from 'axios';

const AdminProfile = () => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '123 Admin Street, London',
    role: '',
    joined: '',
    lastActive: 'Today at 10:45 AM'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profileData});
  
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Set up axios config with auth token
  const apiConfig = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/auth/me', apiConfig);
        
        if (response.data.success) {
          const userData = response.data.data;
          // Split name into first and last name
          const nameParts = userData.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          // Format joined date
          const joinedDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          setProfileData({
            firstName,
            lastName,
            email: userData.email,
            phone: userData.phone || '',
            address: '123 Admin Street, London', // Placeholder since address isn't in API
            role: userData.role,
            joined: joinedDate,
            lastActive: 'Today at 10:45 AM'
          });
          
          setEditedProfile({
            firstName,
            lastName,
            email: userData.email,
            phone: userData.phone || '',
            address: '123 Admin Street, London'
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfileError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleProfileEdit = () => {
    setEditing(true);
    setEditedProfile({...profileData});
  };

  const handleProfileSave = async () => {
    try {
      // Prepare data for API
      const updateData = {
        name: `${editedProfile.firstName} ${editedProfile.lastName}`.trim(),
        phone: editedProfile.phone
        // Note: We're not sending address as it's not in your API schema
      };
      
      // Get user ID from localStorage or from the profile data
      const userId = JSON.parse(localStorage.getItem('userInfo') || '{}').id;
      
      // Make API call to update user
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`,
        updateData,
        apiConfig
      );
      
      if (response.data.success) {
        // Update local state with edited values
        setProfileData({
          ...profileData,
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          phone: editedProfile.phone,
          address: editedProfile.address
        });
        
        setEditing(false);
        setProfileSuccess('Profile updated successfully!');
        setProfileError('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setProfileSuccess('');
        }, 3000);
      } else {
        setProfileError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError('An error occurred while updating profile');
    }
  };

  const handleProfileCancel = () => {
    setEditing(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    
    // Clear messages when typing
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    try {
      // Make API call to update password
      const response = await axios.post(
        'http://localhost:5000/api/users/updatepassword',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        apiConfig
      );
      
      if (response.data.success) {
        // Success scenario
        setPasswordSuccess('Password updated successfully!');
        setPasswordError('');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setPasswordSuccess('');
        }, 3000);
      } else {
        setPasswordError(response.data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.response?.data?.message || 'An error occurred while updating password');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="My Profile">
        <div className="container-fluid p-4">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="My Profile">
      <div className="container-fluid p-4">
        <div className="row g-4">
          {/* Profile Information */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Profile Information</h5>
                  {!editing ? (
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={handleProfileEdit}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-light btn-sm" 
                        onClick={handleProfileCancel}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-success btn-sm" 
                        onClick={handleProfileSave}
                      >
                        <Check size={16} className="me-1" /> Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                {profileError && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <X size={18} className="me-2" />
                    <div>{profileError}</div>
                  </div>
                )}
                
                {profileSuccess && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <Check size={18} className="me-2" />
                    <div>{profileSuccess}</div>
                  </div>
                )}
              
                <div className="d-flex mb-4">
                  <div className="position-relative me-4">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                      <span className="display-4 text-secondary">
                        {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                      </span>
                    </div>
                    
                    {editing && (
                      <button className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0">
                        <Camera size={14} />
                      </button>
                    )}
                  </div>
                  
                  <div className="d-flex flex-column justify-content-center">
                    <h4 className="mb-1">{profileData.firstName} {profileData.lastName}</h4>
                    <p className="text-muted mb-0">{profileData.role}</p>
                  </div>
                </div>
                
                {editing ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editedProfile.firstName}
                        onChange={(e) => setEditedProfile({...editedProfile, firstName: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editedProfile.lastName}
                        onChange={(e) => setEditedProfile({...editedProfile, lastName: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        disabled
                      />
                      <div className="form-text">Email cannot be changed</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editedProfile.address}
                        onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex mb-3">
                      <Mail size={18} className="text-muted me-3 flex-shrink-0" />
                      <div>
                        <p className="mb-0 text-muted small">Email</p>
                        <p className="mb-0">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="d-flex mb-3">
                      <Phone size={18} className="text-muted me-3 flex-shrink-0" />
                      <div>
                        <p className="mb-0 text-muted small">Phone</p>
                        <p className="mb-0">{profileData.phone}</p>
                      </div>
                    </div>
                    
                    <div className="d-flex mb-3">
                      <MapPin size={18} className="text-muted me-3 flex-shrink-0" />
                      <div>
                        <p className="mb-0 text-muted small">Address</p>
                        <p className="mb-0">{profileData.address}</p>
                      </div>
                    </div>
                    
                    <hr />
                    
                    <div className="row g-3">
                      <div className="col-md-6">
                        <p className="text-muted small mb-1">Joined</p>
                        <p className="mb-0">{profileData.joined}</p>
                      </div>
                      <div className="col-md-6">
                        <p className="text-muted small mb-1">Last Active</p>
                        <p className="mb-0">{profileData.lastActive}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Change Password */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header bg-white py-3">
                <h5 className="card-title mb-0">Change Password</h5>
              </div>
              <div className="card-body">
                {passwordError && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <X size={18} className="me-2" />
                    <div>{passwordError}</div>
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <Check size={18} className="me-2" />
                    <div>{passwordSuccess}</div>
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={16} />
                      </span>
                      <input 
                        type="password" 
                        className="form-control" 
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={16} />
                      </span>
                      <input 
                        type="password" 
                        className="form-control" 
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="form-text">
                      Password must be at least 8 characters long
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={16} />
                      </span>
                      <input 
                        type="password" 
                        className="form-control" 
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100">
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;