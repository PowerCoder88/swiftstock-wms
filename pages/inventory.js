import React, { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Inventory() {
  const [inventory, setInventory] = useState([])
  const [newItem, setNewItem] = useState({ sku: '', name: '', category: '', quantity: '', unitCost: '' })
  const [csvFile, setCsvFile] = useState(null)

  useEffect(() => {
    // Load inventory from localStorage on component mount
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '[]')
    setInventory(savedInventory)
  }, [])

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedInventory = [...inventory, { ...newItem, id: Date.now(), unitCost: parseFloat(newItem.unitCost) }]
    setInventory(updatedInventory)
    localStorage.setItem('inventory', JSON.stringify(updatedInventory))
    setNewItem({ sku: '', name: '', category: '', quantity: '', unitCost: '' })
  }

  const handleCsvUpload = (e) => {
    const file = e.target.files[0]
    setCsvFile(file)
  }

  const processCsvFile = () => {
    if (!csvFile) {
      alert('Please select a CSV file first')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const lines = content.split('\n')
      const newInventory = lines.slice(1).map((line, index) => {
        const [sku, name, category, quantity, unitCost] = line.split(',')
        return { id: Date.now() + index, sku, name, category, quantity: parseInt(quantity), unitCost: parseFloat(unitCost) }
      })
      const updatedInventory = [...inventory, ...newInventory]
      setInventory(updatedInventory)
      localStorage.setItem('inventory', JSON.stringify(updatedInventory))
    }
    reader.readAsText(csvFile)
  }

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "SKU,Name,Category,Quantity,Unit Cost (₹)\n"
      + inventory.map(item => `${item.sku},${item.name},${item.category},${item.quantity},${item.unitCost}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedInventory = inventory.filter(item => item.id !== id)
      setInventory(updatedInventory)
      localStorage.setItem('inventory', JSON.stringify(updatedInventory))
    }
  }

  return (
    <div className="p-6">
      <Head>
        <title>StockSwift - Inventory Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-semibold mb-6 neumorphic-text">Inventory Management</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 neumorphic-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <input
            type="text"
            name="sku"
            value={newItem.sku}
            onChange={handleInputChange}
            placeholder="SKU"
            className="neumorphic-input"
          />
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="neumorphic-input"
          />
          <input
            type="text"
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="neumorphic-input"
          />
          <input
            type="number"
            name="quantity"
            value={newItem.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            className="neumorphic-input"
          />
          <input
            type="number"
            name="unitCost"
            value={newItem.unitCost}
            onChange={handleInputChange}
            placeholder="Unit Cost (₹)"
            step="0.01"
            className="neumorphic-input"
          />
        </div>
        <button
          type="submit"
          className="neumorphic-button"
        >
          Add Item
        </button>
      </form>

      <div className="mt-8">
        <div className="neumorphic-card">
          <table className="neumorphic-table">
            <thead>
              <tr>
                <th className="neumorphic-text">SKU</th>
                <th className="neumorphic-text">Name</th>
                <th className="neumorphic-text">Category</th>
                <th className="neumorphic-text">Quantity</th>
                <th className="neumorphic-text">Unit Cost (₹)</th>
                <th className="neumorphic-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="neumorphic-text">{item.sku || ''}</td>
                  <td className="neumorphic-text">{item.name || ''}</td>
                  <td className="neumorphic-text">{item.category || ''}</td>
                  <td className="neumorphic-text">{item.quantity || 0}</td>
                  <td className="neumorphic-text">
                    ₹{(item.unitCost || 0).toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="neumorphic-button text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 neumorphic-card">
        <h2 className="text-lg font-medium mb-4 neumorphic-text">Upload CSV</h2>
        <div className="flex items-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="mr-4 neumorphic-input"
          />
          <button
            onClick={processCsvFile}
            className="neumorphic-button"
          >
            Upload and Process CSV
          </button>
        </div>
      </div>

      <button
        onClick={downloadCSV}
        className="mt-4 neumorphic-button"
      >
        Download Inventory CSV
      </button>
    </div>
  )
}
