import { NextRequest, NextResponse } from 'next/server';
import { unclaimPrint } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const print = await unclaimPrint(id);

    if (!print) {
      return NextResponse.json({ error: 'Print not found' }, { status: 404 });
    }

    return NextResponse.json(print);
  } catch (error) {
    console.error('Error unclaiming print:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
