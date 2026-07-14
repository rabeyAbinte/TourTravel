import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fixUserRoles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tour-travel");
    console.log('Connected to MongoDB');

    // Admin email that should remain admin
    const adminEmail = 'myadmin@travel.com';

    // Update all users except admin to have role 'user'
    const result = await User.updateMany(
      { email: { $ne: adminEmail } },
      { role: 'user' }
    );

    console.log(`Updated ${result.modifiedCount} users to 'user' role`);

    // Verify the admin user still has admin role
    const adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      if (adminUser.role !== 'admin') {
        await User.updateOne({ email: adminEmail }, { role: 'admin' });
        console.log(`Ensured ${adminEmail} has 'admin' role`);
      } else {
        console.log(`${adminEmail} already has 'admin' role`);
      }
    } else {
      console.log(`Warning: Admin user ${adminEmail} not found in database`);
    }

    // Show current user roles
    const allUsers = await User.find({}, { email: 1, role: 1, name: 1 });
    console.log('\nCurrent user roles:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.role}`);
    });

    console.log('\nDatabase cleanup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during database cleanup:', error);
    process.exit(1);
  }
};

fixUserRoles();
