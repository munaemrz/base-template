import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function App() {
  const [page, setPage] = useState("enter");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", quantity: "", price: "" });

  const addProduct = () => {
    if (newProduct.name && newProduct.quantity && newProduct.price) {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
      setNewProduct({ name: "", quantity: "", price: "" });
    }
  };

  const addToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity }]);
  };

  const checkout = () => {
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      if (cartItem) {
        return { ...product, quantity: product.quantity - cartItem.quantity };
      }
      return product;
    });
    setProducts(updatedProducts);
    setCart([]);
    setPage("table");
  };

  const resetApp = () => {
    setProducts([]);
    setCart([]);
    setPage("enter");
  };

  const EnterProductPage = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Enter Product Details</h2>
      <Input
        placeholder="Product Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Quantity"
        value={newProduct.quantity}
        onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
      />
      <Input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
      />
      <Button onClick={addProduct}>Add Product</Button>
      {products.length > 0 && (
        <Button onClick={() => setPage("table")}>View Inventory</Button>
      )}
    </div>
  );

  const InventoryTablePage = () => (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Inventory</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Qty"
                  className="w-20 mr-2"
                  onChange={(e) => {
                    if (e.target.value <= product.quantity) {
                      addToCart(product, parseInt(e.target.value));
                    }
                  }}
                />
                <Button onClick={() => addToCart(product, 1)}>Add to Cart</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between">
        <Button onClick={() => setPage("enter")}>Add More Products</Button>
        <Button onClick={() => setPage("checkout")}>Checkout</Button>
        <Button onClick={resetApp}>Reset</Button>
      </div>
    </div>
  );

  const CheckoutPage = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Checkout</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>${item.price * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
        <Button onClick={checkout}>Done</Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-3xl">
      {page === "enter" && <EnterProductPage />}
      {page === "table" && <InventoryTablePage />}
      {page === "checkout" && <CheckoutPage />}
    </div>
  );
}