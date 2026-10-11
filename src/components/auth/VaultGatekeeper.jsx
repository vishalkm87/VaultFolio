import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DeveloperBackground } from './DeveloperBackground';

export const VaultGatekeeper = () => {
  const { unlock, isLoading, error, setError, hasEncryptedPayload } = useAuth();

  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passphrase.trim()) {
      setError('Please enter your passphrase.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    if (isLoading) return;

    const cleanPassphrase = passphrase.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '').trim();
    const success = await unlock(cleanPassphrase);
    if (!success) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col justify-center items-center px-4 py-8 relative select-none overflow-hidden">
      {/* Innovative Theme-Aware Monochromatic Developer SVG Background */}
      <DeveloperBackground />

      {/* Main Lock Card - High Contrast Solid Surface with Sharp Definition */}
      <div
        className={`w-full max-w-sm bg-[var(--bg-surface)] border-2 border-[var(--border-strong)] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 transition-transform ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] border-2 border-[var(--border-strong)] flex items-center justify-center mb-3 text-[var(--accent-primary)] shadow-sm">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Profile Vault
          </h1>
        </div>

        {/* Warning if no encrypted file is present */}
        {!hasEncryptedPayload && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No encrypted vault payload found.</span>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)]">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              id="vault-passphrase"
              type={showPassphrase ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading}
              placeholder="Enter passphrase"
              aria-label="Passphrase"
              autoComplete="current-password"
              autoFocus
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--bg-subtle)] border-2 border-[var(--border-strong)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm font-semibold focus:outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/20 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              tabIndex={-1}
              aria-label={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
            >
              {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !passphrase.trim()}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 tracking-wide"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decrypting...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 stroke-[2.2]" />
                <span>Unlock</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VaultGatekeeper;
