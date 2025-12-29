import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    const connectionString = process.env.POSTGRES_URL?.split('?')[0];
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    const result = await pool.query('SELECT 1 as test');
    await pool.end();

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
