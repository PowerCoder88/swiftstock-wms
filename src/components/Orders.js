import React, { useEffect, useState } from 'react';
import { fetchOrders, fetchInventory } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    async function loadData() {
      const ordersData = await fetchOrders();
      const inventoryData = await fetchInventory();
      setOrders(ordersData);
      setInventory(inventoryData.reduce((acc, item) => {
        acc[item.sku] = item.cost;
        return acc;
      }, {}));
    }
    loadData();
  }, []);

  function calculateOrderCost(order) {
    return order.items.reduce((total, item) => {
      const itemCost = inventory[item.sku] || 0;
      return total + (item.quantity * itemCost);
    }, 0);
  }

  return (
    <div className="orders">
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.items.map(item => `${item.quantity} x ${item.sku}`).join(', ')}</td>
              <td>₹{calculateOrderCost(order).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
