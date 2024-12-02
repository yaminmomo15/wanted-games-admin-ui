import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    context.checkAuthStatus()
      .finally(() => setIsLoading(false));
  }, [context, context.checkAuthStatus]);

  return { ...context, isLoading };
}

export { useAuth };

