import { MessageCircle, Clock, Tag, Calendar, Heart, Share2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Comments from "@/components/Comments.jsx";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import mongoose from "mongoose";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import DetailDateRow from "@/components/DetailDateRow";

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
    return <div className="text-center py-20 text-2xl">Article not found.</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="/" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                <Home className="w-4 h-4" /> Home
              </a>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100">{article.category}</span>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Tag className="w-3 h-3 mr-1" />
                {article.category}
              </span>
              <DetailDateRow dateString={article.createdAt} readTime={article.readTime} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{article.meta?.description}</p>
            <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8">
              <div className="flex items-center space-x-3">
                <img
                  src={article.author?.avatar || "/placeholder.svg"}
                  alt={article.author?.name || "Author"}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{article.author?.name || ""}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{article.author?.bio || ""}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                  <Heart className="w-4 h-4" />
                  <span>{article.likes || 0}</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {article.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
        {/* Comments Section */}
        <section className="mt-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6 sm:p-8">
              <Comments articleId={article._id.toString()} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
