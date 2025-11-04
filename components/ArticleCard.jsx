"use client";

import { Calendar, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ClientFormattedDate from "@/components/ClientFormattedDate";

function CommentCount({ articleId }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!articleId || typeof articleId !== "string" || articleId.length !== 24) return;
    
    fetch(`/api/comment?articleId=${articleId}`)
      .then((res) => res.json())
      .then((data) => setCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setCount(0));
  }, [articleId]);

  return (
    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
      <MessageCircle className="w-4 h-4" /> {count}
    </span>
  );
}

export default function ArticleCard({ post, variant = "medium", index = 0 }) {
  const cardVariants = {
    large: {
      container: "col-span-full lg:col-span-2 row-span-2",
      image: "h-80 lg:h-96",
      title: "text-3xl lg:text-4xl",
      excerpt: "line-clamp-4",
      showExcerpt: true,
    },
    medium: {
      container: "col-span-full md:col-span-1",
      image: "h-56",
      title: "text-xl lg:text-2xl",
      excerpt: "line-clamp-3",
      showExcerpt: true,
    },
    small: {
      container: "col-span-full",
      image: "h-48",
      title: "text-lg lg:text-xl",
      excerpt: "line-clamp-2",
      showExcerpt: false,
    },
  };

  const config = cardVariants[variant];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`${config.container} group`}
    >
      <Link
        href={`/blog/${post.slug || post.id}`}
        className="block h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300"
      >
        {/* Image Container */}
        <div className={`${config.image} relative overflow-hidden bg-gray-100 dark:bg-gray-900`}>
          {post.image ? (
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-50">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-sm">
              {post.category}
            </span>
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            <CommentCount articleId={post.id} />
          </div>

          {/* Title */}
          <h3
            className={`${config.title} font-bold text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2`}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          {config.showExcerpt && (
            <p className={`${config.excerpt} text-slate-600 dark:text-slate-300 mb-4`}>
              {post.excerpt}
            </p>
          )}

          {/* Date */}
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 mr-2" />
            <ClientFormattedDate dateString={post.publishDate} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}