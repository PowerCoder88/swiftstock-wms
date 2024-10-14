import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Reports() {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    // Load data from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]')
    setOrders(savedOrders)
    setInventory(savedInventory)
  }, [])

  const getTotalOrders = () => orders.length
  const getTotalRevenue = () => orders.reduce((sum, order) => sum + (order.quantity * 10), 0) // Assuming $10 per item
  const getTopSellingProduct = () => {
    const productCounts = orders.reduce((acc, order) => {
      acc[order.product] = (acc[order.product] || 0) + parseInt(order.quantity)
      return acc
    }, {})
    return Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  }
  const getLowStockItems = () => inventory.filter(item => item.quantity < 10).length

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Orders,${getTotalOrders()}\n`
      + `Total Revenue,$${getTotalRevenue()}\n`
      + `Top Selling Product,${getTopSellingProduct()}\n`
      + `Low Stock Items,${getLowStockItems()}`
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "report.csv")
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div>
      <Head>
        <title>StockSwift - Reports</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{getTotalOrders()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${getTotalRevenue()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Top Selling Product</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{getTopSellingProduct()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{getLowStockItems()}</dd>
          </div>
        </div>
      </div>

      <button
        onClick={downloadCSV}
        className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Download Report CSV
      </button>
    </div>
  )
}
