import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { CubeIcon, ClipboardDocumentListIcon, TruckIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Home() {
  const [stats, setStats] = useState([])
  const [chartData, setChartData] = useState(null)
  const [userType, setUserType] = useState('')
  const [userCompany, setUserCompany] = useState('')
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = () => {
      const inventory = JSON.parse(localStorage.getItem('inventory') || '[]')
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const type = localStorage.getItem('userType')
      const company = localStorage.getItem('userCompany')
      setUserType(type)
      setUserCompany(company)

      let filteredOrders = orders
      if (type === 'client') {
        filteredOrders = orders.filter(order => order.company === company)
      }

      const totalInventory = inventory.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)
      const pendingOrders = filteredOrders.filter(order => order.status === 'Pending').length
      const shippedOrders = filteredOrders.filter(order => order.status === 'Shipped').length
      const deliveredOrders = filteredOrders.filter(order => order.status === 'Delivered').length
      const shippedToday = filteredOrders.filter(order => 
        order.status === 'Shipped' && 
        new Date(order.date).toDateString() === new Date().toDateString()
      ).length
      const lowStockItems = inventory.filter(item => parseInt(item.quantity || 0) < 10).length

      setStats([
        { name: 'Total Inventory', stat: totalInventory.toString(), icon: CubeIcon },
        { name: 'Pending Orders', stat: pendingOrders.toString(), icon: ClipboardDocumentListIcon },
        { name: 'Shipped Today', stat: shippedToday.toString(), icon: TruckIcon },
        { name: 'Low Stock Items', stat: lowStockItems.toString(), icon: ChartBarIcon },
        { name: 'Delivered Orders', stat: deliveredOrders.toString(), icon: TruckIcon },
      ])

      setChartData({
        labels: ['Total Inventory', 'Pending Orders', 'Shipped Orders', 'Delivered Orders'],
        datasets: [
          {
            data: [totalInventory, pendingOrders, shippedOrders, deliveredOrders],
            backgroundColor: ['#4F46E5', '#EF4444', '#F59E0B', '#10B981'],
            hoverBackgroundColor: ['#4338CA', '#DC2626', '#D97706', '#059669'],
          },
        ],
      })
    }
    fetchDashboardData()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate an API call or data loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Data loaded successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Loading error:', err);
        setError(err.message);
      }
    };

    loadData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading... (This message is from the React component)</div>;
  }

  return (
    <div className="p-6">
      <Head>
        <title>StockSwift - Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-semibold mb-6 neumorphic-text">Dashboard</h1>
      <div className="mt-4">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <div key={item.name} className="neumorphic-card">
              <dt>
                <div className="absolute rounded-md p-3 neumorphic-icon">
                  <item.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate neumorphic-text">{item.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold neumorphic-text">{item.stat}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
      
      {chartData && (
        <div className="mt-8 neumorphic-card">
          <h2 className="text-xl font-semibold mb-4 neumorphic-text">Inventory and Order Status</h2>
          <div style={{ height: '300px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <Pie data={chartData} options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }} />
          </div>
        </div>
      )}
    </div>
  )
}
