import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function DELETE(request, { params }) {
  await dbConnect();
  const session = await getServerSession();
  if (!session || session.user?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
  }
  try {
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article', details: error.message }, { status: 500 });
  }
}
