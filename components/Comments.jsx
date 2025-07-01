"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

export default function Comments({ articleId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!articleId) return;
    setLoading(true);
    fetch(`/api/comment?articleId=${articleId}`)
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [articleId]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, text }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setText("");
    } catch (err) {
      setError("Could not post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canPost = session && isValidObjectId(articleId);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {canPost ? (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
          <textarea
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 resize-none min-h-[80px]"
            placeholder="Write your comment..."
            value={text}
            onChange={e => setText(e.target.value)}
            disabled={submitting}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              disabled={submitting || !text.trim()}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      ) : (
        <p className="mb-6 text-gray-500">{!session ? 'Sign in to post a comment.' : 'Comments are only available for published articles.'}</p>
      )}
      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((c) => (
              <li key={c._id || c.createdAt} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-blue-700 dark:text-blue-300">{c.user}</span>
                  <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">{c.text}</p>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
