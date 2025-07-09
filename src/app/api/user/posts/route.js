import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, image_url, caption } = body;

    if (!user_id || !image_url || !caption) {
      return NextResponse.json(
        { error: "user_id, image_url, and caption are required" },
        { status: 400 }
      );
    }

    const client = await dbConnect();
    const db = client.db("ecom"); // Replace with your DB name

    const post = {
      user_id: new ObjectId(user_id),
      image_url,
      caption,
      likes: [],
      comments: [],
      created_at: new Date(),
    };

    const result = await db.collection("posts").insertOne(post);
    const insertedPost = await db.collection("posts").findOne({ _id: result.insertedId });

    return NextResponse.json({
      message: "Post created successfully",
      post: insertedPost,
    });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     const client = await dbConnect();
//     const db = client.db("ecom");

//     const posts = await db
//       .collection("posts")
//       .find({})
//       .sort({ created_at: -1 })
//       .toArray();

//     return NextResponse.json({ posts });
//   } catch (err) {
//     return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
//   }
// }

export async function GET() {
    try {
      const client = await dbConnect();
      const db = client.db("ecom");
  
      const posts = await db.collection("posts").aggregate([
        {
          $lookup: {
            from: "users", // your user collection
            localField: "user_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true, // Optional: avoid errors
          },
        },
        {
          $sort: { created_at: -1 },
        },
        {
          $project: {
            _id: 1,
            image_url: 1,
            caption: 1,
            likes: 1,
            comments: 1,
            created_at: 1,
            "user._id": 1,
            "user.name": 1,
            "user.email": 1,
          },
        },
      ]).toArray();
  
      return NextResponse.json({ posts });
    } catch (error) {
      console.error("Error fetching posts with user:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
