const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Create 5 demo users
const demoUsers = [
  {
    id: '1',
    username: 'client1',
    email: 'client1@sunidhi.demo',
    password: 'Demo@123',
    fullName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    accountType: 'Trading',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'client2',
    email: 'client2@sunidhi.demo',
    password: 'Demo@123',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43211',
    accountType: 'Demat',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'client3',
    email: 'client3@sunidhi.demo',
    password: 'Demo@123',
    fullName: 'Amit Patel',
    phone: '+91 98765 43212',
    accountType: 'Trading & Demat',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    username: 'client4',
    email: 'client4@sunidhi.demo',
    password: 'Demo@123',
    fullName: 'Sneha Reddy',
    phone: '+91 98765 43213',
    accountType: 'Mutual Funds',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    username: 'client5',
    email: 'client5@sunidhi.demo',
    password: 'Demo@123',
    fullName: 'Vikram Singh',
    phone: '+91 98765 43214',
    accountType: 'Trading & Demat',
    createdAt: new Date().toISOString(),
  },
];

async function initializeUsers() {
  console.log('🔐 Initializing user database...\n');

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const usersFilePath = path.join(dataDir, 'users.json');

  // Hash passwords
  const usersWithHashedPasswords = await Promise.all(
    demoUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return {
        ...user,
        password: hashedPassword,
      };
    })
  );

  // Save to file
  fs.writeFileSync(
    usersFilePath,
    JSON.stringify({ users: usersWithHashedPasswords }, null, 2)
  );

  console.log('✅ Successfully created user database at:', usersFilePath);
  console.log('\n📋 Demo User Credentials:\n');
  console.log('━'.repeat(80));
  demoUsers.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.fullName}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email:    ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Account:  ${user.accountType}`);
  });
  console.log('\n' + '━'.repeat(80));
  console.log('\n💡 All demo accounts use the same password: Demo@123');
  console.log('💡 Users can also register for new accounts at /register\n');
}

initializeUsers().catch(console.error);
