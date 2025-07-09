import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const client = await dbConnect();
    const db = client.db('ecom');

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'User registered successfully',
      userId: result.insertedId,
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
