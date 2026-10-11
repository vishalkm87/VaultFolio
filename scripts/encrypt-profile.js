import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { encryptPayload } from '../src/utils/crypto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const defaultDataPath = path.join(rootDir, 'src/data/profileData.json');
const outputEncPath = path.join(rootDir, 'src/data/profileData.enc.json');

const getSourceData = () => {
  const candidatePaths = [
    process.env.PRIVATE_DATA_PATH,
    path.resolve(rootDir, '../VaultFolio-private/profileData.json'),
    path.resolve(rootDir, '../VaultFolio-private/data/profileData.json'),
    path.join(rootDir, 'src/data/profileData.local.json'),
  ].filter(Boolean);

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      console.log(`[VaultFolio] Reading private profile data from: ${path.relative(rootDir, candidate)}`);
      return JSON.parse(fs.readFileSync(candidate, 'utf8'));
    }
  }

  if (fs.existsSync(defaultDataPath)) {
    console.log(`[VaultFolio] Private repository not found; reading template from: ${path.relative(rootDir, defaultDataPath)}`);
    return JSON.parse(fs.readFileSync(defaultDataPath, 'utf8'));
  }

  throw new Error('No profile data source found to encrypt.');
};

const askPassphrase = async () => {
  if (process.env.VAULT_PASSPHRASE) {
    console.log('[VaultFolio] Using passphrase provided via VAULT_PASSPHRASE environment variable.');
    return process.env.VAULT_PASSPHRASE;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter secret vault passphrase to encrypt: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
};

async function run() {
  try {
    const rawData = getSourceData();
    const rawPassphrase = await askPassphrase();
    const passphrase = String(rawPassphrase).replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim();

    if (!passphrase || passphrase.length < 4) {
      console.error('\n[Error] Passphrase must be at least 4 characters long.');
      process.exit(1);
    }

    console.log('\n[VaultFolio] Encrypting with PBKDF2 (150,000 iterations) + AES-256-GCM...');
    const startTime = Date.now();
    const encryptedPkg = await encryptPayload(rawData, passphrase);
    const elapsed = Date.now() - startTime;

    fs.writeFileSync(outputEncPath, JSON.stringify(encryptedPkg, null, 2), 'utf8');

    console.log(`[VaultFolio] Done in ${elapsed}ms! Encrypted payload saved to:`);
    console.log(`            ${path.relative(rootDir, outputEncPath)}`);
    console.log('\nKeep your passphrase safe! It is required to unlock the site.');
  } catch (err) {
    console.error('\n[VaultFolio Encryption Error]', err);
    process.exit(1);
  }
}

run();

