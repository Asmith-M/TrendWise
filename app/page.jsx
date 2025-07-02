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

// Sample detailed content for articles (keeping your existing structure)
const articleDetails = {
  1: {
    metaDescription: "Explore the latest trends shaping the web development landscape, from AI integration to progressive web apps and beyond.",
    author: {
      name: "Tech Insider",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Technology writer with 5+ years of experience covering web development trends",
    },
    content: `
      <p>The web development landscape is constantly evolving, and 2024 has brought some exciting new trends that are reshaping how we build and interact with web applications. From AI-powered development tools to advanced progressive web apps, let's explore what's driving the industry forward.</p>

      <h2>AI-Powered Development</h2>
      <p>Artificial Intelligence is revolutionizing how developers write code, debug applications, and optimize performance. Tools like GitHub Copilot and ChatGPT are becoming integral parts of the development workflow.</p>

      <h3>Key AI Tools</h3>
      <ul>
        <li><strong>Code Generation:</strong> AI can now generate complex functions and components</li>
        <li><strong>Bug Detection:</strong> Automated code review and error identification</li>
        <li><strong>Performance Optimization:</strong> AI-driven suggestions for better performance</li>
      </ul>

      <h2>Progressive Web Apps (PWAs)</h2>
      <p>PWAs continue to bridge the gap between web and native applications, offering offline functionality, push notifications, and app-like experiences.</p>

      <blockquote>
        <p>"The future of web development lies in creating experiences that are indistinguishable from native applications while maintaining the accessibility and reach of the web."</p>
      </blockquote>

      <h2>Conclusion</h2>
      <p>As we move forward, these trends will continue to shape how we approach web development, making it more efficient, user-friendly, and powerful than ever before.</p>
    `,
    tags: ["Web Development", "AI", "PWA", "Technology", "Trends"],
    likes: 89,
    comments: [
      {
        id: 1,
        author: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "Great overview of current trends! The AI integration part was particularly insightful.",
        timestamp: "3 hours ago",
        likes: 12,
      },
      {
        id: 2,
        author: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "PWAs are definitely the future. We've seen great success implementing them in our projects.",
        timestamp: "6 hours ago",
        likes: 8,
      }
    ],
  },
  2: {
    metaDescription: "Learn best practices for creating maintainable and scalable React applications that can grow with your business needs.",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Senior Frontend Developer with 8+ years of experience in React and Next.js",
    },
    content: `
      <p>Building scalable React applications requires careful planning and adherence to best practices. In this comprehensive guide, we'll explore the key strategies for creating maintainable React applications that can grow with your business.</p>

      <h2>Component Architecture</h2>
      <p>The foundation of any scalable React application lies in its component architecture. Proper component design ensures reusability, maintainability, and testability.</p>

      <h3>Best Practices</h3>
      <ul>
        <li><strong>Single Responsibility:</strong> Each component should have one clear purpose</li>
        <li><strong>Composition over Inheritance:</strong> Use component composition for flexibility</li>
        <li><strong>Prop Validation:</strong> Always validate props with PropTypes or TypeScript</li>
      </ul>

      <h2>State Management</h2>
      <p>As applications grow, managing state becomes increasingly complex. Choose the right state management solution for your needs.</p>

      <pre><code>// Example of proper state management
const useUserData = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData().then(setUser).finally(() => setLoading(false));
  }, []);

  return { user, loading };
};</code></pre>

      <h2>Performance Optimization</h2>
      <p>Scalable applications must perform well even as they grow in complexity. Implement performance optimizations early in the development process.</p>

      <h2>Conclusion</h2>
      <p>Building scalable React applications is an ongoing process that requires attention to architecture, performance, and maintainability from the start.</p>
    `,
    tags: ["React", "Scalability", "Architecture", "Performance", "Best Practices"],
    likes: 156,
    comments: [
      {
        id: 1,
        author: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        content: "This is exactly what I needed for my current project. The state management section was super helpful!",
        timestamp: "2 hours ago",
        likes: 15,
      }
    ],
  }
  // Add more article details as needed
};

function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

export default function IntegratedBlogApp() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceTimeout = useRef();
  const didInit = useRef(false); // <-- Only set from URL on first mount
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!didInit.current) {
      // Search param logic now handled in SearchBar
      didInit.current = true;
    }
  }, []);

  // Debounce search input for instant filtering
  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 300ms debounce
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  // Only update URL on submit
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`);
    setDebouncedSearch(searchTerm); // Ensure filter matches URL
  };

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

  // Homepage View
  const HomePage = () => {
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
                  <SearchBar />
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
  };

  // Main render logic
  return <HomePage />;
}