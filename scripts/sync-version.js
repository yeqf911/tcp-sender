#!/usr/bin/env node

/**
 * Sync version from Cargo.toml to package.json and tauri.conf.json
 * This ensures all version numbers stay in sync with Cargo.toml as the single source of truth
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Read version from Cargo.toml
function readCargoVersion() {
  const cargoPath = path.join(rootDir, 'src-tauri', 'Cargo.toml');
  const cargoContent = fs.readFileSync(cargoPath, 'utf-8');

  const match = cargoContent.match(/^version\s*=\s*["']([^"']+)["']/m);
  if (!match) {
    throw new Error('Could not find version in Cargo.toml');
  }
  return match[1];
}

// Update package.json version
function updatePackageJson(version) {
  const pkgPath = path.join(rootDir, 'package.json');
  const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
  const pkg = JSON.parse(pkgContent);

  if (pkg.version !== version) {
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated package.json to version ${version}`);
  }
}

// Update tauri.conf.json version
function updateTauriConf(version) {
  const confPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');
  const confContent = fs.readFileSync(confPath, 'utf-8');
  const conf = JSON.parse(confContent);

  if (conf.version !== version) {
    conf.version = version;
    fs.writeFileSync(confPath, JSON.stringify(conf, null, 2) + '\n');
    console.log(`Updated tauri.conf.json to version ${version}`);
  }
}

// Main
try {
  const version = readCargoVersion();
  console.log(`Cargo.toml version: ${version}`);

  updatePackageJson(version);
  updateTauriConf(version);

  console.log('Version sync complete!');
} catch (error) {
  console.error('Error syncing version:', error.message);
  process.exit(1);
}
