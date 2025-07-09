import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { search } = body;

    if (!search || !search.trim()) {
      return NextResponse.json({ posts: [] });
    }

    const client = await dbConnect();
    const db = client.db("ecom");

    const posts = await db.collection("posts").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          $or: [
            { caption: { $regex: search, $options: "i" } },
            { "user.name": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
          ],
        },
      },
      { $sort: { created_at: -1 } },
    ]).toArray();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error in /api/user/posts/search:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
