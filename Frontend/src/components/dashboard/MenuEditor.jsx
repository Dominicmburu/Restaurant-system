import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash, ChevronDown, ChevronUp, Save, X, FileImage, Tag, Coffee, Utensils, MessageCircle } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';

const MenuEditor = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for editing and creating
  const [editingItem, setEditingItem] = useState(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // State for search and filtering
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Default new item template
  const defaultNewItem = {
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'kebabs',
    isPopular: false,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  };
  
  // New menu item state
  const [newItemData, setNewItemData] = useState({ ...defaultNewItem });
  
  // Ref for file input
  const fileInputRef = useRef(null);

  // Extract unique categories from menu items
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);
  
  // Fetch all menu items from API
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/menu', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setMenuItems(response.data.data);
        
        // Initialize all categories as expanded
        const categories = {};
        response.data.data.forEach(item => {
          categories[item.category] = true;
        });
        setExpandedCategories(categories);
      } else {
        setError('Failed to load menu items');
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a new menu item
  const handleCreateMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/menu', newItemData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Add new item to state
        setMenuItems([...menuItems, response.data.data]);
        // Reset form
        setNewItemData({ ...defaultNewItem });
        setShowNewItemForm(false);
        
        // Ensure category is expanded
        setExpandedCategories({
          ...expandedCategories,
          [response.data.data.category]: true
        });
      } else {
        alert('Failed to create menu item');
      }
    } catch (err) {
      console.error('Error creating menu item:', err);
      alert('Failed to create menu item. Please try again.');
    }
  };
  
  // Update an existing menu item
  const handleUpdateMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/menu/${editingItem.id}`, editingItem, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update item in state
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? response.data.data : item
        ));
        setEditingItem(null);
      } else {
        alert('Failed to update menu item');
      }
    } catch (err) {
      console.error('Error updating menu item:', err);
      alert('Failed to update menu item. Please try again.');
    }
  };
  
  // Delete a menu item
  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Remove item from state
        setMenuItems(menuItems.filter(item => item.id !== id));
      } else {
        alert('Failed to delete menu item');
      }
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    }
  };
  
  // Toggle category expansion
  const toggleCategoryExpansion = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  
  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group menu items by category
  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  // Item Form Component (used for both new and edit)
  const ItemForm = ({ item, setItem, onSave, onCancel, isNew }) => {
    return (
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{isNew ? 'Add New Menu Item' : 'Edit Menu Item'}</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Item Name</label>
              <input 
                type="text"
                className="form-control"
                value={item.name}
                onChange={(e) => setItem({...item, name: e.target.value})}
                placeholder="e.g. Chicken Shish Kebab"
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={item.category}
                onChange={(e) => setItem({...item, category: e.target.value})}
                required
              >
                <option value="kebabs">Kebabs</option>
                <option value="pizzas">Pizzas</option>
                <option value="mezes">Mezes</option>
                <option value="desserts">Desserts</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Price (£)</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={item.price}
                onChange={(e) => setItem({...item, price: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Image URL</label>
              <input 
                type="text"
                className="form-control"
                value={item.image}
                onChange={(e) => setItem({...item, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea 
                className="form-control"
                rows="3"
                value={item.description}
                onChange={(e) => setItem({...item, description: e.target.value})}
                placeholder="Describe the menu item in detail..."
                required
              ></textarea>
            </div>
            
            <div className="col-12">
              <label className="form-label mb-2">Dietary Options</label>
              <div className="d-flex flex-wrap gap-3">
                <div className="form-check">
                  <input 
                    type="checkbox"
                    id={`popular-${isNew ? 'new' : item.id}`}
                    checked={item.isPopular}
                    onChange={(e) => setItem({...item, isPopular: e.target.checked})}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor={`popular-${isNew ? 'new' : item.id}`}>Popular</label>
                </div>
                
                <div className="form-check">
                  <input 
                    type="checkbox"
                    id={`vegetarian-${isNew ? 'new' : item.id}`}
                    checked={item.isVegetarian}
                    onChange={(e) => setItem({...item, isVegetarian: e.target.checked})}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor={`vegetarian-${isNew ? 'new' : item.id}`}>Vegetarian</label>
                </div>
                
                <div className="form-check">
                  <input 
                    type="checkbox"
                    id={`vegan-${isNew ? 'new' : item.id}`}
                    checked={item.isVegan}
                    onChange={(e) => setItem({...item, isVegan: e.target.checked})}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor={`vegan-${isNew ? 'new' : item.id}`}>Vegan</label>
                </div>
                
                <div className="form-check">
                  <input 
                    type="checkbox"
                    id={`gluten-free-${isNew ? 'new' : item.id}`}
                    checked={item.isGlutenFree}
                    onChange={(e) => setItem({...item, isGlutenFree: e.target.checked})}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor={`gluten-free-${isNew ? 'new' : item.id}`}>Gluten Free</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button 
              onClick={onCancel}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={onSave}
              className="btn btn-primary"
              disabled={!item.name || !item.description || !item.price || !item.category}
            >
              <Save size={16} className="me-1" /> {isNew ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Menu Item Component
  const MenuItem = ({ item }) => {
    return (
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-3">
            <div className="bg-light h-100 d-flex align-items-center justify-content-center overflow-hidden" style={{ minHeight: '150px' }}>
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="img-fluid rounded-start object-fit-cover h-100 w-100" 
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Utensils size={48} className="text-muted" />
              )}
            </div>
          </div>
          <div className="col-md-9">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title mb-0">{item.name}</h5>
                <span className="badge bg-primary rounded-pill">£{parseFloat(item.price).toFixed(2)}</span>
              </div>
              
              <p className="card-text text-muted small mb-3">{item.description}</p>
              
              <div className="d-flex flex-wrap gap-1 mb-3">
                {item.isPopular && (
                  <span className="badge bg-danger">Popular</span>
                )}
                {item.isVegetarian && (
                  <span className="badge bg-success">Vegetarian</span>
                )}
                {item.isVegan && (
                  <span className="badge bg-success">Vegan</span>
                )}
                {item.isGlutenFree && (
                  <span className="badge bg-info">Gluten Free</span>
                )}
              </div>
              
              <div className="d-flex justify-content-end">
                <button 
                  onClick={() => setEditingItem({...item})}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  <Edit size={16} className="me-1" /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteMenuItem(item.id)}
                  className="btn btn-sm btn-outline-danger"
                >
                  <Trash size={16} className="me-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Category Header Component
  const CategoryHeader = ({ category, itemCount }) => {
    const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
    const isExpanded = expandedCategories[category];
    
    return (
      <div 
        className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-3 cursor-pointer"
        style={{ cursor: 'pointer' }}
        onClick={() => toggleCategoryExpansion(category)}
      >
        <div className="d-flex align-items-center">
          <h5 className="mb-0">{displayCategory}</h5>
          <span className="badge bg-secondary ms-2">{itemCount} items</span>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    );
  };
  
  if (loading) {
    return (
      <AdminLayout title="Menu Management">
        <div className="container-fluid p-4 text-center">
          <div className="spinner-border text-primary mt-5" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading menu items...</p>
        </div>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Menu Management">
        <div className="container-fluid p-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button 
            onClick={fetchMenuItems} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Menu Management">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Menu Management</h1>
          <button 
            onClick={() => {
              setNewItemData({...defaultNewItem});
              setShowNewItemForm(true);
            }}
            className="btn btn-primary"
          >
            <Plus size={16} className="me-1" /> Add New Item
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Search Menu Items</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="col-md-4">
                <label className="form-label">Filter by Category</label>
                <select 
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form for adding/editing menu items */}
        {showNewItemForm && (
          <ItemForm 
            item={newItemData}
            setItem={setNewItemData}
            onSave={handleCreateMenuItem}
            onCancel={() => setShowNewItemForm(false)}
            isNew={true}
          />
        )}
        
        {editingItem && (
          <ItemForm 
            item={editingItem}
            setItem={setEditingItem}
            onSave={handleUpdateMenuItem}
            onCancel={() => setEditingItem(null)}
            isNew={false}
          />
        )}
        
        {/* Menu Items */}
        {Object.keys(groupedMenuItems).length > 0 ? (
          Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category} className="mb-4">
              <CategoryHeader category={category} itemCount={items.length} />
              
              {expandedCategories[category] && (
                <div className="ps-2">
                  {items.map(item => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-5">
            <div className="mb-3">
              <MessageCircle size={48} className="text-muted" />
            </div>
            <h5>No menu items found</h5>
            <p className="text-muted">
              {search || selectedCategory !== 'all' ? 
                'Try adjusting your search or filter.' : 
                'Start by adding menu items to create your menu.'}
            </p>
          </div>
        )}
        
        {/* Quick Tips Section */}
        <div className="card bg-warning bg-opacity-10 border-warning mt-4">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center">
              <Coffee size={20} className="me-2 text-warning" /> Menu Management Tips
            </h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item bg-transparent border-0 py-1">Keep menu descriptions concise but appetizing.</li>
              <li className="list-group-item bg-transparent border-0 py-1">Always include dietary information (vegetarian, vegan, gluten-free).</li>
              <li className="list-group-item bg-transparent border-0 py-1">Add high-quality images to showcase your dishes.</li>
              <li className="list-group-item bg-transparent border-0 py-1">Mark popular items to guide customer choices.</li>
              <li className="list-group-item bg-transparent border-0 py-1">Keep your categories consistent and clear.</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuEditor;