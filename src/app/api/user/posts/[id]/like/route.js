// /app/api/user/posts/[id]/like/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const { id: postId } = params;
    const { user_id } = await req.json();

    if (!postId || !user_id) {
      return NextResponse.json({ error: "Missing post_id or user_id" }, { status: 400 });
    }

    const client = await dbConnect();
    const db = client.db("ecom");

    const post = await db.collection("posts").findOne({ _id: new ObjectId(postId) });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const hasLiked = post.likes?.some((uid) => uid.toString() === user_id);
    const updateQuery = hasLiked
      ? { $pull: { likes: new ObjectId(user_id) } } // unlike
      : { $addToSet: { likes: new ObjectId(user_id) } }; // like

    await db.collection("posts").updateOne({ _id: new ObjectId(postId) }, updateQuery);

    return NextResponse.json({
      status: true,
      message: hasLiked ? "Unliked post" : "Liked post",
    });
  } catch (err) {
    console.error("Like API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
