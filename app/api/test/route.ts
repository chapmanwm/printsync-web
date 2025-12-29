import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasApiSecret: !!process.env.API_SECRET,
    secretLength: process.env.API_SECRET?.length || 0,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('API') || k.includes('POSTGRES')),
  });
}
