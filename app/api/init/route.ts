import { NextRequest, NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initDb();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
