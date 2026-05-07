import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiClient
      .getAdminSession()
      .then((session) => {
        if (mounted) {
          setIsAuthenticated(session.authenticated);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsChecking(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (password: string) => {
    const session = await apiClient.loginAdmin(password);
    setIsAuthenticated(session.authenticated);
    return session.authenticated;
  };

  const logout = async () => {
    await apiClient.logoutAdmin();
    setIsAuthenticated(false);
    window.location.reload();
  };

  return { isAuthenticated, isChecking, login, logout };
}
