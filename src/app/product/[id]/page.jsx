import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import Image from 'next/image';
import Header from '../../../components/header';

export default async function ProductDetail({ params }) {
  const { id } = params;

  const client = await clientPromise;
  const db = client.db('ecom');

  let product = null;

  try {
    product = await db
      .collection('products')
      .findOne({ _id: new ObjectId(id) });
  } catch (e) {
    console.error("Error fetching product:", e);
  }

  if (!product) {
    return <h1 className="text-center mt-10 text-2xl text-red-600">Product Not Found</h1>;
  }

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-5 mt-5 text-center">{product.name}</h1>

        {product.images && product.images.length > 0 && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        )}

        <p className="mb-4 text-center">{product.description}</p>
        {/* <p className="mb-2 text-center">Category: {product.category}</p> */}
        <p className="text-green-600 text-center font-bold text-lg mb-8 mt-8">₹{product.price}</p>
      </div>
    </>
  );
}
