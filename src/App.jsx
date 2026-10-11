import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout';
import { ScrollToTop } from './components/common';
import { AppRoutes } from './routes';
import { profileData } from './data/profileData';
import { VaultGatekeeper } from './components/auth/VaultGatekeeper';

/**
 * Inner Application Shell
 * Renders the VaultGatekeeper if locked, or the full portfolio when unlocked.
 * Dynamically synchronizes page title and handles copy protection.
 */
const AppContent = () => {
  const { isUnlocked, authVersion } = useAuth();

  useEffect(() => {
    // Only configure copy protection and SEO when unlocked
    if (!isUnlocked) {
      document.title = 'VaultFolio | Secure Access';
      document.body.classList.remove('copy-disabled');
      return;
    }

    // Dynamically synchronize page title and SEO meta description from profileData
    const personal = profileData?.personal;
    if (personal?.name) {
      document.title = `${personal.name}${personal.currentRole ? ` | ${personal.currentRole}` : ' | Portfolio'}`;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && personal?.headline) {
      metaDesc.setAttribute('content', personal.headline);
    }

    // Check copy-paste configuration switch from profileData
    const isCopyPasteEnabled = Boolean(profileData.security?.enableCopyPaste);

    if (isCopyPasteEnabled) {
      document.body.classList.remove('copy-disabled');
      return;
    }

    document.body.classList.add('copy-disabled');

    const isInputTarget = (target) => {
      if (!target) return false;
      const tag = target.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
    };

    const handleCopy = (e) => {
      if (!isInputTarget(e.target)) e.preventDefault();
    };

    const handleCut = (e) => {
      if (!isInputTarget(e.target)) e.preventDefault();
    };

    const handlePaste = (e) => {
      if (!isInputTarget(e.target)) e.preventDefault();
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.body.classList.remove('copy-disabled');
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
    };
  }, [isUnlocked]);

  // If locked, present the full-site secure gatekeeper login screen
  if (!isUnlocked) {
    return <VaultGatekeeper />;
  }

  // If unlocked, present the full authenticated portfolio
  return (
    <HashRouter key={authVersion}>
      <ScrollToTop />
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </HashRouter>
  );
};

/**
 * Root Application Component
 * Initializes context providers for theme and zero-backend vault authentication.
 */
export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
