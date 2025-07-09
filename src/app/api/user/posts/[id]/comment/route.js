// /app/api/user/posts/[id]/comment/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const body = await req.json();
    const { user_id, content } = body;
    const post_id = params.id;

    if (!post_id || !user_id || !content) {
      return NextResponse.json(
        { error: "post_id, user_id, and content are required" },
        { status: 400 }
      );
    }

    const client = await dbConnect();
    const db = client.db("ecom");

    const comment = {
      user_id: new ObjectId(user_id),
      content,
      created_at: new Date(),
    };

    const result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(post_id) },
        { $push: { comments: comment } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Post not found or unchanged" }, { status: 404 });
    }

    return NextResponse.json({ status: true, message: "Comment added successfully" });
  } catch (err) {
    console.error("Comment API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
