import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/Comment';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession();
    if (!session || (!session.user?.name && !session.user?.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { articleId, text } = await request.json();
    if (!articleId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const comment = await Comment.create({
      articleId,
      user: session.user.name || session.user.email,
      text,
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add comment', details: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    if (!articleId) {
      return NextResponse.json({ error: 'Missing articleId' }, { status: 400 });
    }
    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return NextResponse.json([], { status: 200 });
    }
    const comments = await Comment.find({ articleId })
      .sort({ createdAt: -1 });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments', details: error.message }, { status: 500 });
  }
}
