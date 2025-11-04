"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import AuthButton from "@/components/auth/authBottons";
import Navigation from "@/components/Navigation";
import ArticleCard from "@/components/ArticleCard";
import { motion } from "framer-motion";

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ articles: 0, readers: "10K+", topics: 15 });
  const { data: session } = useSession();

  // Fetch articles from DB
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/article");
      if (res.ok) {
        const data = await res.json();
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
              image: a.image || null,
            }))
          : [];
        setBlogPosts(dbPosts);
        setStats((prev) => ({ ...prev, articles: dbPosts.length }));
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

  // Generate article
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
      await fetchArticles();
    } catch (err) {
      setError(err.message || "Something went wrong. Please check your API setup.");
    } finally {
      setGenerating(false);
    }
  };

  // Filtered blog posts
  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      post.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Organize posts by size for masonry layout
  const featuredPost = filteredBlogPosts[0];
  const mediumPosts = filteredBlogPosts.slice(1, 4);
  const smallPosts = filteredBlogPosts.slice(4);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh" />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
        />
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Welcome to TrendWise
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Discover AI-powered insights and trending articles
            </p>
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Sign in to generate, view, and comment on cutting-edge content
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <AuthButton />
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                ✨ AI-Powered
              </span>
              <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                🚀 Real-time Updates
              </span>
              <span className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                💡 Trending Topics
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <Navigation onSearch={setDebouncedSearch} transparent />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-mesh">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
                >
                  Latest Insights &{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Trends
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed"
                >
                  Stay ahead of the curve with our curated collection of articles on technology,
                  design, and innovation.
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex gap-8 mb-8"
                >
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stats.articles}+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Articles</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stats.readers}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Readers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stats.topics}+
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Topics</div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {!showForm ? (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="gap-2 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                    >
                      <Plus size={20} />
                      Generate New Article
                    </Button>
                  ) : (
                    <form onSubmit={handleGenerateArticle} className="space-y-4 max-w-md">
                      <input
                        type="text"
                        placeholder="Enter article topic (e.g., 'AI in Healthcare')"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={generating}
                        autoFocus
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowForm(false);
                            setTopic("");
                            setError(null);
                          }}
                          disabled={generating}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={generating || !topic.trim()}
                          className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600"
                        >
                          {generating ? "Generating..." : "Generate"}
                        </Button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </motion.div>

              {/* Right: Featured Article Preview */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="hidden lg:block"
                >
                  <ArticleCard post={featuredPost} variant="large" />
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Articles Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500 mb-4" />
              <span className="text-lg text-slate-500 dark:text-slate-300">Loading articles...</span>
            </div>
          ) : filteredBlogPosts.length > 0 ? (
            <>
              {/* Masonry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
                {/* Featured on mobile */}
                <div className="lg:hidden col-span-full">
                  {featuredPost && <ArticleCard post={featuredPost} variant="large" index={0} />}
                </div>

                {/* Medium Cards */}
                {mediumPosts.map((post, index) => (
                  <ArticleCard key={post.id} post={post} variant="medium" index={index + 1} />
                ))}

                {/* Small Cards */}
                {smallPosts.map((post, index) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    variant="small"
                    index={index + mediumPosts.length + 1}
                  />
                ))}
              </div>

              {/* Load More */}
              {filteredBlogPosts.length > 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-12"
                >
                  <Button variant="outline" size="lg" className="px-8">
                    Load More Articles
                  </Button>
                </motion.div>
              )}
            </>
          ) : (
                  <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                No articles found matching your search.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
              TrendWise
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              &copy; 2025 TrendWise. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Made by Asmith Jitendra Mahendrakar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}