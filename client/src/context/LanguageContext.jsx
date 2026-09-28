import { createContext, useContext, useEffect, useMemo } from 'react';
import { getTranslation } from '../utils/translations';

const LanguageContext = createContext(null);

// The product is Arabic-only by design — no language toggle.
const lang = 'ar';

export function LanguageProvider({ children }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';
  }, []);

  const value = useMemo(() => ({ lang, t: getTranslation, dir: 'rtl' }), []);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
