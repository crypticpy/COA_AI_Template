import React, { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication context type
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth context provider component
 */
export const AuthContextProvider: React.FC<{
  children: React.ReactNode;
  value: AuthContextType;
}> = ({ children, value }) => (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);

/**
 * Hook to access authentication context
 * Must be used within an AuthContextProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
