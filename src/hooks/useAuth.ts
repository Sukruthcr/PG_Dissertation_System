import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { LoginCredentials, AuthToken, AuthError, SessionData } from '../types/auth';
import { 
  authenticateUser, 
  validateToken, 
  refreshToken, 
  logout as authLogout,
  getSessionData,
  saveSessionData,
  hasPermission
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  permissions: string[];
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize authentication state from stored session
    const initializeAuth = async () => {
      try {
        const sessionData = getSessionData();
        
        if (sessionData && sessionData.token && sessionData.user) {
          // Validate stored token
          if (validateToken(sessionData.token)) {
            setUser(sessionData.user);
            setPermissions(sessionData.permissions || []);
            
            // Auto-refresh token if it's close to expiry (within 2 hours)
            if (sessionData.token.expiresAt - Date.now() < 2 * 60 * 60 * 1000) {
              const newToken = refreshToken(sessionData.token);
              const updatedSessionData = {
                ...sessionData,
                token: newToken
              };
              saveSessionData(updatedSessionData);
            }
          } else {
            // Token expired, clear all data
            authLogout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        authLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authenticateUser(credentials);
      
      if ('type' in result) {
        // Authentication failed
        const authError = result as AuthError;
        setError(authError.message);
        throw new Error(authError.message);
      }
      
      // Authentication successful
      const { user: authenticatedUser, token, permissions: userPermissions } = result;
      
      // Create session data
      const sessionData: SessionData = {
        token,
        user: authenticatedUser,
        permissions: userPermissions,
        loginTime: new Date().toISOString()
      };
      
      // Save session data securely
      saveSessionData(sessionData);
      
      // Update state
      setUser(authenticatedUser);
      setPermissions(userPermissions);
      
    } catch (error) {
      // Error is already set in setError above
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setPermissions([]);
    setError(null);
    authLogout();
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      
      // Update stored session data
      const sessionData = getSessionData();
      if (sessionData) {
        const updatedSessionData = {
          ...sessionData,
          user: updatedUser
        };
        saveSessionData(updatedSessionData);
      }
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return {
    user,
    loading,
    permissions,
    login,
    logout,
    updateUser,
    hasPermission: checkPermission,
    error,
    isAuthenticated: !!user,
  };
};

export { AuthContext };