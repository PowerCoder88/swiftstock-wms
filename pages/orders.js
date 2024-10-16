import React, { useState, useEffect } from 'react'



import Head from 'next/head'







export default function Orders() {



  const [orders, setOrders] = useState([])



  const [newOrder, setNewOrder] = useState({ company: '', product: '', quantity: '', status: 'Pending' })



  const [airwayBill, setAirwayBill] = useState(null)











  useEffect(() => {



    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')



    setOrders(savedOrders)



  }, [])







  const handleInputChange = (e) => {



    setNewOrder({ ...newOrder, [e.target.name]: e.target.value })



  }







  const handleSubmit = (e) => {



    e.preventDefault()



    const updatedOrders = [...orders, { ...newOrder, id: Date.now(), date: new Date().toISOString() }]



    setOrders(updatedOrders)



    localStorage.setItem('orders', JSON.stringify(updatedOrders))



    setNewOrder({ company: '', product: '', quantity: '', status: 'Pending' })



  }







  const handleStatusChange = (order, newStatus) => {



    const updatedOrders = orders.map(o => 



      o.id === order.id ? { ...o, status: newStatus } : o



    )



    setOrders(updatedOrders)



    localStorage.setItem('orders', JSON.stringify(updatedOrders))



    if (newStatus === 'Shipped' && order.status !== 'Shipped') {

      generateAirwayBill(order)

    }



  }







  const generateAirwayBill = (order) => {



    const airwayBillNumber = Math.random().toString(36).substr(2, 9).toUpperCase()



    const newAirwayBill = {



      airwayBillNumber,



      orderId: order.id,



      company: order.company,



      product: order.product,



      quantity: order.quantity,



      shippingDate: new Date().toISOString(),



    }



    setAirwayBill(newAirwayBill)



  }







  const downloadAirwayBill = () => {



    if (!airwayBill) return



    const airwayBillContent = `

Airway Bill



Airway Bill Number: ${airwayBill.airwayBillNumber}

Order ID: ${airwayBill.orderId}

Company: ${airwayBill.company}

Product: ${airwayBill.product}

Quantity: ${airwayBill.quantity}

Shipping Date: ${new Date(airwayBill.shippingDate).toLocaleString()}

    `



    const blob = new Blob([airwayBillContent], { type: 'text/plain' })



    const url = URL.createObjectURL(blob)



    const link = document.createElement('a')



    link.download = `airway_bill_${airwayBill.airwayBillNumber}.txt`



    link.href = url



    link.click()



  }







  return (



    <div className="p-6">



      <Head>



        <title>StockSwift - Order Management</title>



        <link rel="icon" href="/favicon.ico" />



      </Head>







      <h1 className="text-3xl font-semibold mb-6 neumorphic-text">Order Management</h1>







      <form onSubmit={handleSubmit} className="mt-4 space-y-4 neumorphic-card">



        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">



          <input



            type="text"



            name="company"



            value={newOrder.company}



            onChange={handleInputChange}



            placeholder="Company"



            className="neumorphic-input"



          />



          <input



            type="text"



            name="product"



            value={newOrder.product}



            onChange={handleInputChange}



            placeholder="Product"



            className="neumorphic-input"



          />



          <input



            type="number"



            name="quantity"



            value={newOrder.quantity}



            onChange={handleInputChange}



            placeholder="Quantity"



            className="neumorphic-input"



          />



          <select



            name="status"



            value={newOrder.status}



            onChange={handleInputChange}



            className="neumorphic-input"



          >



            <option value="Pending">Pending</option>



            <option value="Shipped">Shipped</option>



            <option value="Delivered">Delivered</option>



          </select>



        </div>



        <button type="submit" className="neumorphic-button">



          Add Order



        </button>



      </form>







      <div className="mt-8">



        <div className="neumorphic-card">



          <table className="neumorphic-table">



            <thead>



              <tr>



                <th className="neumorphic-text">Date</th>



                <th className="neumorphic-text">Company</th>



                <th className="neumorphic-text">Product</th>



                <th className="neumorphic-text">Quantity</th>



                <th className="neumorphic-text">Status</th>



                <th className="neumorphic-text">Actions</th>



              </tr>



            </thead>



            <tbody>



              {orders.map((order) => (



                <tr key={order.id}>



                  <td className="neumorphic-text">{new Date(order.date).toLocaleDateString()}</td>



                  <td className="neumorphic-text">{order.company}</td>



                  <td className="neumorphic-text">{order.product}</td>



                  <td className="neumorphic-text">{order.quantity}</td>



                  <td className="neumorphic-text">{order.status}</td>



                  <td>



                    <select



                      value={order.status}



                      onChange={(e) => handleStatusChange(order, e.target.value)}



                      className="neumorphic-input"



                    >



                      <option value="Pending">Pending</option>



                      <option value="Shipped">Shipped</option>



                      <option value="Delivered">Delivered</option>



                    </select>



                  </td>



                </tr>



              ))}



            </tbody>



          </table>



        </div>



      </div>



      {airwayBill && (

        <div className="mt-8 neumorphic-card">

          <h2 className="text-xl font-semibold mb-4 neumorphic-text">Airway Bill Generated</h2>

          <p className="neumorphic-text">Airway Bill Number: {airwayBill.airwayBillNumber}</p>

          <p className="neumorphic-text">Order ID: {airwayBill.orderId}</p>

          <p className="neumorphic-text">Company: {airwayBill.company}</p>

          <p className="neumorphic-text">Product: {airwayBill.product}</p>

          <p className="neumorphic-text">Quantity: {airwayBill.quantity}</p>

          <p className="neumorphic-text">Shipping Date: {new Date(airwayBill.shippingDate).toLocaleString()}</p>

          <button onClick={downloadAirwayBill} className="mt-4 neumorphic-button">

            Download Airway Bill

          </button>

        </div>

      )}



    </div>



  )



}






