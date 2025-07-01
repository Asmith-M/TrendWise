import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

const BASE_URL = 'https://your-site.vercel.app';

export async function GET() {
  await dbConnect();
  const articles = await Article.find({}, 'slug updatedAt createdAt');
  const urls = articles.map(article => {
    const lastmod = article.updatedAt
      ? new Date(article.updatedAt).toISOString().split('T')[0]
      : (article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : '');
    return `    <url>\n      <loc>${BASE_URL}/blog/${article.slug}</loc>\n      <lastmod>${lastmod}</lastmod>\n    </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
