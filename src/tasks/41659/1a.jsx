import React, { useState } from 'react';
import { Button, Input, Table } from "@/components/ui";

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', price: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState('input');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addProduct = () => {
    if (formData.name && formData.quantity && formData.price) {
      setProducts(prev => [...prev, { ...formData, id: Date.now() }]);
      setFormData({ name: '', quantity: '', price: '' });
      setPage('table');
    }
  };

  const selectForCheckout = (product) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const checkout = () => {
    setPage('checkout');
  };

  const processCheckout = () => {
    const updatedProducts = products.map(product => {
      const checkoutItem = selectedItems.find(item => item.id === product.id);
      if (checkoutItem) {
        return { ...product, quantity: product.quantity - checkoutItem.quantity };
      }
      return product;
    });
    setProducts(updatedProducts.filter(p => p.quantity > 0));
    setSelectedItems([]);
    setPage('table');
  };

  const reset = () => {
    setProducts([]);
    setPage('input');
  };

  const renderInputPage = () => (
    <div className="container mx-auto p-4 sm:p-6 space-y-4">
      <Input 
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Product Name"
      />
      <Input 
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleInputChange}
        placeholder="Quantity"
      />
      <Input 
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Price"
      />
      <Button onClick={addProduct}>Add Product</Button>
    </div>
  );

  const renderTablePage = () => (
    <div className="container mx-auto p-4 sm:p-6">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Quantity</Table.Head>
            <Table.Head>Price</Table.Head>
            <Table.Head>Action</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map(product => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.quantity}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => selectForCheckout(product)}>Select</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="mt-4">
        <Button onClick={checkout}>Checkout</Button>
        <Button onClick={reset} className="ml-2">Reset</Button>
      </div>
    </div>
  );

  const renderCheckoutPage = () => (
    <div className="container mx-auto p-4 sm:p-6">
      <h2 className="text-xl mb-4">Checkout</h2>
      <ul>
        {selectedItems.map(item => (
          <li key={item.id}>{item.name} x {item.quantity} - Total: ${item.quantity * item.price}</li>
        ))}
      </ul>
      <p>Total: ${selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0)}</p>
      <Button onClick={processCheckout}>Done</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {page === 'input' && renderInputPage()}
      {page === 'table' && renderTablePage()}
      {page === 'checkout' && renderCheckoutPage()}
    </div>
  );
}

export default App;