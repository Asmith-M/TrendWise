import { MessageCircle, Clock, Tag, Calendar, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Comments from "./Comments.jsx"

// Mock data - in a real app, this would come from your CMS or database
const article = {
  title: "Building Scalable Web Applications with Next.js and TypeScript",
  metaDescription:
    "Learn how to create robust, scalable web applications using Next.js 15 and TypeScript. This comprehensive guide covers best practices, performance optimization, and modern development patterns.",
  category: "Web Development",
  readTime: "8 min read",
  publishedAt: "December 15, 2024",
  author: {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Senior Frontend Developer with 8+ years of experience in React and Next.js",
  },
  content: `
    <p>Modern web development has evolved significantly over the past few years, and Next.js has emerged as one of the most powerful frameworks for building React applications. In this comprehensive guide, we'll explore how to leverage Next.js 15 alongside TypeScript to create scalable, maintainable web applications.</p>
    
    <h2>Why Next.js and TypeScript?</h2>
    <p>The combination of Next.js and TypeScript provides developers with a robust foundation for building modern web applications. Next.js offers server-side rendering, static site generation, and excellent developer experience, while TypeScript adds type safety and better tooling support.</p>
    
    <h3>Key Benefits</h3>
    <ul>
      <li><strong>Type Safety:</strong> Catch errors at compile time rather than runtime</li>
      <li><strong>Better Developer Experience:</strong> Enhanced IDE support with autocomplete and refactoring</li>
      <li><strong>Scalability:</strong> Easier to maintain large codebases</li>
      <li><strong>Performance:</strong> Optimized builds and runtime performance</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>To begin building with Next.js and TypeScript, you'll want to set up your development environment properly. Here's a step-by-step approach to creating your first application:</p>
    
    <pre><code>npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
npm run dev</code></pre>
    
    <p>This command creates a new Next.js application with TypeScript, Tailwind CSS, and ESLint configured out of the box.</p>
    
    <h2>Best Practices for Scalable Architecture</h2>
    <p>When building scalable applications, it's crucial to establish good patterns early. Here are some key practices we recommend:</p>
    
    <blockquote>
      <p>"The key to building scalable applications is not just writing good code, but organizing it in a way that makes sense to your team and future maintainers."</p>
    </blockquote>
    
    <h3>Project Structure</h3>
    <p>Organize your project with clear separation of concerns. Use the app directory structure introduced in Next.js 13+ for better organization and performance.</p>
    
    <h2>Conclusion</h2>
    <p>Building scalable web applications with Next.js and TypeScript requires careful planning, good architecture decisions, and adherence to best practices. By following the patterns outlined in this guide, you'll be well-equipped to create maintainable, performant applications that can grow with your needs.</p>
  `,
  tags: ["Next.js", "TypeScript", "React", "Web Development", "JavaScript"],
  likes: 142,
  comments: [
    {
      id: 1,
      author: "Alex Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "Great article! The section on project structure was particularly helpful. I've been struggling with organizing larger Next.js projects.",
      timestamp: "2 hours ago",
      likes: 8,
    },
    {
      id: 2,
      author: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "Thanks for sharing this comprehensive guide. The TypeScript integration tips saved me a lot of time on my current project.",
      timestamp: "5 hours ago",
      likes: 12,
    },
    {
      id: 3,
      author: "David Kim",
      avatar: "/placeholder.svg?height=32&width=32",
      content:
        "Would love to see a follow-up article on testing strategies for Next.js applications. This was an excellent read!",
      timestamp: "1 day ago",
      likes: 6,
    },
  ],
}

export default function BlogArticlePage() {
  // Replace the hardcoded articleId with a real ObjectId if available
  const articleId = article._id || article.id || null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Blog
              </a>
              <span>/</span>
              <span className="text-gray-900 dark:text-gray-100">{article.category}</span>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Category and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Tag className="w-3 h-3 mr-1" />
                {article.category}
              </span>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {article.publishedAt}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Meta Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{article.metaDescription}</p>

            {/* Author Info */}
            <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8">
              <div className="flex items-center space-x-3">
                <img
                  src={article.author.avatar || "/placeholder.svg"}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{article.author.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{article.author.bio}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                  <Heart className="w-4 h-4" />
                  <span>{article.likes}</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
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
              <Comments articleId={articleId} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
