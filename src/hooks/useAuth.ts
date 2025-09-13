import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { LoginCredentials, AuthToken, AuthError } from '../types/auth';
import { authenticateUser, validateToken, refreshToken, logout as authLogout } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user session and validate token
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedUser && storedToken) {
          const token: AuthToken = JSON.parse(storedToken);
          
          // Validate token
          if (validateToken(token)) {
            setUser(JSON.parse(storedUser));
            
            // Refresh token if it's close to expiry (within 2 hours)
            if (token.expiresAt - Date.now() < 2 * 60 * 60 * 1000) {
              const newToken = refreshToken(token);
              localStorage.setItem('auth_token', JSON.stringify(newToken));
            }
          } else {
            // Token expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
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
      const { user: authenticatedUser, token } = result;
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      localStorage.setItem('auth_token', JSON.stringify(token));
      
    } catch (error) {
      // Error is already set in setError above
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    setError(null);
    authLogout();
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    error,
  };
};

export { AuthContext };