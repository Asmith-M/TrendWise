import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import slugify from 'slugify';
import Article from '@/models/Article';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';

// Setup OpenRouter client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1', // Required for OpenRouter
});

export async function GET(request) {
  try {
    await dbConnect();
    let userEmail = null;
    try {
      const session = await getServerSession();
      userEmail = session?.user?.email;
    } catch {}
    let articles;
    if (userEmail) {
      articles = await Article.find({ user: userEmail }).sort({ createdAt: -1 });
    } else {
      articles = await Article.find({}).sort({ createdAt: -1 });
    }
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    // Generate article using OpenRouter
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `You are an expert SEO content writer. Generate a comprehensive, SEO-optimized article about "${topic}". The article should be well-structured with HTML formatting (h2, h3, p, ul, ol tags), include a meta description and Open Graph tags.`
          },
          {
            role: 'user',
            content: `Write an SEO-optimized article about "${topic}". Return a JSON object with the following fields: - title (string) - slug (string) - meta (object with description and keywords[]) - content (HTML formatted string) - og (object with title, description, image URL) - category (string) - readTime (string like "5 min read")`
          }
        ]
      });
    } catch (err) {
      return NextResponse.json({ error: 'Failed to generate article', details: err.message }, { status: 500 });
    }
    let rawContent = completion.choices[0].message.content.trim();
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI did not return valid JSON.' }, { status: 500 });
    }
    let articleData;
    try {
      articleData = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return NextResponse.json({ error: 'Failed to parse AI response.', details: err.message }, { status: 500 });
    }
    // Sanitize slug
    articleData.slug = slugify(articleData.slug || articleData.title, { lower: true, strict: true });
    // Save article
    const article = await Article.create({ ...articleData, user: session.user.email });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add article', details: error.message }, { status: 500 });
  }
}

