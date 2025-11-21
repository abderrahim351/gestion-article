require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('../modules/users/user.model');

async function run() {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@test.com';
    const adminPassword = 'Admin123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log(`Admin déjà existant : ${adminEmail}`);
    } else {
      const hash = await bcrypt.hash(adminPassword, 10);
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hash,
        role: 'ADMIN',
      });
      console.log(`Admin créé : ${adminEmail} / ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Erreur seed admin:', err);
    process.exit(1);
  }
}

run();
