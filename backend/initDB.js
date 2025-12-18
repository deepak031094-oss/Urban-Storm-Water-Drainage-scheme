const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/urban-storm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Define user schema
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
  });
  
  // Hash password before saving
  userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Create admin user
  const adminUser = {
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  };
  
  try {
    // Check if admin exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      // Create new admin
      const admin = new User(adminUser);
      await admin.save();
      console.log('Admin user created successfully');
    } else {
      // Update existing admin password
      existingAdmin.password = adminUser.password;
      await existingAdmin.save();
      console.log('Admin user password updated');
    }
    
    // Verify the admin user
    const verifiedAdmin = await User.findOne({ username: 'admin' });
    console.log('Admin user in database:', {
      username: verifiedAdmin.username,
      role: verifiedAdmin.role,
      passwordSet: !!verifiedAdmin.password
    });
    
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
