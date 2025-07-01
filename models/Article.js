import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  meta: {
    description: { type: String, required: true },
    keywords: { type: [String], required: true }
  },
  content: { type: String, required: true },
  og: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String }
  },
  category: { type: String },
  publishDate: { type: Date, default: Date.now },
  readTime: { type: String },
  user: { type: String, required: false } // Add user field
}, { timestamps: true });

// Prevent model overwrite in development
const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);

export default Article;