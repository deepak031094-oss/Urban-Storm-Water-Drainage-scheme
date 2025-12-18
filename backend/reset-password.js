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
    username: String,
    password: String,
    role: String
  });

  const User = mongoose.model('User', userSchema);
  
  // New password
  const newPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(newPassword, 8);
  
  // Update admin password
  const result = await User.updateOne(
    { username: 'admin' },
    { $set: { password: hashedPassword } }
  );
  
  console.log('Password reset result:', result);
  console.log('Admin password has been reset to: admin123');
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
