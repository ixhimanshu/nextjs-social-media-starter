"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Header() {
  const { cart } = useCart();
  const [isLogin, setLogin] = useState(false);
  const [userName, setUserName] = useState('');

  const router = useRouter();

  useEffect( () => {
    if(localStorage.getItem("token")){
      setLogin(true);
      setUserName(JSON.parse(localStorage.getItem("user")).name);
    }
  },[])

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login"); // redirect to login page
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">BlinkMe</Link>

        <nav className="space-x-6 text-gray-700 font-medium flex items-center">
          {/* <Link href="/product" className="hover:text-indigo-600">Products</Link> */}
          <Link href="/user/profile" className="hover:text-indigo-600">Profile</Link>
          
          <Link href="/cart" className="hover:text-indigo-600 relative">
            Cart
            {cart.length > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
          {!isLogin ? <Link href="/login" className="hover:text-indigo-600">Login</Link> :
            <div>
              <span className="text-gray-800 text-sm  mr-2">
              ({userName})
              </span>
              <button
                onClick={onLogout}
                className="hover:text-indigo-600 text-left"
              >
                Logout
              </button>
            </div>
    }
        </nav>
      </div>
    </header>
  );
}
