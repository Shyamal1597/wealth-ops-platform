const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const exportDir = path.join(process.cwd(), 'sunidhi-export-for-seo');

console.log('📦 Creating sanitized export for external SEO team...\n');

// Create export directory
if (fs.existsSync(exportDir)) {
  console.log('Removing old export directory...');
  fs.rmSync(exportDir, { recursive: true, force: true });
}
fs.mkdirSync(exportDir, { recursive: true });

// Files and directories to exclude (sensitive data)
const excludePatterns = [
  'node_modules',
  '.next',
  '.git',
  'data/*.json',           // All data files contain sensitive user info
  '.env.local',            // Contains secrets
  '.env',                  // Contains secrets
  '.env.*.local',          // Contains secrets
  'public/uploads/*',      // User uploaded files
  'public/research-reports/*', // Proprietary research PDFs
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  'scripts/export-for-seo.js', // This script itself
  'sunidhi-export-for-seo'     // Don't include the export folder
];

// Directories to copy
const includeDirs = [
  'src',
  'public',
  'data',
  'scripts'
];

// Root files to copy
const includeRootFiles = [
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.mjs',
  'components.json',
  'README.md',
  'CHANGELOG.md',
  '.gitignore'
];

// Create sanitized .env.example
console.log('Creating .env.example with placeholder values...');
const envExample = `# JWT Secret Key for Admin & User Authentication
# IMPORTANT: Keep this secret and never commit to version control
JWT_SECRET=your-jwt-secret-key-here-change-in-production

# Encryption Secret for Sensitive Data (Phone, PAN, etc.)
# IMPORTANT: Must be 32 characters minimum for AES-256
ENCRYPTION_SECRET=your-32-character-encryption-key-here

# Firebase Client SDK Configuration (Public - used in frontend)
# Get these values from Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK Configuration (Private - server-side only)
# Download service account JSON from Firebase Console > Project Settings > Service Accounts
# IMPORTANT: Keep these secret! Never expose to client-side code
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"

# Environment
NODE_ENV=development

# Site URL (for SEO - robots.txt and sitemap.xml)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# SMTP Configuration (for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here

# HTTPS Configuration (Production only)
FORCE_HTTPS=false
`;

fs.writeFileSync(path.join(exportDir, '.env.example'), envExample);

// Copy function
function copyRecursive(src, dest, basePath = '') {
  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    const dirName = path.basename(src);
    const relativePath = basePath ? `${basePath}/${dirName}` : dirName;

    // Check if this path should be excluded
    if (excludePatterns.some(pattern => {
      const fullPattern = pattern.replace(/\*/g, '.*');
      return new RegExp(fullPattern).test(relativePath) ||
             new RegExp(fullPattern).test(dirName);
    })) {
      console.log(`  ⏭️  Skipping: ${relativePath}`);
      return;
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      copyRecursive(srcPath, destPath, relativePath);
    });
  } else {
    const fileName = path.basename(src);
    const relativePath = basePath ? `${basePath}/${fileName}` : fileName;

    // Check if file should be excluded
    if (excludePatterns.some(pattern => {
      const fullPattern = pattern.replace(/\*/g, '.*');
      return new RegExp(fullPattern).test(relativePath) ||
             new RegExp(fullPattern).test(fileName);
    })) {
      return;
    }

    console.log(`  ✅ Copying: ${relativePath}`);
    fs.copyFileSync(src, dest);
  }
}

// Copy root files
console.log('\n📄 Copying root configuration files...');
includeRootFiles.forEach(file => {
  const src = path.join(process.cwd(), file);
  if (fs.existsSync(src)) {
    console.log(`  ✅ Copying: ${file}`);
    fs.copyFileSync(src, path.join(exportDir, file));
  }
});

// Copy directories
console.log('\n📁 Copying source directories...\n');
includeDirs.forEach(dir => {
  const src = path.join(process.cwd(), dir);
  if (fs.existsSync(src)) {
    console.log(`Copying directory: ${dir}`);
    const dest = path.join(exportDir, dir);
    copyRecursive(src, dest);
  }
});

// Create placeholder data files
console.log('\n📋 Creating placeholder data files...');
const dataDir = path.join(exportDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create .gitkeep
fs.writeFileSync(path.join(dataDir, '.gitkeep'), '');

// Create example data files (empty but valid JSON)
const dataFiles = [
  { name: 'admins.json', content: '[]' },
  { name: 'clients.json', content: '[]' },
  { name: 'research-reports.json', content: '[]' },
  { name: 'daily-updates.json', content: '{"updates":[]}' },
  { name: 'market-news.json', content: '{"news":[]}' },
  { name: 'blog-posts.json', content: '[]' }
];

dataFiles.forEach(({ name, content }) => {
  console.log(`  ✅ Creating: data/${name} (placeholder)`);
  fs.writeFileSync(path.join(dataDir, name), content);
});

// Create README for SEO team
console.log('\n📝 Creating README for SEO team...');
const seoReadme = `# Sunidhi Securities Website - SEO Export

This is a sanitized export of the Sunidhi Securities website source code for SEO optimization and external development.

## ⚠️ Important Notes

1. **All sensitive data has been removed**, including:
   - API keys and secrets
   - User data
   - Admin credentials
   - Research reports (PDFs)
   - Uploaded files
   - Environment variables

2. **Setup Required**:
   - Run \`npm install\` to install dependencies
   - Copy \`.env.example\` to \`.env.local\` and fill in your credentials
   - Data files are empty placeholders - do not contain actual data

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## 📂 Project Structure

- \`/src\` - Source code (pages, components, API routes)
- \`/public\` - Static assets (images, PDFs - research reports excluded)
- \`/data\` - Data files (placeholder files only)
- \`/scripts\` - Utility scripts

## 🔍 SEO-Related Files

- \`src/app/layout.tsx\` - Root layout with metadata
- \`src/app/sitemap.ts\` - Dynamic sitemap generation
- \`src/app/robots.ts\` - Robots.txt configuration
- \`public/\` - Static assets

## 📱 Technology Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## 📞 Contact

For questions about the codebase, contact Sunidhi Securities.

---
**Export Date**: ${new Date().toLocaleDateString()}
**Version**: 1.0.0
`;

fs.writeFileSync(path.join(exportDir, 'README-SEO.md'), seoReadme);

console.log('\n✨ Export complete!\n');
console.log(`📦 Export location: ${exportDir}`);
console.log('\n📋 What was included:');
console.log('  ✅ All source code (src/)');
console.log('  ✅ Public assets (excluding research reports)');
console.log('  ✅ Configuration files');
console.log('  ✅ Package dependencies list');
console.log('  ✅ Placeholder data files');
console.log('\n🔒 What was excluded (sensitive):');
console.log('  ❌ Environment variables (.env.local)');
console.log('  ❌ User data (data/*.json)');
console.log('  ❌ Admin credentials');
console.log('  ❌ Research reports (PDFs)');
console.log('  ❌ API keys and secrets');
console.log('  ❌ Uploaded files');
console.log('\n💡 Next steps:');
console.log('  1. Compress the folder: sunidhi-export-for-seo');
console.log('  2. Share the compressed file with your SEO team');
console.log('  3. They should read README-SEO.md for setup instructions');
