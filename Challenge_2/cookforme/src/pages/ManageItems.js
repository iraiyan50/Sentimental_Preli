import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';  // Ensure correct path to Firebase config

const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");  // State to hold the new item input

  // Fetch items from Firestore
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(db, "Items"));
    const fetchedItems = querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
    setItems(fetchedItems);
  };

  // Add a new item to Firestore
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      await addDoc(collection(db, "Items"), { name: newItem });
      setNewItem("");  // Clear the input field after adding
      fetchItems();  // Refresh the list after adding the item
    }
  };

  // Remove an item from Firestore
  const removeItem = async (id) => {
    await deleteDoc(doc(db, "Items", id));  // Delete the document by ID
    fetchItems();  // Refresh the list after deleting
  };

  useEffect(() => {
    fetchItems();  // Fetch items when the component mounts
  }, []); 

  return (
    <div>
      <h1>Available Items</h1>

      {/* Form to add a new item */}
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button type="submit">Add Item</button>
      </form>

      {/* Display the list of items */}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageItems;
