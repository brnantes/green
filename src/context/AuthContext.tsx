import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUsername: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createUser: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar sessão atual ao carregar
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsLoggedIn(true);
        // Extrair username dos metadados do usuário
        const username = data.session.user.user_metadata?.username || null;
        setCurrentUsername(username);
      }
    };
    
    checkSession();
    
    // Monitorar mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      setCurrentUsername(session?.user?.user_metadata?.username || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Como o Supabase usa email, usaremos username@example.com como padrão
      const email = `${username.toLowerCase()}@admin.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      setIsLoggedIn(true);
      setCurrentUsername(username);
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: 'Nome de usuário ou senha inválidos' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setCurrentUsername(null);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  
  const createUser = async (username: string, password: string) => {
    try {
      // Como o Supabase precisa de email, usaremos username@example.com como padrão
      const email = `${username.toLowerCase()}@admin.local`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username, // Armazenar o nome de usuário nos metadados
          }
        }
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      return { success: false, error: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUsername,
        login,
        logout,
        createUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
