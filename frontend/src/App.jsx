import React, { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderCard from './components/OrderCard';
import { ChefHat } from 'lucide-react';

function App() {
  const [orders, setOrders] = useState([]);
  const [viewMode, setViewMode] = useState('user');

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://restaurant-ny8f.onrender.com/api/orders');
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
          <ChefHat size={24} color="#2563eb" />
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
            {preparingOrders.length === 0 
              ? <p className="empty-state">No orders found</p>
              : preparingOrders.map(order => (
                  <OrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} isAdmin={viewMode === 'admin'} />
                ))
            }
          </div>
          {preparingOrders.length > 0 && viewMode === 'user' && (
            <div className="col-hint">
              ⏳ Waiting for Kitchen Chef to approve
            </div>
          )}
        </div>

        <div className="board-col">
          <div className="col-header ready">
            Ready <span className="badge">{readyOrders.length}</span>
          </div>
          <div className="col-content">
            {readyOrders.length === 0
              ? <p className="empty-state">No orders found</p>
              : readyOrders.map(order => (
                  <OrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} isAdmin={viewMode === 'admin'} />
                ))
            }
          </div>
          {readyOrders.length > 0 && viewMode === 'user' && (
            <div className="col-hint col-hint-ready">
              ✅ Dish is done — Chef is marking as Completed
            </div>
          )}
        </div>

        <div className="board-col">
          <div className="col-header comp">
            Completed <span className="badge">{completedOrders.length}</span>
          </div>
          <div className="col-content">
            {completedOrders.length === 0
              ? <p className="empty-state">No orders found</p>
              : completedOrders.map(order => (
                  <OrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} isAdmin={viewMode === 'admin'} />
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
