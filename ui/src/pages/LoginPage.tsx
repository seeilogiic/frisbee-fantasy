import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/players');
    }
  }, [user, navigate]);

  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Frisbee Fantasy
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in or create an account to manage your fantasy team
          </p>
        </div>
        {!configured && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Configuration Required:</strong> Please set up your Supabase credentials in <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
            </p>
            <p className="text-xs text-yellow-700 mt-2">
              Add: <code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>
            </p>
          </div>
        )}
        {configured && (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#111827',
                    brandAccent: '#374151',
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/players`}
            onlyThirdPartyProviders={false}
            view="sign_in"
          />
        )}
      </div>
    </div>
  );
}

