'use client';

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function PostList({ initialPosts = [] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [user, setUser] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [likeLoading, setLikeLoading] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('time');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleLike = async (postId) => {
    if (!user) return;
    setLikeLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/user/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user._id }),
      });
      if (res.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  likes: p.likes.includes(user._id)
                    ? p.likes.filter((id) => id !== user._id)
                    : [...p.likes, user._id],
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Like failed', err);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleAddComment = async (postId) => {
    if (!user || !commentInputs[postId]?.trim()) return;
    setCommentLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`/api/user/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user._id,
          content: commentInputs[postId],
        }),
      });
      if (res.ok) {
        const newComment = {
          user_id: { name: user.name },
          content: commentInputs[postId],
          created_at: new Date().toISOString(),
        };
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? { ...p, comments: [...p.comments, newComment] }
              : p
          )
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Comment failed', err);
    } finally {
      setCommentLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const hasLiked = (post) => post.likes?.includes(user?._id);

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm.trim()) {
      setPosts(originalPosts);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await fetch('/api/user/posts/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: searchTerm }),
      });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const sorted = [...posts].sort((a, b) => {
      if (value === 'popularity') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    setPosts(sorted);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto mt-5">
      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by caption, username or email"
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="flex-1 p-3 rounded border bg-white text-black border-gray-300"
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-gray-800 text-white px-4 py-2 rounded"
            disabled={searchLoading}
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <select
          value={sortBy}
          onChange={handleSortChange}
          className="p-2 border border-gray-300 rounded text-black bg-white"
        >
          <option value="time">Sort by Time</option>
          <option value="popularity">Sort by Popularity</option>
        </select>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl shadow overflow-hidden border border-gray-200"
          >
            <img
              src={post.image_url}
              alt="post"
              className="w-full max-h-[600px] object-cover"
            />
            <div className="p-4">
              <p className="text-gray-800 text-base mb-2 font-semibold">
                {post.user?.name || 'Unknown User'}{' '}
                <span className="text-sm text-gray-500">
                  ({post.user?.email || 'unknown'})
                </span>
              </p>
              <p className="text-gray-800 text-base mb-3">{post.caption}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{post.likes?.length || 0} likes</span>
                <span>{formatDistanceToNow(new Date(post.created_at))} ago</span>
              </div>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => handleLike(post._id)}
                  disabled={likeLoading[post._id]}
                  className={`text-sm font-medium ${
                    hasLiked(post) ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {likeLoading[post._id] ? '❤️...' : `❤️ ${hasLiked(post) ? 'Unlike' : 'Like'}`}
                </button>
                <span className="text-sm text-gray-600">
                  💬 {post.comments?.length || 0} comments
                </span>
              </div>
              {post.comments?.length > 0 && (
                <div className="space-y-2 mb-3 text-sm text-gray-800">
                  {post.comments.map((cmt, idx) => (
                    <div key={idx} className="bg-gray-100 p-2 rounded">
                      <strong className="text-gray-700">
                        {cmt.user_id?.name || 'User'}:
                      </strong>{' '}
                      {cmt.content}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post._id] || ''}
                  onChange={(e) =>
                    handleCommentChange(post._id, e.target.value)
                  }
                  className="w-full border border-gray-300 text-black p-2 rounded"
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  disabled={commentLoading[post._id]}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  {commentLoading[post._id] ? '...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
