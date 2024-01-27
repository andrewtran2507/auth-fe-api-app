import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth: FC<{ children: JSX.Element }> = ({ children }: { children: JSX.Element }) => {
  const auth: any = JSON.parse(localStorage.getItem('auth') || '{}');

  if (!auth.id && !auth.eamail) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
