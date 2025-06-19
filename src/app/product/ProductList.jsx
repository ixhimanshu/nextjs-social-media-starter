'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";


export default function ProductList() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    if(localStorage.getItem('token')){
      fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
    } else {
      router.push("/login"); 
    }
    
  }, []);

  // function addToCart(item) {
  //   // Get existing cart from localStorage
  //   const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  //   // Check if item is already in cart (match by _id or id)
  //   const isAlreadyInCart = cart.some(cartItem => cartItem._id === item._id);
  
  //   if (!isAlreadyInCart) {
  //     cart.push(item);
  //     localStorage.setItem('cart', JSON.stringify(cart));
  //     alert('Item added to cart!');
  //   } else {
  //     alert('Item is already in the cart.');
  //   }
  // }

  const handleImageClick = (id) => {
    router.push(`/product/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((p) => (
        <div key={p._id} className="border rounded shadow-md p-4">
          <div className="relative w-full h-48" onClick={() => handleImageClick(p._id)}>
            <Image src={p.images[0]} alt={p.name} fill className="object-cover rounded" />
          </div>
          <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
          <p className="text-sm text-gray-600">{p.description}</p>
          <p className=" font-bold mt-1">₹{p.price}</p>
          <button
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
            style={{ cursor: 'pointer' }}
            onClick={() => addToCart(p)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
