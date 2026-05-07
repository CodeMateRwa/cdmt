import type { ReactNode } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import AdminLogin from '../../pages/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isChecking } = useAdminAuth();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f3] px-4">
        <div className="rounded-[2rem] border border-black/5 bg-white px-8 py-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f9d24]">
            Admin Session
          </p>
          <p className="mt-3 text-sm text-black/55">Checking secure access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
