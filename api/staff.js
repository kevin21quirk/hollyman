import { neon } from '@neondatabase/serverless';
import { STAFF } from './_seed.js';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS staff (id INT PRIMARY KEY, data JSONB NOT NULL)`;
    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM staff`;
    if (!count) for (const s of STAFF) await sql`INSERT INTO staff (id, data) VALUES (${s.id}, ${JSON.stringify(s)}::jsonb) ON CONFLICT DO NOTHING`;
    const rows = await sql`SELECT data FROM staff ORDER BY id`;
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(rows.map(r => r.data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
