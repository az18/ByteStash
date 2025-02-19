import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { register } from '../../utils/api/auth';
import { PageContainer } from '../common/layout/PageContainer';
import { useToast } from '../../hooks/useToast';
import { AlertCircle } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { OIDCConfig } from '../../types/auth';
import { apiClient } from '../../utils/api/apiClient';

export const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oidcConfig, setOIDCConfig] = useState<OIDCConfig | null>(null);
  const { login, authConfig, isAuthenticated, refreshAuthConfig } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOIDCConfig = async () => {
      try {
        const response = await apiClient.get<OIDCConfig>('/api/auth/oidc/config');
        setOIDCConfig(response);
      } catch (error) {
        console.error('Failed to fetch OIDC config:', error);
      }
    };
    
    fetchOIDCConfig();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!authConfig?.allowNewAccounts && authConfig?.hasUsers) {
    return (
      <PageContainer className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Disabled</h2>
          <p className="text-gray-400 mb-4">New account registration is currently disabled.</p>
          <Link 
            to="/login" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Return to Login
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const response = await register(username, password);
      if (response.token && response.user) {
        await refreshAuthConfig();
        login(response.token, response.user);
      }
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to register';
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOIDCLogin = () => {
    window.location.href = `${window.__BASE_PATH__}/api/auth/oidc/auth`;
  };

  return (
    <PageContainer className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {authConfig?.hasUsers ? (
              <>
                Or{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300">
                  sign in to your account
                </Link>
                {' '}or{' '}
                <Link to={ROUTES.PUBLIC_SNIPPETS} className="text-blue-400 hover:text-blue-300">
                  browse public snippets
                </Link>
              </>
            ) : (
              <div className="mt-4 relative overflow-hidden">
                <div className="rounded-xl bg-gradient-to-r from-blue-600/10 to-blue-400/10 p-4 border border-blue-400/20">
                  <div className="flex gap-3 items-start">
                    <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center flex-shrink-0 mt-0.25">
                      <AlertCircle size={14} className="text-blue-400" />
                    </div>
                    <p className="text-sm text-blue-200 text-left">
                      This is the first account to be created. All existing snippets will be
                      automatically migrated to this account.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </p>
        </div>

        {oidcConfig?.enabled && (
          <>
            <button
              onClick={handleOIDCLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 
                bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign in with {oidcConfig.displayName}
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
              <span className="px-2 bg-gray-900 text-gray-500 text-sm">
                  Or continue with password
                </span>
              </div>
            </div>
          </>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-700 placeholder-gray-500 text-white bg-gray-800
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                  border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};