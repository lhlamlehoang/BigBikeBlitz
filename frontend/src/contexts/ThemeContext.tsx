import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { IntlProvider } from 'react-intl';
import api from '../auth/authFetch';

interface ThemeContextType {
  currentTheme: 'light' | 'dark' | 'auto';
  currentLanguage: string;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (language: string) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Language messages
const messages = {
  en: {
    'app.title': 'BigBikeBlitz',
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.orders': 'Orders',
    'nav.logout': 'Logout',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.rememberMe': 'Remember Me',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'product.addToCart': 'Add to Cart',
    'product.addToWishlist': 'Add to Wishlist',
    'product.removeFromWishlist': 'Remove from Wishlist',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
    'settings.profile': 'Profile',
    'settings.security': 'Security',
    'settings.preferences': 'Preferences',
    'settings.notifications': 'Notifications',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.timezone': 'Timezone',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
  },
  es: {
    'app.title': 'BigBikeBlitz',
    'nav.home': 'Inicio',
    'nav.categories': 'Categorías',
    'nav.cart': 'Carrito',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    'nav.orders': 'Pedidos',
    'nav.logout': 'Cerrar Sesión',
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.rememberMe': 'Recordarme',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'product.addToCart': 'Agregar al Carrito',
    'product.addToWishlist': 'Agregar a Favoritos',
    'product.removeFromWishlist': 'Quitar de Favoritos',
    'cart.empty': 'Tu carrito está vacío',
    'cart.checkout': 'Pagar',
    'cart.total': 'Total',
    'settings.profile': 'Perfil',
    'settings.security': 'Seguridad',
    'settings.preferences': 'Preferencias',
    'settings.notifications': 'Notificaciones',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.currency': 'Moneda',
    'settings.timezone': 'Zona Horaria',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.warning': 'Advertencia',
    'common.info': 'Información',
  },
  fr: {
    'app.title': 'BigBikeBlitz',
    'nav.home': 'Accueil',
    'nav.categories': 'Catégories',
    'nav.cart': 'Panier',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.orders': 'Commandes',
    'nav.logout': 'Déconnexion',
    'auth.login': 'Se Connecter',
    'auth.register': "S'inscrire",
    'auth.email': 'E-mail',
    'auth.password': 'Mot de Passe',
    'auth.confirmPassword': 'Confirmer le Mot de Passe',
    'auth.forgotPassword': 'Mot de passe oublié?',
    'auth.rememberMe': 'Se Souvenir de Moi',
    'auth.noAccount': "Vous n'avez pas de compte?",
    'auth.hasAccount': 'Vous avez déjà un compte?',
    'product.addToCart': 'Ajouter au Panier',
    'product.addToWishlist': 'Ajouter aux Favoris',
    'product.removeFromWishlist': 'Retirer des Favoris',
    'cart.empty': 'Votre panier est vide',
    'cart.checkout': 'Commander',
    'cart.total': 'Total',
    'settings.profile': 'Profil',
    'settings.security': 'Sécurité',
    'settings.preferences': 'Préférences',
    'settings.notifications': 'Notifications',
    'settings.theme': 'Thème',
    'settings.language': 'Langue',
    'settings.currency': 'Devise',
    'settings.timezone': 'Fuseau Horaire',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.warning': 'Avertissement',
    'common.info': 'Information',
  },
  de: {
    'app.title': 'BigBikeBlitz',
    'nav.home': 'Startseite',
    'nav.categories': 'Kategorien',
    'nav.cart': 'Warenkorb',
    'nav.profile': 'Profil',
    'nav.settings': 'Einstellungen',
    'nav.orders': 'Bestellungen',
    'nav.logout': 'Abmelden',
    'auth.login': 'Anmelden',
    'auth.register': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.confirmPassword': 'Passwort Bestätigen',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.rememberMe': 'Angemeldet Bleiben',
    'auth.noAccount': 'Noch kein Konto?',
    'auth.hasAccount': 'Bereits ein Konto?',
    'product.addToCart': 'Zum Warenkorb Hinzufügen',
    'product.addToWishlist': 'Zu Favoriten Hinzufügen',
    'product.removeFromWishlist': 'Von Favoriten Entfernen',
    'cart.empty': 'Ihr Warenkorb ist leer',
    'cart.checkout': 'Zur Kasse',
    'cart.total': 'Gesamt',
    'settings.profile': 'Profil',
    'settings.security': 'Sicherheit',
    'settings.preferences': 'Einstellungen',
    'settings.notifications': 'Benachrichtigungen',
    'settings.theme': 'Design',
    'settings.language': 'Sprache',
    'settings.currency': 'Währung',
    'settings.timezone': 'Zeitzone',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.warning': 'Warnung',
    'common.info': 'Information',
  }
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load user preferences on mount
  useEffect(() => {
    loadUserPreferences();
  }, []);

  // Watch for system theme changes when auto mode is enabled
  useEffect(() => {
    if (currentTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      setIsDarkMode(mediaQuery.matches);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setIsDarkMode(currentTheme === 'dark');
    }
  }, [currentTheme]);

  const loadUserPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.get('/api/user/settings');
        if (response.data?.preferences) {
          const { theme, language } = response.data.preferences;
          setCurrentTheme(theme || 'light');
          setCurrentLanguage(language || 'en');
        }
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  const setTheme = async (theme: 'light' | 'dark' | 'auto') => {
    setCurrentTheme(theme);
    try {
      await api.put('/api/user/preferences', { theme });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setLanguage = async (language: string) => {
    setCurrentLanguage(language);
    try {
      await api.put('/api/user/preferences', { language });
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  // Ant Design theme configuration
  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
    components: {
      Layout: {
        bodyBg: isDarkMode ? '#141414' : '#f7f9fb',
        headerBg: isDarkMode ? '#1f1f1f' : '#fff',
        siderBg: isDarkMode ? '#1f1f1f' : '#fff',
      },
      Card: {
        headerBg: isDarkMode ? '#1f1f1f' : '#fff',
      },
    },
  };

  const value = {
    currentTheme,
    currentLanguage,
    setTheme,
    setLanguage,
    isDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>
        <IntlProvider 
          messages={messages[currentLanguage as keyof typeof messages] || messages.en}
          locale={currentLanguage}
          defaultLocale="en"
        >
          {children}
        </IntlProvider>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 