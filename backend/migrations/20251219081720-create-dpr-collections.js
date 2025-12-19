module.exports = {
  async up(db, client) {
    await db.createCollection('projects');
    await db.createCollection('daily_progress');
    await db.createCollection('manpower_details');
    await db.createCollection('equipment_details');
    await db.createCollection('material_details');
    await db.createCollection('issues_challenges');
    await db.createCollection('safety_observations');
    await db.createCollection('quality_checks');
    await db.createCollection('photographic_documentation');
  },

  async down(db, client) {
    await db.collection('projects').drop();
    await db.collection('daily_progress').drop();
    await db.collection('manpower_details').drop();
    await db.collection('equipment_details').drop();
    await db.collection('material_details').drop();
    await db.collection('issues_challenges').drop();
    await db.collection('safety_observations').drop();
    await db.collection('quality_checks').drop();
    await db.collection('photographic_documentation').drop();
  }
};
