"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Plus, MessageCircle, Tag, Heart, Share2, ArrowLeft, Home, Search as SearchIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect, useRef, Suspense } from "react"
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import  AuthButton  from "@/components/auth/authBottons";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import ClientFormattedDate from "@/components/ClientFormattedDate";
import SearchBar from "@/components/SearchBar";

// CommentCount component to fetch and display the number of comments for each article
function CommentCount({ articleId }) {
  if (!isValidObjectId(articleId)) return null;

  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!articleId) return;
    fetch(`/api/comment?articleId=${articleId}`)
      .then(res => res.json())
      .then(data => setCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setCount(0));
  }, [articleId]);
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
      <MessageCircle className="w-4 h-4" /> {count}
    </span>
  );
}

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();


  // Fetch articles from DB
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/article");
      if (res.ok) {
        const data = await res.json();
        // Map DB articles to blogPosts format
        const dbPosts = Array.isArray(data)
          ? data.map((a) => ({
              id: a._id,
              slug: a.slug || a._id,
              title: a.title,
              excerpt: a.meta?.description || "",
              publishDate: a.createdAt || a.publishDate || new Date().toISOString(),
              readTime: a.readTime || "5 min read",
              category: a.category || "General",
              content: a.content || "",
            }))
          : [];
        setBlogPosts(dbPosts);
      }
    } catch (e) {
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [session]);

  // Generate article: POST to API, then re-fetch
  const handleGenerateArticle = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error("Failed to generate article");
      setTopic("");
      setShowForm(false);
      await fetchArticles(); // Re-fetch from DB
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your API setup.");
    } finally {
      setGenerating(false);
    }
  };

  // Filtered blog posts based on debounced search term
  const filteredBlogPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    post.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to TrendWise</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Sign in to generate, view, and comment on AI-powered trending blogs.</p>
        <AuthButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TrendWise</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Suspense fallback={<div className="w-40 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}> 
                <SearchBar onSearch={setDebouncedSearch} />
              </Suspense>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Insights & Trends</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay ahead of the curve with our curated collection of articles on technology, design, and innovation.
            </p>
            {/* Generate Article Button / Form */}
            <div className="mt-6">
              {!showForm ? (
                <Button
                  onClick={() => setShowForm(true)}
                  className="gap-2"
                >
                  <Plus size={18} />
                  Generate New Article
                </Button>
              ) : (
                <form onSubmit={handleGenerateArticle} className="mt-4 max-w-md mx-auto">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="topic" className="sr-only">Article Topic</label>
                      <input
                        id="topic"
                        type="text"
                        placeholder="Enter article topic (e.g., 'AI in Healthcare')"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={generating}
                      />
                      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setTopic('');
                          setError(null);
                        }}
                        disabled={generating}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={generating || !topic.trim()}
                      >
                        {generating ? 'Generating...' : 'Generate Article'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          {/* Articles Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></span>
              <span className="ml-4 text-lg text-gray-500 dark:text-gray-300">Loading articles...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogPosts.length > 0 ? (
                filteredBlogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  >
                    {/* Article Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {post.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Link href={`/blog/${post.slug || post.id}`} className="block">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                      {/* Comment Count */}
                      <CommentCount articleId={post.id} />
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        <ClientFormattedDate dateString={post.publishDate} />
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">
                  No articles found matching your search.
                </div>
              )}
            </div>
          )}
          {/* Load More Button */}
          {filteredBlogPosts.length < blogPosts.length && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p>&copy; 2024 TrendWise. All rights reserved.</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Made by Asmith Jitendra Mahendrakar</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
