import InstagramPostList from './PostList';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';



export default async function Page() {
  const client = await dbConnect();
  const db = client.db('ecom');

  const posts = await db
    .collection('posts')
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
      { $sort: { created_at: -1 } },
      {
        $project: {
          _id: 1,
          image_url: 1,
          caption: 1,
          likes: 1,
          comments: 1,
          created_at: 1,
          'user._id': 1,
          'user.name': 1,
          'user.email': 1,
        },
      },
    ])
    .toArray();

  return <InstagramPostList initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
