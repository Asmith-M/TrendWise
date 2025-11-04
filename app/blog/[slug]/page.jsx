import { Clock, Share2, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Comments from "@/components/Comments.jsx";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import mongoose from "mongoose";
import DetailDateRow from "@/components/DetailDateRow";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import SocialShare from "@/components/SocialShare";
import RelatedArticles from "@/components/RelatedArticles";

export default async function ArticleDetailPage(props) {
  const params = await props.params;
  await dbConnect();

  let article = null;
  if (mongoose.Types.ObjectId.isValid(params.slug)) {
    article = await Article.findOne({ _id: params.slug });
  }
  if (!article) {
    article = await Article.findOne({ slug: params.slug });
  }
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Article not found
          </h1>
          <a href="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <a
                href="/"
                className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <Home className="w-4 h-4" /> Home
              </a>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 dark:text-white">{article.category}</span>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Author & TOC */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Author Card */}
            <div className="sticky top-24 space-y-6">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={article.author?.avatar || "https://i.pravatar.cc/150?img=1"}
                      alt={article.author?.name || "Author"}
                      className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-indigo-100 dark:ring-indigo-900"
                    />
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {article.author?.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {article.author?.bio || "Content Creator"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <TableOfContents content={article.content} />

              {/* Social Share */}
              <SocialShare
                title={article.title}
                url={`/blog/${params.slug}`}
                className="hidden lg:block"
              />
            </div>
          </aside>

          {/* Center Content */}
          <article className="lg:col-span-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8 sm:p-12">
                {/* Category Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                  {article.title}
                </h1>

                {/* Subtitle/Excerpt */}
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {article.meta?.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between border-t border-b border-slate-200 dark:border-slate-700 py-6 mb-8">
                  <DetailDateRow dateString={article.createdAt} readTime={article.readTime} />
                </div>

                {/* Hero Image */}
                {article.image && (
                  <div className="mb-12 -mx-8 sm:-mx-12">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <section className="mt-8">
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-8">
                  <Comments articleId={article._id.toString()} />
                </CardContent>
              </Card>
            </section>
          </article>

          {/* Right Sidebar - Related Articles */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <RelatedArticles
                currentArticleId={article._id.toString()}
                category={article.category}
              />
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Social Share */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <SocialShare title={article.title} url={`/blog/${params.slug}`} mobile />
      </div>
    </div>
  );
}