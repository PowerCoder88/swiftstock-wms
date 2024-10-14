import React, { useEffect, useState } from 'react';
import { fetchInventory, fetchOrders } from '../services/api';

function Dashboard() {
  const [inventoryData, setInventoryData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const inventory = await fetchInventory();
      const orders = await fetchOrders();
      setInventoryData(inventory);
      setOrdersData(orders);
    }
    fetchData();
  }, []);

  const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
  const totalInventory = inventoryData.length;
  const shippedToday = ordersData.filter(order => 
    order.status === 'shipped' && 
    new Date(order.shippedDate).toDateString() === new Date().toDateString()
  ).length;
  const lowStockItems = inventoryData.filter(item => item.quantity < item.lowStockThreshold).length;
  const deliveredOrders = ordersData.filter(order => order.status === 'delivered').length;

  const totalInventoryCost = inventoryData.reduce((total, item) => total + (item.quantity * item.cost), 0);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-cards">
        <DashboardCard title="Total Inventory" value={totalInventory} icon="box" />
        <DashboardCard title="Pending Orders" value={pendingOrders} icon="clock" />
        <DashboardCard title="Shipped Today" value={shippedToday} icon="truck" />
        <DashboardCard title="Low Stock Items" value={lowStockItems} icon="exclamation-triangle" />
        <DashboardCard title="Delivered Orders" value={deliveredOrders} icon="check-circle" />
      </div>
      <div className="inventory-summary">
        <h2>Inventory Summary</h2>
        <p>Total Inventory Cost: ₹{totalInventoryCost.toFixed(2)}</p>
        {/* Add a pie chart or other visualization here */}
      </div>
    </div>
  );
}

export default Dashboard;
