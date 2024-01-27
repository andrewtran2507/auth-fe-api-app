import React, { FC, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

// MUI
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Alert } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingButton } from '@mui/lab';

import { handleFormLogInValidate } from '../../utils/functions/common';
import { EIconStatus, TLoginInput, TResponseError } from '../../types';
import { getUser } from './action';
import './index.scss';

const LogIn: FC = () => {
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState<TLoginInput>({ email: '', password: '' });
  const [formError, setFormError] = useState<TLoginInput>({ email: '', password: '' });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [iconStatus, setIconStatus] = useState<
    'success' | 'info' | 'warning' | 'error' | undefined
  >(EIconStatus.success);

  const getUserAction = async () => await getUser(formValue.email, formValue.password);
  const { data, error, refetch, isLoading } = useQuery('getUser', getUserAction, {
    enabled: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmit(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;
    setFormValue({ email, password });

    const check = handleFormValidate(email, password);
    if (!check) {
      return;
    }
    refetch();
  };
  const handleFormValidate = (email: string | null, password: string | null) => {
    const validateResult = handleFormLogInValidate(email, password);
    setFormError({ email: validateResult.emailError, password: validateResult.passwordError });
    if (Object.values(validateResult).some((value) => value !== '')) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (data) {
      setMessage('Login successfully');
      setIconStatus(EIconStatus.success);
      localStorage.setItem('auth', JSON.stringify(data));
      navigate(0);
    }
    return;
  }, [data]);

  useEffect(() => {
    if (error) {
      setIconStatus(EIconStatus.error);
      const errorLogin = error as AxiosError;
      if (errorLogin.response) {
        const res = errorLogin.response.data as TResponseError;
        setMessage(res.message);
      } else if (errorLogin.request) {
        setMessage('Network Error');
      } else {
        setMessage('Something went wrong');
      }
    }
  }, [error]);

  useEffect(() => {
    setMessage('');
    isSubmit && handleFormValidate(formValue.email, formValue.password);
  }, [formValue, isSubmit]);
  useEffect(() => {
    setMessage('');
  }, [formValue]);

  const handleNavigateSignUp = () => {
    navigate('/sign-up');
  };

  const IconStatusComponent =
    iconStatus === EIconStatus.success ? <CheckCircleIcon /> : <ReportIcon />;

  const messageVisibility = useMemo(() => {
    return message === '' ? 'hidden' : 'visible';
  }, [message]);

  return (
    <>
      <div className="login">
        <Container component="main" maxWidth="xs" className="container">
          <CssBaseline>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.5em 1.5em',
                borderRadius: 1,
                border: '1px solid',
                borderColor: '#b0bec5',
              }}>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
                className="form">
                <TextField
                  inputProps={{ 'data-testid': 'email-input' }}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  helperText={formError.email}
                  error={isSubmit && formError.email !== ''}
                  onChange={(value) =>
                    setFormValue((state) => {
                      return { ...state, email: value.target.value };
                    })
                  }
                />
                <TextField
                  inputProps={{ 'data-testid': 'password-input' }}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  helperText={formError.password}
                  error={isSubmit && formError.password !== ''}
                  onChange={(value) =>
                    setFormValue((state) => {
                      return { ...state, password: value.target.value };
                    })
                  }
                />
                <div style={{ visibility: messageVisibility }}>
                  <Alert color={iconStatus} icon={IconStatusComponent}>
                    {message}
                  </Alert>
                </div>
                <LoadingButton
                  loading={isLoading}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Login
                </LoadingButton>
                <div className="bottom-text">
                  <span>Doesn&apos;t have an account?</span>
                  <span onClick={handleNavigateSignUp} className="navigate-text">
                    Signup
                  </span>
                </div>
              </Box>
            </Box>
          </CssBaseline>
        </Container>
      </div>
    </>
  );
};

export default LogIn;
