import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [newOrder, setNewOrder] = useState({ customerName: '', product: '', quantity: '' })
  const [userType, setUserType] = useState('')
  const [userCompany, setUserCompany] = useState('')

  useEffect(() => {
    // Load orders from localStorage on component mount
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(savedOrders)
    
    // Get user type and company from localStorage
    const type = localStorage.getItem('userType')
    const company = localStorage.getItem('userCompany')
    setUserType(type)
    setUserCompany(company)
  }, [])

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const order = {
      id: Date.now(),
      ...newOrder,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      company: userCompany
    }
    const updatedOrders = [...orders, order]
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    setNewOrder({ customerName: '', product: '', quantity: '' })
  }

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const filteredOrders = userType === 'client' 
    ? orders.filter(order => order.company === userCompany)
    : orders

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Customer Name,Product,Quantity,Status,Date,Company\n"
      + filteredOrders.map(order => `${order.id},${order.customerName},${order.product},${order.quantity},${order.status},${order.date},${order.company}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "orders.csv")
    document.body.appendChild(link)
    link.click()
  }

  return (
    <div>
      <Head>
        <title>StockSwift - Orders</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
      
      {userType === 'client' && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text"
              name="customerName"
              value={newOrder.customerName}
              onChange={handleInputChange}
              placeholder="Customer Name"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              name="product"
              value={newOrder.product}
              onChange={handleInputChange}
              placeholder="Product"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
            <input
              type="number"
              name="quantity"
              value={newOrder.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Order
          </button>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Order List</h2>
        <div className="mt-4 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      {userType === 'developer' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>}
                      {userType === 'developer' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        {userType === 'developer' && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.company}</td>}
                        {userType === 'developer' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={downloadCSV}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Download Orders CSV
      </button>
    </div>
  )
}
