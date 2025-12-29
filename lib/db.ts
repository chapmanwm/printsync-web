import { Pool } from 'pg';

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export interface Print {
  id: string;
  title: string;
  cover: string | null;
  status: string;
  start_time: string | null;
  end_time: string | null;
  total_weight: number | null;
  filament_1_material: string | null;
  filament_1_colour: string | null;
  filament_1_weight: number | null;
  filament_2_material: string | null;
  filament_2_colour: string | null;
  filament_2_weight: number | null;
  filament_3_material: string | null;
  filament_3_colour: string | null;
  filament_3_weight: number | null;
  filament_4_material: string | null;
  filament_4_colour: string | null;
  filament_4_weight: number | null;
  claimed_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prints (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      cover TEXT,
      status TEXT NOT NULL,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      total_weight DECIMAL,
      filament_1_material TEXT,
      filament_1_colour TEXT,
      filament_1_weight DECIMAL,
      filament_2_material TEXT,
      filament_2_colour TEXT,
      filament_2_weight DECIMAL,
      filament_3_material TEXT,
      filament_3_colour TEXT,
      filament_3_weight DECIMAL,
      filament_4_material TEXT,
      filament_4_colour TEXT,
      filament_4_weight DECIMAL,
      claimed_by TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for efficient queries
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_claimed_by ON prints(claimed_by)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_created_at ON prints(created_at DESC)`);
}

export async function upsertPrint(print: Omit<Print, 'created_at' | 'updated_at'>) {
  const result = await pool.query(
    `INSERT INTO prints (
      id, title, cover, status, start_time, end_time, total_weight,
      filament_1_material, filament_1_colour, filament_1_weight,
      filament_2_material, filament_2_colour, filament_2_weight,
      filament_3_material, filament_3_colour, filament_3_weight,
      filament_4_material, filament_4_colour, filament_4_weight,
      claimed_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      cover = EXCLUDED.cover,
      status = EXCLUDED.status,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      total_weight = EXCLUDED.total_weight,
      filament_1_material = EXCLUDED.filament_1_material,
      filament_1_colour = EXCLUDED.filament_1_colour,
      filament_1_weight = EXCLUDED.filament_1_weight,
      filament_2_material = EXCLUDED.filament_2_material,
      filament_2_colour = EXCLUDED.filament_2_colour,
      filament_2_weight = EXCLUDED.filament_2_weight,
      filament_3_material = EXCLUDED.filament_3_colour,
      filament_3_colour = EXCLUDED.filament_3_colour,
      filament_3_weight = EXCLUDED.filament_3_weight,
      filament_4_material = EXCLUDED.filament_4_material,
      filament_4_colour = EXCLUDED.filament_4_colour,
      filament_4_weight = EXCLUDED.filament_4_weight,
      updated_at = CURRENT_TIMESTAMP
    WHERE prints.claimed_by IS NULL`,
    [
      print.id, print.title, print.cover, print.status,
      print.start_time, print.end_time, print.total_weight,
      print.filament_1_material, print.filament_1_colour, print.filament_1_weight,
      print.filament_2_material, print.filament_2_colour, print.filament_2_weight,
      print.filament_3_material, print.filament_3_colour, print.filament_3_weight,
      print.filament_4_material, print.filament_4_colour, print.filament_4_weight,
      print.claimed_by,
    ]
  );

  return result;
}

export async function getPrints(filter?: { claimed?: boolean }) {
  let query = 'SELECT * FROM prints';
  const params: any[] = [];

  if (filter?.claimed === false) {
    query += ' WHERE claimed_by IS NULL';
  } else if (filter?.claimed === true) {
    query += ' WHERE claimed_by IS NOT NULL';
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, params);
  return result;
}

export async function claimPrint(id: string, user: string) {
  const result = await pool.query(
    `UPDATE prints
     SET claimed_by = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 AND claimed_by IS NULL
     RETURNING *`,
    [user, id]
  );

  return result.rows[0] || null;
}

export async function unclaimPrint(id: string) {
  const result = await pool.query(
    `UPDATE prints
     SET claimed_by = NULL, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0] || null;
}
