import { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Outlet, useNavigate } from 'react-router-dom';
import { TLogInData } from '../../types';

const AppLayout: FC<{ auth: TLogInData }> = ({ auth }: { auth: TLogInData }) => {
  const [authData, setAuthData] = useState<TLogInData>(null);
  const navigate = useNavigate();
  const onSignOutClick = () => {
    localStorage.removeItem('auth');
    navigate('log-in');
    setAuthData(null);
  };

  useEffect(() => {
    setAuthData(auth);
  }, [auth]);

  return (
    <>
      <div
        style={{
          textAlign: 'right',
          position: 'absolute',
          top: 4,
          right: 4,
          width: '100%',
          zIndex: 9999,
        }}>
        {authData && authData.email && (
          <>
            Hi <b>{auth?.username}</b>, Have a nice day
            <br />
            <br />
            <Button variant="contained" color="success" onClick={onSignOutClick}>
              Sign Out
            </Button>
          </>
        )}
      </div>
      <Outlet />
    </>
  );
};

export default AppLayout;
