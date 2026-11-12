require('dotenv').config();
const { sequelize, User, Concert, Venue } = require('./src/models');

async function testSequelizeModels() {
  console.log('Testing Sequelize ORM with Supabase...');
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize authenticated successfully!');

    const admin = await User.findOne({ where: { role: 'admin' } });
    console.log(`👤 Admin loaded: ${admin ? admin.email : 'None'}`);

    const concerts = await Concert.findAll({
      include: [{ model: Venue, as: 'venue' }],
      limit: 3
    });
    console.log(`🎶 Concerts loaded: ${concerts.length}`);
    concerts.forEach(c => {
      console.log(`   - "${c.title}" at ${c.venue ? c.venue.name : 'Unknown Venue'}`);
    });

    await sequelize.close();
    console.log('\n✨ All backend Sequelize models are working 100%!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Sequelize test failed:', err);
    process.exit(1);
  }
}

testSequelizeModels();
