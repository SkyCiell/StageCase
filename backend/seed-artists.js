const { sequelize } = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function seedArtists() {
  try {
    console.log('🌱 Seeding new artists data...');
    
    const sqlFile = path.join(__dirname, '../docs/seed_new_artists.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute entire SQL file at once
    await sequelize.query(sql, { raw: true });

    console.log('✅ Successfully seeded all data!');
    console.log('🎸 Reality Club - 3 concerts');
    console.log('🎵 The Milo - 3 concerts');
    console.log('🌊 Wave to Earth - 3 concerts');
    console.log('\n🎉 Total: 9 new concerts + venues added!');
    
    // Verify
    const [concerts] = await sequelize.query("SELECT COUNT(*) as total FROM concerts WHERE artist_name IN ('Reality Club', 'The Milo', 'Wave to Earth')");
    console.log(`\n✓ Verified: ${concerts[0].total} new artist concerts in database`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

seedArtists();
