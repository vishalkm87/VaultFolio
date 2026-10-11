/**
 * Web Crypto API Utility for VaultFolio
 * Zero-dependency, military-grade AES-256-GCM encryption with PBKDF2 key derivation.
 * Works universally across modern browsers and Node.js >= 19/22.
 */

const getCrypto = () => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API is not supported in this environment.');
};

// Base64 encoding/decoding helpers compatible with browser and Node.js
export const uint8ToBase64 = (bytes) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToUint8 = (base64) => {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const PBKDF2_ITERATIONS = 150000;

/**
 * Derives a 256-bit AES-GCM CryptoKey from a user passphrase using PBKDF2.
 */
async function deriveKey(passphrase, saltBytes, usages = ['encrypt', 'decrypt']) {
  const crypto = getCrypto();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    usages
  );
}

/**
 * Encrypts a JavaScript object/value with AES-256-GCM.
 * Returns a serializable package containing salt, iv, and ciphertext.
 *
 * @param {any} data - Object or primitive to encrypt
 * @param {string} passphrase - User master secret
 * @returns {Promise<{v: number, salt: string, iv: string, ciphertext: string}>}
 */
export async function encryptPayload(data, passphrase) {
  const crypto = getCrypto();
  if (!passphrase || typeof passphrase !== 'string') {
    throw new Error('A valid passphrase is required for encryption.');
  }

  const cleanPass = String(passphrase).replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(cleanPass, salt, ['encrypt']);

  const plainBytes = textEncoder.encode(JSON.stringify(data));
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plainBytes
  );

  return {
    v: 1,
    salt: uint8ToBase64(salt),
    iv: uint8ToBase64(iv),
    ciphertext: uint8ToBase64(new Uint8Array(cipherBuffer)),
  };
}

/**
 * Decrypts an encrypted payload using AES-256-GCM.
 * Throws an error if the passphrase is invalid or ciphertext was altered.
 *
 * @param {{v?: number, salt: string, iv: string, ciphertext: string}} encryptedPkg
 * @param {string} passphrase
 * @returns {Promise<any>} Parsed plain object
 */
export async function decryptPayload(encryptedPkg, passphrase) {
  const crypto = getCrypto();
  if (!encryptedPkg || !encryptedPkg.salt || !encryptedPkg.iv || !encryptedPkg.ciphertext) {
    throw new Error('Invalid encrypted package format.');
  }
  if (!passphrase || typeof passphrase !== 'string') {
    throw new Error('A valid passphrase is required for decryption.');
  }

  const salt = base64ToUint8(encryptedPkg.salt);
  const iv = base64ToUint8(encryptedPkg.iv);
  const ciphertext = base64ToUint8(encryptedPkg.ciphertext);

  const cleanPass = String(passphrase).replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim();
  const key = await deriveKey(cleanPass, salt, ['decrypt']);

  try {
    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    const jsonStr = textDecoder.decode(plainBuffer);
    return JSON.parse(jsonStr);
  } catch (err) {
    if (err.name === 'OperationError') {
      throw new Error('Authentication failed: incorrect passphrase.');
    }
    throw new Error('Decryption failed.');
  }
}

