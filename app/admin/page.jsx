"use client";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = "admin@example.com"; // <-- Set your admin email here

function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

function isAdmin() {
  // Check for admin_auth cookie
  if (typeof document === "undefined") return false;
  return document.cookie.includes("admin_auth=true");
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAdmin());
  }, []);

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }
  // Render a client component for dashboard interactivity
  return <AdminDashboard />;
}

function logout() {
  // Remove the admin_auth cookie by setting it to expired
  document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.reload();
}

function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Fetch articles
  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/article");
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load articles.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this article?")) return;
    try {
      const res = await fetch(`/api/article?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setArticles(articles.filter(a => a._id !== id));
    } catch {
      alert("Failed to delete article.");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error();
      setTopic("");
      fetchArticles();
    } catch {
      setError("Failed to create article.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </header>
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Article</h2>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded"
              placeholder="Enter topic..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={creating}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              disabled={creating || !topic.trim()}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">All Articles</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-gray-500">No articles found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Slug</th>
                    <th className="p-2 text-left">Created At</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-2">{article.title}</td>
                      <td className="p-2">{article.slug}</td>
                      <td className="p-2">{article.createdAt ? new Date(article.createdAt).toLocaleString() : ""}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
