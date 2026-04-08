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
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#2563eb' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
    padding: '0.1rem',
    borderRadius: '4px',
    color: '#111827',
    cursor: 'pointer',
    width: '100%',
    minWidth: '220px',
    '&:hover': {
      borderColor: state.isFocused ? '#2563eb' : '#9ca3af'
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
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
    backgroundColor: state.isFocused ? '#f3f4f6' : 'transparent',
    color: state.isSelected ? '#2563eb' : '#111827',
    cursor: 'pointer',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    '&:active': {
      backgroundColor: '#e5e7eb'
    }
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#111827',
    fontSize: '0.85rem',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '0.85rem',
  }),
  input: (provided) => ({
    ...provided,
    color: '#111827'
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
