import { NextRequest, NextResponse } from 'next/server';
import { upsertPrint, getPrints } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Handle both single print and array of prints
    const prints = Array.isArray(body) ? body : [body];

    for (const print of prints) {
      await upsertPrint({
        id: print.id,
        title: print.title || '',
        cover: print.cover || null,
        status: print.status,
        start_time: print.start_time || null,
        end_time: print.end_time || null,
        total_weight: print.total_weight || null,
        filament_1_material: print.filament_1_material || null,
        filament_1_colour: print.filament_1_colour || null,
        filament_1_weight: print.filament_1_weight || null,
        filament_2_material: print.filament_2_material || null,
        filament_2_colour: print.filament_2_colour || null,
        filament_2_weight: print.filament_2_weight || null,
        filament_3_material: print.filament_3_material || null,
        filament_3_colour: print.filament_3_colour || null,
        filament_3_weight: print.filament_3_weight || null,
        filament_4_material: print.filament_4_material || null,
        filament_4_colour: print.filament_4_colour || null,
        filament_4_weight: print.filament_4_weight || null,
        claimed_by: print.claimed_by || null,
      });
    }

    return NextResponse.json({ success: true, count: prints.length });
  } catch (error) {
    console.error('Error upserting prints:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const claimed = searchParams.get('claimed');

    let filter;
    if (claimed === 'false') {
      filter = { claimed: false };
    } else if (claimed === 'true') {
      filter = { claimed: true };
    }

    const result = await getPrints(filter);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching prints:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
