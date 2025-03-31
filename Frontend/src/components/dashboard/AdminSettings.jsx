import React, { useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Bell, Smartphone, Globe, Shield, Moon, Save, Check, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    restaurantUpdates: true,
    marketingEmails: false,
    securityAlerts: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30'
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    compactView: false,
    language: 'en',
    timezone: 'UTC+0'
  });
  
  const [saveSuccess, setSaveSuccess] = useState('');
  
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' }
  ];
  
  const timezones = [
    { value: 'UTC-8', label: 'Pacific Standard Time (UTC-8)' },
    { value: 'UTC-5', label: 'Eastern Standard Time (UTC-5)' },
    { value: 'UTC+0', label: 'Greenwich Mean Time (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
    { value: 'UTC+2', label: 'Eastern European Time (UTC+2)' },
    { value: 'UTC+5:30', label: 'Indian Standard Time (UTC+5:30)' },
    { value: 'UTC+8', label: 'China Standard Time (UTC+8)' },
    { value: 'UTC+9', label: 'Japan Standard Time (UTC+9)' },
    { value: 'UTC+10', label: 'Australian Eastern Time (UTC+10)' },
  ];
  
  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };
  
  const handleSecurityChange = (setting) => {
    if (typeof securitySettings[setting] === 'boolean') {
      setSecuritySettings({
        ...securitySettings,
        [setting]: !securitySettings[setting]
      });
    }
  };
  
  const handleSecurityInputChange = (e) => {
    setSecuritySettings({
      ...securitySettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleAppearanceChange = (setting) => {
    if (typeof appearanceSettings[setting] === 'boolean') {
      setAppearanceSettings({
        ...appearanceSettings,
        [setting]: !appearanceSettings[setting]
      });
    }
  };
  
  const handleAppearanceInputChange = (e) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to an API
    console.log('Saving settings:', {
      notificationSettings,
      securitySettings,
      appearanceSettings
    });
    
    // Show success message
    setSaveSuccess('Settings saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess('');
    }, 3000);
  };

  return (
    <AdminLayout title="Settings">
      <div className="container-fluid p-4">
        {saveSuccess && (
          <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
            <Check size={18} className="me-2" />
            <div>{saveSuccess}</div>
          </div>
        )}
        
        <div className="row g-4">
          {/* Notification Settings */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <Bell size={18} className="me-2 text-primary" />
                  <h5 className="card-title mb-0">Notification Settings</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="mb-3">Communication Channels</h6>
                  <div className="form-check form-switch mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="emailNotifications" 
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                    />
                    <label className="form-check-label d-flex justify-content-between" htmlFor="emailNotifications">
                      <span>Email Notifications</span>
                      {notificationSettings.emailNotifications ? 
                        <ToggleRight size={20} className="text-primary" /> : 
                        <ToggleLeft size={20} className="text-muted" />
                      }
                    </label>
                    <div className="form-text">Receive notifications via email</div>
                  </div>
                  
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="pushNotifications" 
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationChange('pushNotifications')}
                    />
                    <label className="form-check-label d-flex justify-content-between" htmlFor="pushNotifications">
                      <span>Push Notifications</span>
                      {notificationSettings.pushNotifications ? 
                        <ToggleRight size={20} className="text-primary" /> : 
                        <ToggleLeft size={20} className="text-muted" />
                      }
                    </label>
                    <div className="form-text">Receive notifications on your device</div>
                  </div>
                </div>
                
                <div>
                  <h6 className="mb-3">Notification Types</h6>
                  <div className="form-check form-switch mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="orderUpdates" 
                      checked={notificationSettings.orderUpdates}
                      onChange={() => handleNotificationChange('orderUpdates')}
                    />
                    <label className="form-check-label" htmlFor="orderUpdates">
                      Order Updates
                    </label>
                  </div>
                  
                  <div className="form-check form-switch mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="restaurantUpdates" 
                      checked={notificationSettings.restaurantUpdates}
                      onChange={() => handleNotificationChange('restaurantUpdates')}
                    />
                    <label className="form-check-label" htmlFor="restaurantUpdates">
                      Restaurant Updates
                    </label>
                  </div>
                  
                  <div className="form-check form-switch mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="marketingEmails" 
                      checked={notificationSettings.marketingEmails}
                      onChange={() => handleNotificationChange('marketingEmails')}
                    />
                    <label className="form-check-label" htmlFor="marketingEmails">
                      Marketing Emails
                    </label>
                  </div>
                  
                  <div className="form-check form-switch mb-3">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="securityAlerts" 
                      checked={notificationSettings.securityAlerts}
                      onChange={() => handleNotificationChange('securityAlerts')}
                    />
                    <label className="form-check-label" htmlFor="securityAlerts">
                      Security Alerts
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <Shield size={18} className="me-2 text-primary" />
                  <h5 className="card-title mb-0">Security Settings</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="twoFactorAuth" 
                    checked={securitySettings.twoFactorAuth}
                    onChange={() => handleSecurityChange('twoFactorAuth')}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="twoFactorAuth">
                    <span>Two-Factor Authentication</span>
                    {securitySettings.twoFactorAuth ? 
                      <ToggleRight size={20} className="text-primary" /> : 
                      <ToggleLeft size={20} className="text-muted" />
                    }
                  </label>
                  <div className="form-text">Secure your account with 2FA</div>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="loginAlerts" 
                    checked={securitySettings.loginAlerts}
                    onChange={() => handleSecurityChange('loginAlerts')}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="loginAlerts">
                    <span>Login Alerts</span>
                    {securitySettings.loginAlerts ? 
                      <ToggleRight size={20} className="text-primary" /> : 
                      <ToggleLeft size={20} className="text-muted" />
                    }
                  </label>
                  <div className="form-text">Receive alerts for new logins</div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Session Timeout (minutes)</label>
                  <select 
                    className="form-select" 
                    name="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityInputChange}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                  <div className="form-text">Automatically log out after inactivity</div>
                </div>
                
                <button className="btn btn-outline-primary mb-3" onClick={() => window.confirm('Are you sure you want to log out all other sessions?')}>
                  Log Out All Other Sessions
                </button>
                
                <div className="alert alert-info d-flex" role="alert">
                  <div>
                    <p className="mb-1"><strong>Last login:</strong> Today at 08:30 AM</p>
                    <p className="mb-0"><strong>Location:</strong> London, United Kingdom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <Moon size={18} className="me-2 text-primary" />
                  <h5 className="card-title mb-0">Appearance & Preferences</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="darkMode" 
                    checked={appearanceSettings.darkMode}
                    onChange={() => handleAppearanceChange('darkMode')}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="darkMode">
                    <span>Dark Mode</span>
                    {appearanceSettings.darkMode ? 
                      <ToggleRight size={20} className="text-primary" /> : 
                      <ToggleLeft size={20} className="text-muted" />
                    }
                  </label>
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="compactView" 
                    checked={appearanceSettings.compactView}
                    onChange={() => handleAppearanceChange('compactView')}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor="compactView">
                    <span>Compact View</span>
                    {appearanceSettings.compactView ? 
                      <ToggleRight size={20} className="text-primary" /> : 
                      <ToggleLeft size={20} className="text-muted" />
                    }
                  </label>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Language</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Globe size={16} />
                    </span>
                    <select 
                      className="form-select" 
                      name="language"
                      value={appearanceSettings.language}
                      onChange={handleAppearanceInputChange}
                    >
                      {languages.map(language => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Timezone</label>
                  <select 
                    className="form-select" 
                    name="timezone"
                    value={appearanceSettings.timezone}
                    onChange={handleAppearanceInputChange}
                  >
                    {timezones.map(timezone => (
                      <option key={timezone.value} value={timezone.value}>
                        {timezone.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Application Settings */}
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header bg-white py-3">
                <div className="d-flex align-items-center">
                  <Smartphone size={18} className="me-2 text-primary" />
                  <h5 className="card-title mb-0">Application Settings</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="alert alert-warning" role="alert">
                  These settings apply to the entire application and require administrator privileges.
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Default Order Status</label>
                  <select className="form-select" disabled>
                    <option>Pending</option>
                  </select>
                  <div className="form-text">Contact system administrator to change this setting</div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Delivery Radius (miles)</label>
                  <input type="number" className="form-control" value="5" disabled />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Commission Rate (%)</label>
                  <input type="number" className="form-control" value="10" disabled />
                </div>
                
                <div className="form-check form-switch mb-3">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="maintenanceMode" 
                    disabled
                  />
                  <label className="form-check-label" htmlFor="maintenanceMode">
                    Maintenance Mode
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            <Save size={16} className="me-2" /> Save All Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;