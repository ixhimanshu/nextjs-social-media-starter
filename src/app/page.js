// src/app/page.js

import Header from "../components/header";
import Footer from "../components/footer";
import ProductsPage from "../app/product/page";


export default function HomePage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {/* <h1 className="text-3xl font-bold mb-6">Featured Products</h1> */}
        <ProductsPage />
      </main>
      <Footer />
    </>
  );
}
