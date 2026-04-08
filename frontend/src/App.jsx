import React, { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderCard from './components/OrderCard';


function App() {
  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState('user');

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  const readyOrders = orders.filter(o => o.status === 'Ready');
  const completedOrders = orders.filter(o => o.status === 'Completed');

  return (
    <div className="dashboard-layout">
      <nav className="top-nav">
        <div className="brand">
          <img src="/logo.png" alt="Restaurant Tracker Logo" className="app-logo" />
          <h1>Order Tracker</h1>
        </div>
        
        <div className="role-switcher">
          <button 
            className={`switcher-btn ${viewMode === 'user' ? 'active' : ''}`} 
            onClick={() => setViewMode('user')}
          >
            Customer View
          </button>
          <button 
            className={`switcher-btn ${viewMode === 'admin' ? 'active' : ''}`} 
            onClick={() => setViewMode('admin')}
          >
            Kitchen Admin
          </button>
        </div>
      </nav>

      {viewMode === 'user' && <OrderForm onOrderCreated={fetchOrders} />}

      <div className="board-grid">
        <div className="board-col">
          <div className="col-header prep">
            Preparing <span className="badge">{preparingOrders.length}</span>
          </div>
          <div className="col-content">
            {preparingOrders.map(order => (
              <OrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} isAdmin={viewMode === 'admin'} />
            ))}
          </div>
        </div>

        <div className="board-col">
          <div className="col-header ready">
            Ready <span className="badge">{readyOrders.length}</span>
          </div>
          <div className="col-content">
            {readyOrders.map(order => (
              <OrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} isAdmin={viewMode === 'admin'} />
            ))}
          </div>
        </div>

        <div className="board-col">
          <div className="col-header comp">
            Completed <span className="badge">{completedOrders.length}</span>
          </div>
          <div className="col-content">
            {completedOrders.map(order => (
              <OrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} isAdmin={viewMode === 'admin'} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
