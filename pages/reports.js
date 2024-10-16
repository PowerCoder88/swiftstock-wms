import React, { useState, useEffect } from 'react'

import Head from 'next/head'

import { Bar } from 'react-chartjs-2'

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)



export default function Reports() {

  const [inventoryData, setInventoryData] = useState(null)

  const [orderData, setOrderData] = useState(null)

  const [inventory, setInventory] = useState([])

  const [orders, setOrders] = useState([])



  useEffect(() => {

    const inventoryItems = JSON.parse(localStorage.getItem('inventory') || '[]')

    const orderItems = JSON.parse(localStorage.getItem('orders') || '[]')

    setInventory(inventoryItems)

    setOrders(orderItems)

    // Prepare inventory data

    const categories = [...new Set(inventoryItems.map(item => item.category))]

    const inventoryByCategory = categories.map(category => {

      return inventoryItems.filter(item => item.category === category).reduce((sum, item) => sum + parseInt(item.quantity), 0)

    })



    setInventoryData({

      labels: categories,

      datasets: [

        {

          label: 'Inventory by Category',

          data: inventoryByCategory,

          backgroundColor: 'rgba(75, 192, 192, 0.6)',

        },

      ],

    })

    // Prepare order data

    const orderStatuses = ['Pending', 'Shipped', 'Delivered']

    const ordersByStatus = orderStatuses.map(status => {

      return orderItems.filter(order => order.status === status).length

    })



    setOrderData({

      labels: orderStatuses,

      datasets: [

        {

          label: 'Orders by Status',

          data: ordersByStatus,

          backgroundColor: 'rgba(153, 102, 255, 0.6)',

        },

      ],

    })

  }, [])



  const options = {

    responsive: true,

    plugins: {

      legend: {

        position: 'top',

      },

      title: {

        display: true,

        text: 'Inventory and Order Reports',

      },

    },

  }



  const downloadInventoryCSV = () => {

    const csvContent = "data:text/csv;charset=utf-8," 
      + "SKU,Name,Category,Quantity,Unit Cost (₹)\n"
      + inventory.map(item => `${item.sku},${item.name},${item.category},${item.quantity},${item.unitCost}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  const downloadOrdersCSV = () => {

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Company,Product,Quantity,Status\n"
      + orders.map(order => `${new Date(order.date).toLocaleDateString()},${order.company},${order.product},${order.quantity},${order.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (

    <div className="p-6">

      <Head>

        <title>StockSwift - Reports</title>

        <link rel="icon" href="/favicon.ico" />

      </Head>



      <h1 className="text-3xl font-semibold mb-6 neumorphic-text">Reports</h1>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="neumorphic-card">

          <h2 className="text-xl font-semibold mb-4 neumorphic-text">Inventory by Category</h2>

          {inventoryData && (

            <Bar options={options} data={inventoryData} />

          )}

          <button onClick={downloadInventoryCSV} className="mt-4 neumorphic-button">

            Download Inventory CSV

          </button>

        </div>



        <div className="neumorphic-card">

          <h2 className="text-xl font-semibold mb-4 neumorphic-text">Orders by Status</h2>

          {orderData && (

            <Bar options={options} data={orderData} />

          )}

          <button onClick={downloadOrdersCSV} className="mt-4 neumorphic-button">

            Download Orders CSV

          </button>

        </div>

      </div>

    </div>

  )

}


