import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
if (!existsSync(clientPath)) {
  console.warn('⚠ Prisma client not found. Running prisma generate...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.info('✅ Prisma client generated successfully.');
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error);
    process.exit(1);
  }
}

const prisma = new PrismaClient();

export default prisma; 