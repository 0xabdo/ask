import React, { useState, useEffect } from 'react';
import './ModernAdminPanel.css';

const ModernAdminPanel = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    imageUrl: ''
  });

  const [placeForm, setPlaceForm] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    description: '',
    category: '',
    rating: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, placesRes] = await Promise.all([
        fetch('/api/items'),
        fetch('/api/places')
      ]);
      
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData);
      }
      
      if (placesRes.ok) {
        const placesData = await placesRes.json();
        setPlaces(placesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const openModal = (type, item = null, place = null) => {
    setModalType(type);
    if (type === 'item' && item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price.toString(),
        stock: item.stock.toString(),
        imageUrl: item.imageUrl || ''
      });
    } else if (type === 'place' && place) {
      setEditingPlace(place);
      setPlaceForm({
        name: place.name,
        address: place.address,
        city: place.city,
        country: place.country,
        description: place.description,
        category: place.category,
        rating: place.rating.toString(),
        imageUrl: place.imageUrl || ''
      });
    } else {
      setEditingItem(null);
      setEditingPlace(null);
      setItemForm({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        imageUrl: ''
      });
      setPlaceForm({
        name: '',
        address: '',
        city: '',
        country: '',
        description: '',
        category: '',
        rating: '',
        imageUrl: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setEditingPlace(null);
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/items/${editingItem._id}` : '/api/items';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...itemForm,
          price: parseFloat(itemForm.price),
          stock: parseInt(itemForm.stock)
        })
      });

      if (response.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handlePlaceSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPlace ? `/api/places/${editingPlace._id}` : '/api/places';
      const method = editingPlace ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...placeForm,
          rating: parseFloat(placeForm.rating)
        })
      });

      if (response.ok) {
        fetchData();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving place:', error);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const deletePlace = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        const response = await fetch(`/api/places/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <h3>{items.length}</h3>
          <p>Total Items</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📍</div>
        <div className="stat-content">
          <h3>{places.length}</h3>
          <p>Total Places</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <h3>{items.filter(item => item.isActive).length}</h3>
          <p>Active Items</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🌟</div>
        <div className="stat-content">
          <h3>{places.filter(place => place.isActive).length}</h3>
          <p>Active Places</p>
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Items Management</h2>
        <button 
          className="btn-primary"
          onClick={() => openModal('item')}
        >
          + Add Item
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading items...</div>
      ) : (
        <div className="items-grid">
          {items.map(item => (
            <div key={item._id} className="item-card">
              <div className="item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="placeholder-image">📦</div>
                )}
              </div>
              <div className="item-content">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <div className="item-details">
                  <span className="category">{item.category}</span>
                  <span className="price">${item.price}</span>
                  <span className="stock">Stock: {item.stock}</span>
                </div>
                <div className="item-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => openModal('item', item)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaces = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>Places Management</h2>
        <button 
          className="btn-primary"
          onClick={() => openModal('place')}
        >
          + Add Place
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading places...</div>
      ) : (
        <div className="places-grid">
          {places.map(place => (
            <div key={place._id} className="place-card">
              <div className="place-image">
                {place.imageUrl ? (
                  <img src={place.imageUrl} alt={place.name} />
                ) : (
                  <div className="placeholder-image">📍</div>
                )}
              </div>
              <div className="place-content">
                <h3>{place.name}</h3>
                <p className="place-description">{place.description}</p>
                <div className="place-details">
                  <span className="category">{place.category}</span>
                  <span className="rating">⭐ {place.rating}</span>
                  <span className="location">{place.city}, {place.country}</span>
                </div>
                <div className="place-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => openModal('place', null, place)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => deletePlace(place._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="modern-admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>Modern Admin Dashboard</h1>
          <p>Manage your items and places with style</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          📦 Items
        </button>
        <button 
          className={`nav-tab ${activeTab === 'places' ? 'active' : ''}`}
          onClick={() => setActiveTab('places')}
        >
          📍 Places
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'items' && renderItems()}
        {activeTab === 'places' && renderPlaces()}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'item' ? 'Item' : 'Place'} {editingItem || editingPlace ? 'Edit' : 'Add'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            {modalType === 'item' && (
              <form onSubmit={handleItemSubmit} className="modal-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={itemForm.description}
                    onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({...itemForm, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={itemForm.stock}
                      onChange={(e) => setItemForm({...itemForm, stock: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={itemForm.imageUrl}
                      onChange={(e) => setItemForm({...itemForm, imageUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingItem ? 'Update' : 'Create'} Item
                  </button>
                </div>
              </form>
            )}

            {modalType === 'place' && (
              <form onSubmit={handlePlaceSubmit} className="modal-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={placeForm.name}
                    onChange={(e) => setPlaceForm({...placeForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={placeForm.description}
                    onChange={(e) => setPlaceForm({...placeForm, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={placeForm.address}
                      onChange={(e) => setPlaceForm({...placeForm, address: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={placeForm.city}
                      onChange={(e) => setPlaceForm({...placeForm, city: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={placeForm.country}
                      onChange={(e) => setPlaceForm({...placeForm, country: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={placeForm.category}
                      onChange={(e) => setPlaceForm({...placeForm, category: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={placeForm.rating}
                      onChange={(e) => setPlaceForm({...placeForm, rating: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={placeForm.imageUrl}
                      onChange={(e) => setPlaceForm({...placeForm, imageUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPlace ? 'Update' : 'Create'} Place
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAdminPanel;
