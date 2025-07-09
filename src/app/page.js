// src/app/page.js

import Header from "../components/header";
import Footer from "../components/footer";
import ProductsPage from "../app/product/page";


export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-300">
        {/* <h1 className="text-3xl font-bold mb-6">Featured Products</h1> */}
        <ProductsPage />
      </main>
      <Footer />
    </>
  );
}
