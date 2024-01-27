import { useState, lazy, FC, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query';

import AppLayout from './components/Layout/AppLayout';

import './index.scss';
import './styles/main.scss';
import { TLogInData } from './types';

const queryClient = new QueryClient();
const defaultTheme = createTheme();
const LogIn = lazy(() => import('./pages/LogIn'));
const SignUp = lazy(() => import('./pages/SignUp'));

function PublicPage() {
  return <h3>Public</h3>;
}

const App: FC = () => {
  const [auth, setAuth] = useState<TLogInData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // const [locale, setLocale] = useState<LocaleKey>('en-gb');
  const location = useLocation();
  useEffect(() => {
    const authData: TLogInData = JSON.parse(localStorage.getItem('auth') || '{}');
    if (authData?.id && authData.email) {
      setAuth(authData);
      navigate('/');
      console.log('navigate home page');
    } else {
      if (location.pathname === '/log-in') {
        navigate('log-in');
      } else if (location.pathname === '/sign-up') {
        navigate('sign-up');
      } else {
        navigate('log-in');
      }
    }
    const tm = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(tm);
    };
  }, [location.pathname, navigate]);

  if (isLoading) {
    return <></>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <Suspense fallback={<p>@ Loading...</p>}>
          <Routes>
            <Route element={<AppLayout auth={auth} />}>
              <Route path="/" element={<PublicPage />} />
              <Route path="log-in" element={<LogIn />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
