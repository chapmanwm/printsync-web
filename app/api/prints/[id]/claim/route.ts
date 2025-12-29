import { NextRequest, NextResponse } from 'next/server';
import { claimPrint } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await request.json();

    if (!user) {
      return NextResponse.json({ error: 'User is required' }, { status: 400 });
    }

    const print = await claimPrint(id, user);

    if (!print) {
      return NextResponse.json({ error: 'Print not found or already claimed' }, { status: 404 });
    }

    return NextResponse.json(print);
  } catch (error) {
    console.error('Error claiming print:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
