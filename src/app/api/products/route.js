import { NextResponse } from 'next/server';
import getClient from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await getClient();
    const db = client.db('ecom');

    const products = await db.collection('products').find({}).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await getClient();
    const db = client.db('ecom');
    const data = await req.json();

    const result = await db.collection('products').insertOne(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const client = await getClient();
    const db = client.db('ecom');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const data = await req.json();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const client = await getClient();
    const db = client.db('ecom');
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
