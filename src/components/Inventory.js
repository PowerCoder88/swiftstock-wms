import React, { useState } from 'react';

function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, sku: 'SKU003', name: 'Jacket', category: 'Apparel', quantity: 10 }
  ]);
  const [newItem, setNewItem] = useState({ sku: '', name: '', category: '', quantity: '' });

  function handleDelete(itemId) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== itemId));
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  }

  function handleAddItem() {
    if (newItem.sku && newItem.name && newItem.category && newItem.quantity) {
      setInventory([...inventory, { ...newItem, id: Date.now() }]);
      setNewItem({ sku: '', name: '', category: '', quantity: '' });
    } else {
      alert('Please fill in all fields');
    }
  }

  return (
    <div className="inventory">
      <h1>Inventory Management</h1>
      <div className="add-item-form">
        <input name="sku" value={newItem.sku} onChange={handleInputChange} placeholder="SKU" />
        <input name="name" value={newItem.name} onChange={handleInputChange} placeholder="Name" />
        <input name="category" value={newItem.category} onChange={handleInputChange} placeholder="Category" />
        <input name="quantity" value={newItem.quantity} onChange={handleInputChange} placeholder="Quantity" type="number" />
        <button onClick={handleAddItem} className="add-btn">Add Item</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>NAME</th>
            <th>CATEGORY</th>
            <th>QUANTITY</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;

