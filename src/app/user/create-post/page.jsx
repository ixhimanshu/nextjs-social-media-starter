'use client';

import { useEffect, useState } from 'react';
import Header from "../../../components/header";


export default function CreatePost() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ caption: '', image_url: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // ✅ new state for user

  // ✅ Fetch posts from API
  const fetchPosts = async () => {
    const res = await fetch('/api/user/posts');
    const data = await res.json();
    setPosts(data.posts || []);
  };

  useEffect(() => {
    fetchPosts();

    // ✅ Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.caption || !form.image_url || !user?._id) return;

    setLoading(true);
    try {
      const res = await fetch("/api/user/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user._id, // ✅ use from localStorage
          image_url: form.image_url,
          caption: form.caption,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPosts([data.post, ...posts]);
        setForm({ caption: '', image_url: '' });
      } else {
        alert(data.error || "Failed to create post");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div> 
     <Header />
     <div className="min-h-screen bg-gray-900 text-white p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 Create MeshUp Post</h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-10 shadow-md">
        <h2 className="text-xl mb-4">{editId ? 'Edit Post' : 'Create New Post'}</h2>
        <div className="space-y-4">
          <input
            className="bg-gray-700 text-white p-2 rounded w-full"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Image URL"
          />
          <textarea
            className="bg-gray-700 text-white p-2 rounded w-full"
            name="caption"
            value={form.caption}
            onChange={handleChange}
            placeholder="Write a caption..."
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full transition"
          >
            {editId ? 'Update Post' : 'Post'}
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">🧾 Your Posts</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white text-black rounded-2xl shadow overflow-hidden">
            <img src={post.image_url} alt="post" className="w-full h-64 object-cover" />
            <div className="p-4">
              <p className="text-base mb-2">{post.caption}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
   
  );
}
