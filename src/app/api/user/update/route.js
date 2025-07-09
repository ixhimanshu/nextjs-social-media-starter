import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function PUT(req) {
  console.log("🛠️ Update User API called");

  try {
    const body = await req.json();
    const { userId, name, email, password } = body;

    console.log("✅ Received userId:", userId);

    if (!userId || !name || !email) {
      return NextResponse.json(
        { error: "userId, name and email are required" },
        { status: 400 }
      );
    }

    const client = await dbConnect();
    const db = client.db("ecom");

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateFields = {
      name,
      email,
    };

    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    const updatedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
