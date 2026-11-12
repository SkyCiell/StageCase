const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
  console.log('🚀 Running migration to Supabase PostgreSQL...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const sqlFilePath = path.join(__dirname, '..', 'supabase_schema.sql');
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ SQL file not found at: ${sqlFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('🔗 Connected to Supabase!');

    console.log('⏳ Executing supabase_schema.sql...');
    await client.query(sql);

    console.log('✅ Schema and seed data successfully applied!');

    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`\n🎉 Public Tables in Supabase (${res.rows.length}):`);
    res.rows.forEach(r => console.log(`   - ${r.table_name}`));

    // Check count of concerts and users
    const userRes = await client.query('SELECT COUNT(*) FROM users;');
    const concertRes = await client.query('SELECT COUNT(*) FROM concerts;');
    const venueRes = await client.query('SELECT COUNT(*) FROM venues;');
    const ticketRes = await client.query('SELECT COUNT(*) FROM ticket_categories;');

    console.log('\n📊 Initial Seed Data Summary:');
    console.log(`   - Users: ${userRes.rows[0].count}`);
    console.log(`   - Venues: ${venueRes.rows[0].count}`);
    console.log(`   - Concerts: ${concertRes.rows[0].count}`);
    console.log(`   - Ticket Categories: ${ticketRes.rows[0].count}`);

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    await client.end();
    process.exit(1);
  }
}

migrate();

