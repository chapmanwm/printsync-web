import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL?.split('?')[0];

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET() {
  try {
    // Get all claimed prints with filament data
    const result = await pool.query(`
      SELECT
        claimed_by,
        filament_1_material, filament_1_colour, filament_1_weight,
        filament_2_material, filament_2_colour, filament_2_weight,
        filament_3_material, filament_3_colour, filament_3_weight,
        filament_4_material, filament_4_colour, filament_4_weight
      FROM prints
      WHERE claimed_by IS NOT NULL
    `);

    // Aggregate filament usage by user and filament type
    const usage: Record<string, Record<string, number>> = {};
    const filaments = new Set<string>();

    for (const row of result.rows) {
      const user = row.claimed_by;
      if (!usage[user]) {
        usage[user] = {};
      }

      // Process each filament slot
      for (let i = 1; i <= 4; i++) {
        const material = row[`filament_${i}_material`];
        const colour = row[`filament_${i}_colour`];
        const weight = parseFloat(row[`filament_${i}_weight`]) || 0;

        if (material && colour && weight > 0) {
          const filamentKey = `${material} - ${colour}`;
          filaments.add(filamentKey);

          if (!usage[user][filamentKey]) {
            usage[user][filamentKey] = 0;
          }
          usage[user][filamentKey] += weight;
        }
      }
    }

    // Calculate totals and costs
    // Assume £20 per 1kg spool
    const costPerGram = 20 / 1000;

    const summary = Object.entries(usage).map(([user, filamentUsage]) => {
      const totalWeight = Object.values(filamentUsage).reduce((sum, weight) => sum + weight, 0);
      const totalCost = totalWeight * costPerGram;

      return {
        user,
        filaments: filamentUsage,
        totalWeight: Math.round(totalWeight * 10) / 10,
        totalCost: Math.round(totalCost * 100) / 100,
      };
    });

    return NextResponse.json({
      summary,
      allFilaments: Array.from(filaments).sort(),
    });
  } catch (error) {
    console.error('Error fetching filament usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
