import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`SELECT 1 as test`;
    return NextResponse.json({
      hasApiSecret: !!process.env.API_SECRET,
      secretLength: process.env.API_SECRET?.length || 0,
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('API') || k.includes('POSTGRES') || k.includes('SUPABASE')),
      dbTest: result.rows[0],
      dbConnected: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      hasApiSecret: !!process.env.API_SECRET,
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('API') || k.includes('POSTGRES') || k.includes('SUPABASE')),
      dbConnected: false,
      error: error.message,
    });
  }
}
