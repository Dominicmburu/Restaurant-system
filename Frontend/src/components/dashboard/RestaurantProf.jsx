import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, Nav } from 'react-bootstrap';
// import { Save, Trash, Plus, Pencil as Edit, Clock, GeoAlt as MapPin, Telephone as Phone, Envelope as Mail, Link as LinkIcon } from "react-bootstrap-icons";
import AdminLayout from '../layout/AdminLayout';

const RestaurantProf = () => {
  const navigate = useNavigate();
  // We'll assume id is passed as a URL parameter
  // In a real app, you would get this from useParams()
  const id = "1";

  // Sample restaurant data
  const [restaurant, setRestaurant] = useState({
    id: 1,
    name: 'Burger House',
    logo: '/images/restaurant-logos/burger-house.png',
    bannerImage: '/images/restaurant-banners/burger-house.jpg',
    description: 'Specializing in gourmet burgers and shakes. Our beef is locally sourced and our buns are baked fresh daily.',
    cuisine: 'Fast Food',
    address: '123 Camden High St, Camden, London NW1 7JR',
    phoneNumber: '+44 20 1234 5678',
    email: 'info@burgerhouse.com',
    website: 'www.burgerhouse.com',
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    commissionRate: 10,
    minOrderValue: 15,
    deliveryFee: 2.50,
    averagePreparationTime: 20,
    status: 'active',
    tables: [
      { id: 1, name: 'Table 1', capacity: 2, isAvailable: true },
      { id: 2, name: 'Table 2', capacity: 2, isAvailable: true },
      { id: 3, name: 'Table 3', capacity: 4, isAvailable: true },
      { id: 4, name: 'Table 4', capacity: 4, isAvailable: true },
      { id: 5, name: 'Table 5', capacity: 6, isAvailable: true },
      { id: 6, name: 'Table 6', capacity: 8, isAvailable: true }
    ],
    menu: [
      {
        id: 1,
        category: 'Starters',
        items: [
          { id: 101, name: 'Garlic Bread', description: 'Freshly baked bread with garlic butter and herbs', price: 5.99, isAvailable: true },
          { id: 102, name: 'Calamari', description: 'Lightly breaded and fried squid served with marinara sauce', price: 10.99, isAvailable: true }
        ]
      },
      {
        id: 2,
        category: 'Main Courses',
        items: [
          { id: 201, name: "Cheeseburger with Salad", description: "Juicy beef patty, fresh lettuce, tomato, and cheese—London's go-to comfort food", price: 19.00, isAvailable: true },
          { id: 202, name: 'Royal Cheeseburger with Bacon', description: 'Sizzling bacon, premium beef, and melted cheese served in a soft brioche bun', price: 13.49, isAvailable: true },
          { id: 203, name: 'Black Gamburgrer with Fishcake', description: 'A gourmet charcoal bun with crispy fishcake, creamy sauce, and fresh greens', price: 24.99, isAvailable: true },
          { id: 204, name: 'Classic Bacon Hamburger', description: 'Double-smoked bacon, crispy onions, and cheddar on a toasted brioche bun', price: 11.99, isAvailable: true }
        ]
      },
      {
        id: 3,
        category: 'Desserts',
        items: [
          { id: 301, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center, served with vanilla ice cream', price: 7.99, isAvailable: true },
          { id: 302, name: 'Tiramisu', description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream', price: 8.99, isAvailable: true }
        ]
      },
      {
        id: 4,
        category: 'Drinks',
        items: [
          { id: 401, name: 'Soft Drinks', description: 'Various soft drinks available', price: 2.99, isAvailable: true },
          { id: 402, name: 'House Wine', description: 'Red or white house wine by the glass', price: 6.99, isAvailable: true }
        ]
      }
    ]
  });

  // State for managing the active tab
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <AdminLayout title={`Restaurant: ${restaurant.name}`}>
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 fw-bold">{restaurant.name}</h1>
          <div className="d-flex gap-2">
            <button className="btn btn-warning d-flex align-items-center">
              <i className="bi bi-save me-2"></i>
              Save Changes
            </button>

            <button className="btn btn-danger d-flex align-items-center">
              <i className="bi bi-trash me-2"></i>
              Delete Restaurant
            </button>

          </div>
        </div>

        {/* Restaurant Banner */}
        <div className="position-relative mb-4 rounded overflow-hidden" style={{ height: '12rem' }}>
          <img
            src="/api/placeholder/1200/300"
            alt="Restaurant banner"
            className="w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-dark bg-opacity-40 d-flex align-items-center px-4">
            <div className="d-flex align-items-center">
              <div className="bg-white rounded p-1 me-3">
                <img
                  src="/api/placeholder/80/80"
                  alt={restaurant.name}
                  className="rounded"
                  width="80"
                  height="80"
                />
              </div>
              <div>
                <h2 className="text-white fw-bold">{restaurant.name}</h2>
                <div className="d-flex align-items-center text-white mt-1">
                  <i className="bi bi-geo-alt me-1"></i>
                  <span className="small">{restaurant.address}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle p-2">
            <i className="bi bi-pencil-square"></i>
          </button>

        </div>

        {/* Tabs */}
        <div className="card mb-4">
          <div className="card-header">
            <Nav variant="tabs" defaultActiveKey="profile" onSelect={(k) => setActiveTab(k)}>
              <Nav.Item>
                <Nav.Link eventKey="profile">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="menu">Menu</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tables">Tables</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Orders</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="settings">Settings</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <div className="card-body">
            <Tab.Content>
              {/* Profile Tab Content */}
              <Tab.Pane eventKey="profile">
                <div className="row g-4">
                  <div className="col-md-8">
                    <div className="card mb-4">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Basic Information</h3>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Restaurant Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={restaurant.name}
                              onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Cuisine Type</label>
                            <select
                              className="form-select"
                              value={restaurant.cuisine}
                              onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })}
                            >
                              <option value="Fast Food">Fast Food</option>
                              <option value="Asian">Asian</option>
                              <option value="BBQ">BBQ</option>
                              <option value="Italian">Italian</option>
                            </select>
                          </div>
                          <div className="col-12">
                            <label className="form-label">Description</label>
                            <textarea
                              className="form-control"
                              rows="3"
                              value={restaurant.description}
                              onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })}
                            ></textarea>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="text"
                              className="form-control"
                              value={restaurant.phoneNumber}
                              onChange={(e) => setRestaurant({ ...restaurant, phoneNumber: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              value={restaurant.email}
                              onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Website</label>
                            <input
                              type="text"
                              className="form-control"
                              value={restaurant.website}
                              onChange={(e) => setRestaurant({ ...restaurant, website: e.target.value })}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Status</label>
                            <select
                              className="form-select"
                              value={restaurant.status}
                              onChange={(e) => setRestaurant({ ...restaurant, status: e.target.value })}
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Address</h3>
                        <div className="mb-3">
                          <label className="form-label">Full Address</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            value={restaurant.address}
                            onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
                          ></textarea>
                        </div>
                        <div className="mt-4 bg-light rounded p-5 d-flex align-items-center justify-content-center text-muted">
                          Map Placeholder
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card mb-4">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Opening Hours</h3>
                        <div className="d-flex flex-column gap-3">
                          {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                            <div key={day} className="d-flex align-items-center justify-content-between">
                              <span className="fw-medium text-capitalize">{day}</span>
                              <div className="d-flex align-items-center">
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={hours.open}
                                  onChange={(e) => setRestaurant({
                                    ...restaurant,
                                    openingHours: {
                                      ...restaurant.openingHours,
                                      [day]: { ...hours, open: e.target.value }
                                    }
                                  })}
                                />
                                <span className="mx-2">-</span>
                                <input
                                  type="time"
                                  className="form-control form-control-sm"
                                  value={hours.close}
                                  onChange={(e) => setRestaurant({
                                    ...restaurant,
                                    openingHours: {
                                      ...restaurant.openingHours,
                                      [day]: { ...hours, close: e.target.value }
                                    }
                                  })}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Delivery Settings</h3>
                        <div className="d-flex flex-column gap-3">
                          <div>
                            <label className="form-label">Commission Rate (%)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={restaurant.commissionRate}
                              onChange={(e) => setRestaurant({ ...restaurant, commissionRate: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="form-label">Minimum Order Value (£)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={restaurant.minOrderValue}
                              onChange={(e) => setRestaurant({ ...restaurant, minOrderValue: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="form-label">Delivery Fee (£)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={restaurant.deliveryFee}
                              onChange={(e) => setRestaurant({ ...restaurant, deliveryFee: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div>
                            <label className="form-label">Average Preparation Time (min)</label>
                            <input
                              type="number"
                              className="form-control"
                              value={restaurant.averagePreparationTime}
                              onChange={(e) => setRestaurant({ ...restaurant, averagePreparationTime: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* Menu Tab Content */}
              <Tab.Pane eventKey="menu">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="card-title">Menu Categories</h3>
                      <button className="btn btn-warning d-flex align-items-center">
                        <i className="bi bi-plus me-1"></i>
                        Add Category
                      </button>
                    </div>

                    <div className="d-flex flex-column gap-4">
                      {restaurant.menu.map(category => (
                        <div key={category.id} className="border rounded">
                          <div className="bg-light p-3 d-flex justify-content-between align-items-center">
                            <h4 className="fw-medium mb-0">{category.category}</h4>
                            <div className="d-flex gap-2">
                              <button className="btn btn-link text-primary p-1">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-link text-danger p-1">
                                <i className="bi bi-trash"></i>
                              </button>
                              <button className="btn btn-warning btn-sm d-flex align-items-center">
                                <i className="bi bi-plus"></i>
                                <span className="ms-1">Add Item</span>
                              </button>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="table-responsive">
                              <table className="table table-bordered table-hover">
                                <thead className="table-light">
                                  <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Available</th>
                                    <th scope="col">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {category.items.map(item => (
                                    <tr key={item.id}>
                                      <td>{item.name}</td>
                                      <td className="text-muted">{item.description}</td>
                                      <td>£{item.price.toFixed(2)}</td>
                                      <td>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={item.isAvailable}
                                            onChange={() => {
                                              // Update item availability
                                              const updatedMenu = restaurant.menu.map(cat => {
                                                if (cat.id === category.id) {
                                                  const updatedItems = cat.items.map(i => {
                                                    if (i.id === item.id) {
                                                      return { ...i, isAvailable: !i.isAvailable };
                                                    }
                                                    return i;
                                                  });
                                                  return { ...cat, items: updatedItems };
                                                }
                                                return cat;
                                              });
                                              setRestaurant({ ...restaurant, menu: updatedMenu });
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td>
                                        <div className="d-flex gap-2">
                                          <button className="btn btn-link text-primary p-1">
                                            <i className="bi bi-pencil"></i>
                                          </button>
                                          <button className="btn btn-link text-danger p-1">
                                            <i className="bi bi-trash"></i>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* Tables Tab Content */}
              <Tab.Pane eventKey="tables">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="card-title">Tables Configuration</h3>
                      <button className="btn btn-warning d-flex align-items-center">
                        <i className="bi bi-plus me-1"></i>
                        Add Table
                      </button>
                    </div>

                    <div className="row g-3">
                      {restaurant.tables.map(table => (
                        <div key={table.id} className="col-md-6 col-lg-4">
                          <div className="border rounded p-3 position-relative">
                            <div className="position-absolute top-0 end-0 p-2 d-flex gap-1">
                              <button className="btn btn-link text-primary p-1">
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button className="btn btn-link text-danger p-1">
                                <i className="bi bi-trash"></i>
                              </button>

                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <div className={`rounded-circle me-2 ${table.isAvailable ? 'bg-success' : 'bg-danger'}`} style={{ width: '10px', height: '10px' }}></div>
                              <h4 className="fw-medium mb-0">{table.name}</h4>
                            </div>
                            <p className="text-muted small">Capacity: {table.capacity} people</p>
                            <div className="mt-2 d-flex align-items-center">
                              <span className="me-2">Available:</span>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={table.isAvailable}
                                  onChange={() => {
                                    // Update table availability
                                    const updatedTables = restaurant.tables.map(t => {
                                      if (t.id === table.id) {
                                        return { ...t, isAvailable: !t.isAvailable };
                                      }
                                      return t;
                                    });
                                    setRestaurant({ ...restaurant, tables: updatedTables });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* Orders Tab Content */}
              <Tab.Pane eventKey="orders">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Recent Orders</h3>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date & Time</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-medium">ORD-2024-001</td>
                            <td>John Doe</td>
                            <td>14/03/2025, 19:45</td>
                            <td>
                              <ul className="list-unstyled">
                                <li>1x Margherita Pizza</li>
                                <li>2x Chocolate Lava Cake</li>
                                <li>4x Soft Drinks</li>
                              </ul>
                            </td>
                            <td>£43.96</td>
                            <td>
                              <span className="badge bg-success">Delivered</span>
                            </td>
                            <td>
                              <button className="btn btn-link">View</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">ORD-2024-002</td>
                            <td>Jane Smith</td>
                            <td>14/03/2025, 18:30</td>
                            <td>
                              <ul className="list-unstyled">
                                <li>1x Classic Bacon Hamburger</li>
                                <li>1x Garlic Bread</li>
                                <li>2x House Wine</li>
                              </ul>
                            </td>
                            <td>£31.97</td>
                            <td>
                              <span className="badge bg-warning text-dark">Preparing</span>
                            </td>
                            <td>
                              <button className="btn btn-link">View</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Tab.Pane>

              {/* Settings Tab Content */}
              <Tab.Pane eventKey="settings">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Account Settings</h3>
                        <div className="mb-3">
                          <label className="form-label">Owner Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value="owner@burgerhouse.com"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Password</label>
                          <button className="btn btn-link text-warning p-0">
                            Reset Password
                          </button>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Notification Preferences</label>
                          <div className="d-flex flex-column gap-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="notification-orders"
                                checked
                              />
                              <label className="form-check-label" htmlFor="notification-orders">
                                New orders
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="notification-bookings"
                                checked
                              />
                              <label className="form-check-label" htmlFor="notification-bookings">
                                New bookings
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="notification-reviews"
                                checked
                              />
                              <label className="form-check-label" htmlFor="notification-reviews">
                                New reviews
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h3 className="card-title mb-4">Danger Zone</h3>
                        <div className="alert alert-danger">
                          <h4 className="alert-heading h5">Delete Restaurant</h4>
                          <p>
                            Once you delete a restaurant, there is no going back. This action cannot be undone.
                          </p>
                          <button className="btn btn-danger">
                            Delete Restaurant
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RestaurantProf;