import React, { useState, useEffect } from 'react';
import { 
  Users, Trash, Edit, Plus, Loader, RefreshCw, AlertCircle, 
  CheckCircle, Square, Search, Filter, Save, X 
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';

const TableManagement = () => {
  const { restaurantId } = useParams();
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: 4,
    restaurantId: restaurantId || ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');

  // Fetch restaurants on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fetch tables when a restaurant is selected
  useEffect(() => {
    if (selectedRestaurant) {
      fetchTables(selectedRestaurant);
    } else {
      setTables([]);
      setLoading(false);
    }
  }, [selectedRestaurant]);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/restaurants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setRestaurants(response.data.data);
        
        // If no restaurant is selected yet and we have restaurants, select the first one
        if (!selectedRestaurant && response.data.data.length > 0 && !restaurantId) {
          setSelectedRestaurant(response.data.data[0].id);
        }
      } else {
        setError('Failed to load restaurants');
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      setError('Failed to load restaurants. Please try again.');
    } finally {
      if (!selectedRestaurant) {
        setLoading(false);
      }
    }
  };

  // Fetch tables for a specific restaurant
  const fetchTables = async (restaurantId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/table/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setTables(response.data.data);
        setError(null);
      } else {
        setError('Failed to load tables');
        setTables([]);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      setError('Failed to load tables. Please try again.');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new table
  const handleCreateTable = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Set the restaurantId if not already set
      const tableData = {
        ...newTable,
        restaurantId: selectedRestaurant || newTable.restaurantId
      };
      
      const response = await axios.post('http://localhost:5000/api/table', tableData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Add new table to the tables array
        setTables([...tables, response.data.data]);
        
        // Reset the form
        setNewTable({
          tableNumber: '',
          capacity: 4,
          restaurantId: selectedRestaurant
        });
        
        setShowAddForm(false);
      } else {
        alert('Failed to create table');
      }
    } catch (err) {
      console.error('Error creating table:', err);
      alert(err.response?.data?.message || 'Failed to create table. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing table
  const handleUpdateTable = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/table/${editingTable.id}`, {
        tableNumber: editingTable.tableNumber,
        capacity: editingTable.capacity,
        isAvailable: editingTable.isAvailable
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update the table in the tables array
        setTables(tables.map(table => 
          table.id === editingTable.id ? response.data.data : table
        ));
        
        setEditingTable(null);
      } else {
        alert('Failed to update table');
      }
    } catch (err) {
      console.error('Error updating table:', err);
      alert(err.response?.data?.message || 'Failed to update table. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a table
  const handleDeleteTable = async (tableId) => {
    if (!confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
      return;
    }
    
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/table/${tableId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Remove the table from the tables array
        setTables(tables.filter(table => table.id !== tableId));
      } else {
        alert('Failed to delete table');
      }
    } catch (err) {
      console.error('Error deleting table:', err);
      alert(err.response?.data?.message || 'Failed to delete table. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle table availability
  const toggleTableAvailability = async (tableId, currentStatus) => {
    setActionLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const tableToUpdate = tables.find(table => table.id === tableId);
      
      const response = await axios.put(`http://localhost:5000/api/table/${tableId}`, {
        ...tableToUpdate,
        isAvailable: !currentStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update the table in the tables array
        setTables(tables.map(table => 
          table.id === tableId ? response.data.data : table
        ));
      } else {
        alert('Failed to update table availability');
      }
    } catch (err) {
      console.error('Error updating table availability:', err);
      alert(err.response?.data?.message || 'Failed to update table availability. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Find the highest table number for the selected restaurant
  const getNextTableNumber = () => {
    if (tables.length === 0) return 1;
    return Math.max(...tables.map(table => table.tableNumber)) + 1;
  };

  // Filter tables based on search and capacity
  const filteredTables = tables.filter(table => {
    const matchesSearch = table.tableNumber.toString().includes(searchTerm);
    const matchesCapacity = capacityFilter === 'all' || 
                           (capacityFilter === '4-' && table.capacity <= 4) ||
                           (capacityFilter === '6-8' && table.capacity >= 6 && table.capacity <= 8) ||
                           (capacityFilter === '8+' && table.capacity > 8);
    
    return matchesSearch && matchesCapacity;
  });

  // Get selected restaurant name
  const getSelectedRestaurantName = () => {
    const restaurant = restaurants.find(r => r.id === selectedRestaurant);
    return restaurant ? restaurant.name : 'Select a Restaurant';
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setCapacityFilter('all');
  };

  if (loading && tables.length === 0) {
    return (
      <AdminLayout title="Table Management">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-warning mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading tables...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Table Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Table Management</h1>
          <button 
            className="btn btn-warning text-white"
            onClick={() => {
              setNewTable({
                tableNumber: getNextTableNumber(),
                capacity: 4,
                restaurantId: selectedRestaurant
              });
              setShowAddForm(true);
            }}
            disabled={!selectedRestaurant}
          >
            <Plus size={18} className="me-1" /> Add New Table
          </button>
        </div>

        {/* Select Restaurant */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Select Restaurant</label>
                <select 
                  className="form-select"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name} - {restaurant.address}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label">Filter Tables</label>
                <div className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search size={16} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by table #"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select 
                    className="form-select"
                    value={capacityFilter}
                    onChange={(e) => setCapacityFilter(e.target.value)}
                    style={{ maxWidth: '150px' }}
                  >
                    <option value="all">All Sizes</option>
                    <option value="4-">Small (≤ 4)</option>
                    <option value="6-8">Medium (6-8)</option>
                    <option value="8+">Large (8+)</option>
                  </select>
                  
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Table Form */}
        {showAddForm && (
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Add New Table</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateTable}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Table Number</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={newTable.tableNumber}
                      onChange={(e) => setNewTable({...newTable, tableNumber: parseInt(e.target.value)})}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Capacity (seats)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={newTable.capacity}
                      onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value)})}
                      required
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="d-flex justify-content-end mt-3 gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader size={16} className="me-1 spinner" /> Adding...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="me-1" /> Save Table
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Table Form */}
        {editingTable && (
          <div className="card mb-4 border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Edit Table #{editingTable.tableNumber}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdateTable}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Table Number</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={editingTable.tableNumber}
                      onChange={(e) => setEditingTable({...editingTable, tableNumber: parseInt(e.target.value)})}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Capacity (seats)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={editingTable.capacity}
                      onChange={(e) => setEditingTable({...editingTable, capacity: parseInt(e.target.value)})}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="col-12">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        id="isAvailable"
                        checked={editingTable.isAvailable}
                        onChange={(e) => setEditingTable({...editingTable, isAvailable: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="isAvailable">
                        Available for booking
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end mt-3 gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setEditingTable(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader size={16} className="me-1 spinner" /> Updating...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="me-1" /> Update Table
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <AlertCircle size={18} className="me-2" />
            <div>{error}</div>
          </div>
        )}

        {/* Restaurant Info */}
        {selectedRestaurant && restaurants.length > 0 && (
          <div className="alert alert-info mb-4" role="alert">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Managing tables for:</strong> {getSelectedRestaurantName()}
              </div>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => fetchTables(selectedRestaurant)}
                disabled={loading}
              >
                <RefreshCw size={16} className={`me-1 ${loading ? 'spinner' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Tables Display */}
        {selectedRestaurant ? (
          filteredTables.length > 0 ? (
            <div className="row">
              {filteredTables.map(table => (
                <div key={table.id} className="col-md-4 col-lg-3 mb-4">
                  <div className={`card h-100 ${!table.isAvailable ? 'border-danger bg-danger bg-opacity-10' : ''}`}>
                    <div className="card-body position-relative">
                      <div className="position-absolute top-0 end-0 mt-2 me-2">
                        <button 
                          className={`btn btn-sm ${table.isAvailable ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => toggleTableAvailability(table.id, table.isAvailable)}
                          disabled={actionLoading}
                        >
                          {table.isAvailable ? <X size={16} /> : <CheckCircle size={16} />}
                        </button>
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center bg-warning text-white rounded-circle mb-2" style={{ width: '60px', height: '60px' }}>
                          <h3 className="mb-0">{table.tableNumber}</h3>
                        </div>
                        <h5 className="mb-0">Table #{table.tableNumber}</h5>
                        <p className="text-muted mb-0">
                          {table.isAvailable ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center mb-2">
                          <Users size={18} className="me-1 text-primary" />
                          <span>{table.capacity} seats</span>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-center mt-3 gap-2">
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditingTable({...table})}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteTable(table.id)}
                          disabled={actionLoading}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-5 bg-light rounded">
              <div className="mb-3">
                <AlertCircle size={48} className="text-muted" />
              </div>
              
              {searchTerm || capacityFilter !== 'all' ? (
                <>
                  <h5>No tables match your search criteria</h5>
                  <p className="text-muted">Try adjusting your filters or clear them.</p>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <h5>No tables found for this restaurant</h5>
                  <p className="text-muted">Get started by adding a new table.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setNewTable({
                        tableNumber: 1,
                        capacity: 4,
                        restaurantId: selectedRestaurant
                      });
                      setShowAddForm(true);
                    }}
                  >
                    <Plus size={18} className="me-1" /> Add First Table
                  </button>
                </>
              )}
            </div>
          )
        ) : (
          <div className="text-center p-5 bg-light rounded">
            <div className="mb-3">
              <AlertCircle size={48} className="text-muted" />
            </div>
            <h5>Please select a restaurant</h5>
            <p className="text-muted">Select a restaurant from the dropdown to manage its tables.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TableManagement;