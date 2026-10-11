import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  encryptedProfilePayload,
  setDecryptedProfileData,
  resetToDefaultProfileData,
} from '../data/profileData';
import { decryptPayload } from '../utils/crypto';

export const AuthContext = createContext();

const AUTO_LOCK_MINUTES = 30;

export const AuthProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasEncryptedPayload, setHasEncryptedPayload] = useState(Boolean(encryptedProfilePayload));
  const [authVersion, setAuthVersion] = useState(0);

  // Lock the vault - clears all decrypted data from memory
  const lock = useCallback(() => {
    resetToDefaultProfileData();
    setIsUnlocked(false);
    setError(null);
    setAuthVersion((v) => v + 1);
  }, []);

  // Unlock the vault using passphrase - decrypts purely into RAM (never stored in sessionStorage/localStorage)
  const unlock = useCallback(async (passphrase) => {
    if (!encryptedProfilePayload) {
      setError('Encrypted profile vault payload not found.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const decryptedData = await decryptPayload(encryptedProfilePayload, passphrase);
      setDecryptedProfileData(decryptedData);
      setIsUnlocked(true);
      setIsLoading(false);
      setAuthVersion((v) => v + 1);
      return true;
    } catch (err) {
      console.error('[VaultFolio Auth Error]:', err);
      // Clean, user-friendly, and secure error message
      setError('Incorrect passphrase. Please try again.');
      setIsLoading(false);
      return false;
    }
  }, []);

  // Auto-lock on inactivity timer
  useEffect(() => {
    if (!isUnlocked) return;

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lock();
      }, AUTO_LOCK_MINUTES * 60 * 1000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [isUnlocked, lock]);

  return (
    <AuthContext.Provider
      value={{
        isUnlocked,
        isLoading,
        error,
        setError,
        unlock,
        lock,
        hasEncryptedPayload,
        authVersion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
