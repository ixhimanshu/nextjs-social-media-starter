"use client";

import { useState, useEffect } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null); 
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null); 
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  
  useEffect(() => {
    if (cart === null) return; // don't save if cart not loaded yet
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Remove item by id
  function removeItem(id) {
    setCart(cart.filter((item) => item._id !== id));
  }

  // Increase quantity of item
  function increaseQty(id) {
    console.log(`Increasing quantity for item with id: ${id}`);
    
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, qty: (item.qty ? item.qty : 1) + 1 } : item
      )
    );
  }

  // Decrease quantity of item (minimum 1)
  function decreaseQty(id) {
    setCart(
      cart.map((item) =>
        item._id === id && (item.qty ? item.qty : 1) > 1 ? { ...item, qty: (item.qty ? item.qty : 1) - 1 } : item
      )
    );
  }

  // Calculate total order value
  const total = cart ? cart.reduce((acc, item) => acc + item.price * (item.qty ? item.qty : 1), 0) : 0;

  // Handle address form input change
  function handleInputChange(e) {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }

  // Handle Place Order click

  function placeOrder() {
    if (
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    ) {
      alert("Please fill in all address fields");
      return;
    }
    // Save current cart as orderDetails before clearing it
    setOrderDetails(cart);
    setOrderPlaced(true);
  }

  function afterOrderSummary() {
    localStorage.removeItem("cart");
    setCart([]);
    router.push('/user/cart')
  }

  if (orderPlaced) {
    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "center" }}>
        <main className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <section className="mb-6 bg-transparent">
            <h3 className="font-semibold mb-2">Shipping Information</h3>
            <p>{address.fullName}</p>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state} - {address.zip}
            </p>
            <p>Phone: {address.phone}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Order Details</h3>
            <ul>
              {(!cart || cart.length === 0) ? (
                <li>Your cart was empty at order time.</li>
              ) : (
                cart.map((item) => (
                  <li key={item._id} className="mb-1">
                    {item.name} x {(item.qty ? item.qty : 1)} = ₹{item.price * (item.qty ? item.qty : 1)}
                  </li>
                ))
              )}
            </ul>
            <p className="font-bold mt-2">Total: ₹{total}</p>

            <button
            className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded"
            style={{ cursor: 'pointer' }}
            onClick={() => afterOrderSummary()}
          >
            Go to Order Details
          </button>
          </section>
        </main>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", justifyContent: "space-between" }}>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {(!cart || cart.length === 0) ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.images?.[0] || "/placeholder.png"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h2 className="font-semibold">{item.name}</h2>
                      <p>₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 py-1  rounded"
                      onClick={() => decreaseQty(item._id)}
                    >
                      -
                    </button>
                    <span>{item.qty || 1}</span>
                    <button
                      className="px-2 py-1  rounded"
                      onClick={() => increaseQty(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <p className="w-20 text-right font-semibold">
                    ₹{item.price * (item.qty || 1)}
                  </p>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:underline ml-4"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-xl font-bold">Total: ₹{total}</p>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={() => setShowAddressForm(true)}
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {showAddressForm && (
          <section className="mt-8 border p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                placeOrder();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip / Postal Code"
                  value={address.zip}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
              >
                Place Order
              </button>
            </form>
          </section>
        )}
      </main>
      <Footer />
      </div>
    </>
  );
}
