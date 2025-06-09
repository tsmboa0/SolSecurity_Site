#!/usr/bin/env node

// Temporary script to run Next.js dev server
const { spawn } = require('child_process');

const nextDev = spawn('npx', ['next', 'dev', '--port', '5000'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

nextDev.on('close', (code) => {
  console.log(`Next.js dev server exited with code ${code}`);
});

nextDev.on('error', (err) => {
  console.error('Failed to start Next.js dev server:', err);
});