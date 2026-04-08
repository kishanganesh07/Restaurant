import React, { useState } from 'react';
import { Plus, Minus, User, ShoppingBag } from 'lucide-react';
import Select from 'react-select';

const menuOptions = [
  { value: 'Butter Chicken & Garlic Naan', label: 'Butter Chicken & Garlic Naan' },
  { value: 'Paneer Tikka Masala', label: 'Paneer Tikka Masala' },
  { value: 'Hyderabadi Chicken Biryani', label: 'Hyderabadi Chicken Biryani' },
  { value: 'Chole Bhature', label: 'Chole Bhature' },
  { value: 'Crispy Masala Dosa', label: 'Crispy Masala Dosa' },
  { value: 'Palak Paneer', label: 'Palak Paneer' },
  { value: 'Mutton Rogan Josh', label: 'Mutton Rogan Josh' },
  { value: 'Dal Makhani & Jeera Rice', label: 'Dal Makhani & Jeera Rice' },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderColor: state.isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    padding: '0.1rem',
    borderRadius: '6px',
    color: '#fafafa',
    cursor: 'pointer',
    width: '100%',
    minWidth: '220px',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : 'rgba(255, 255, 255, 0.15)'
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#18181b',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 24px -8px rgba(0,0,0,0.3)',
    borderRadius: '8px',
    zIndex: 9999
  }),
  menuList: (provided) => ({
    ...provided,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(255,255,255,0.05)' : 'transparent',
    color: state.isSelected ? '#3b82f6' : '#fafafa',
    cursor: 'pointer',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    '&:active': {
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fafafa',
    fontSize: '0.85rem',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#a1a1aa',
    fontSize: '0.85rem',
  }),
  input: (provided) => ({
    ...provided,
    color: '#fafafa'
  })
};

const OrderForm = ({ onOrderCreated }) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !selectedItem || quantity < 1) return;
    const formattedItems = `${quantity}x ${selectedItem.label}`;

    try {
      const response = await fetch('https://restaurant-ny8f.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, items: formattedItems }),
      });

      if (response.ok) {
        setCustomerName('');
        setSelectedItem(null);
        setQuantity(1);
        onOrderCreated();
      }
    } catch (error) {
        console.error('Error connecting to backend:', error);
    }
  };

  return (
    <form className="create-panel" onSubmit={handleSubmit}>
      <div className="input-grp">
        <User size={16} color="#a1a1aa" />
        <input
          className="premium-input"
          type="text"
          placeholder="Customer name..."
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </div>
      
      <div className="input-grp">
        <ShoppingBag size={16} color="#a1a1aa" />
        <Select
          value={selectedItem}
          onChange={setSelectedItem}
          options={menuOptions}
          styles={customStyles}
          placeholder="Select menu item..."
          isSearchable={true}
          required={!selectedItem} /* Fallback validation */
        />
      </div>

      <div className="qty-control">
        <button 
          type="button" 
          className="qty-btn" 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Minus size={14} />
        </button>
        <span className="qty-display">{quantity}</span>
        <button 
          type="button" 
          className="qty-btn" 
          onClick={() => setQuantity(Math.min(99, quantity + 1))}
        >
          <Plus size={14} />
        </button>
      </div>
      
      <button type="submit" className="btn-primary">
        <Plus size={16} /> Create Order
      </button>
    </form>
  );
};

export default OrderForm;
