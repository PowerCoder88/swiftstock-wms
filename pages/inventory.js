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
    <div>
      <Head>
        <title>StockSwift - Inventory Management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <input
            type="text"
            name="sku"
            value={newItem.sku}
            onChange={handleInputChange}
            placeholder="SKU"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="quantity"
            value={newItem.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="unitCost"
            value={newItem.unitCost}
            onChange={handleInputChange}
            placeholder="Unit Cost (₹)"
            step="0.01"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Item
        </button>
      </form>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost (₹)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category || ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{(item.unitCost || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
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
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Upload CSV</h2>
        <div className="mt-2 flex items-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="mr-4"
          />
          <button
            onClick={processCsvFile}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload and Process CSV
          </button>
        </div>
      </div>

      <button
        onClick={downloadCSV}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Download Inventory CSV
      </button>
    </div>
  )
}
