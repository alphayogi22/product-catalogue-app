import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);

  const apiBase = 'https://localhost:44311/api/products'; // Replace with your API URL

  useEffect(() => {
    fetch(apiBase)
      .then(res => {
        console.log("API status:", res.status);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Fetched products:", data);
        setProducts(data);
      })
      .catch(err => console.error("Fetch failed:", err));
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditMode(true);
      setCurrentId(product.id);
      setFormName(product.name);
      setFormPrice(product.price);
    } else {
      setEditMode(false);
      setFormName('');
      setFormPrice(0);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentId(null);
  };

  const handleSubmit = () => {
    if (!formName || formPrice <= 0) {
      alert("Enter valid name and price");
      return;
    }
    const payload = { name: formName, price: formPrice };

    if (editMode && currentId) {
      fetch(`${apiBase}/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentId, ...payload })
      })
        .then(() => {
          setProducts(prev =>
            prev.map(p => p.id === currentId ? { ...p, ...payload } : p)
          );
          closeModal();
        })
        .catch(err => console.error("Update failed:", err));
    } else {
      fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          setProducts(prev => [...prev, data]);
          closeModal();
        })
        .catch(err => console.error("Create failed:", err));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this product?")) {
      fetch(`${apiBase}/${id}`, { method: 'DELETE' })
        .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
        .catch(err => console.error("Delete failed:", err));
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Product List</h2>
      <button onClick={() => openModal()} style={{ marginBottom: '1rem' }}>
        ➕ Add Product
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{p.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>${p.price}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button onClick={() => openModal(p)}>✏ Edit</button>{' '}
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>🗑 Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '8px', minWidth: '300px'
          }}>
            <h3>{editMode ? 'Edit Product' : 'Add Product'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
            />
            <input
              type="number"
              placeholder="Price"
              value={formPrice}
              onChange={e => setFormPrice(parseFloat(e.target.value))}
              style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
            />
            <button onClick={handleSubmit} style={{ marginRight: '0.5rem' }}>💾 Save</button>
            <button onClick={closeModal}>❌ Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
