export async function deleteInventoryItem(itemId) {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/${itemId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
    return true;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}

export async function addInventoryItem(item) {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error('Failed to add item');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
}
