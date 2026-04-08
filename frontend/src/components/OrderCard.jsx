import React from 'react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';

const OrderCard = ({ order, onStatusUpdate, isAdmin }) => {
  let nextStatus = '';
  let ButtonIcon = null;
  let buttonText = '';
  let colorClass = '';

  if (order.status === 'Preparing') {
    nextStatus = 'Ready';
    ButtonIcon = PlayCircle;
    buttonText = 'Mark as Ready';
    colorClass = 'btn-ready';
  } else if (order.status === 'Ready') {
    nextStatus = 'Completed';
    ButtonIcon = CheckCircle2;
    buttonText = 'Mark as Done';
    colorClass = 'btn-complete';
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://restaurant-ny8f.onrender.com/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const time = new Date(order.createdAt + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="order-card">
      <div className="card-top">
        <h3 className="card-title">{order.customerName}</h3>
        <span className="card-id">#{order.id}</span>
      </div>

      <p className="card-items">{order.items}</p>

      <div className="card-footer">
        <span className="card-time">{time}</span>

        {isAdmin && order.status !== 'Completed' && (
          <button onClick={handleUpdate} className={`action-btn ${colorClass}`}>
            <ButtonIcon size={14} /> {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
