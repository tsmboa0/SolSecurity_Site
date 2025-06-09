// Starting Next.js development server for serverless deployment
import { spawn } from 'child_process';

console.log('Starting Next.js development server...');

const nextDev = spawn('npx', ['next', 'dev', '--port', '5000'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

nextDev.on('close', (code: number) => {
  console.log(`Next.js dev server exited with code ${code}`);
});

nextDev.on('error', (err: Error) => {
  console.error('Failed to start Next.js dev server:', err);
});