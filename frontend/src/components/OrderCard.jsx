import React from 'react';
import { PlayCircle, CheckCircle2 } from 'lucide-react';

const OrderCard = ({ order, onStatusUpdate, isAdmin }) => {
  let nextStatus = '';
  let ButtonIcon = null;
  let buttonText = '';
  let colorClass = '';
  let cardClass = '';

  if (order.status === 'Preparing') {
    nextStatus = 'Ready';
    ButtonIcon = PlayCircle;
    buttonText = 'Ready';
    colorClass = 'btn-ready';
    cardClass = 'card-prep';
  } else if (order.status === 'Ready') {
    nextStatus = 'Completed';
    ButtonIcon = CheckCircle2;
    buttonText = 'Complete';
    colorClass = 'btn-complete';
    cardClass = 'card-ready';
  } else {
    cardClass = 'card-comp';
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${order.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div className={`order-card ${cardClass}`}>
      <div className="card-top">
        <h3 className="card-title">{order.customerName}</h3>
        <span className="card-id">#{order.id}</span>
      </div>
      
      <p className="card-items">{order.items}</p>
      
      <div className="card-footer">
        <span className="card-time">{time}</span>
        
        {isAdmin && order.status !== 'Completed' && (
          <button onClick={handleUpdate} className={`action-btn ${colorClass}`}>
            {buttonText} <ButtonIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
