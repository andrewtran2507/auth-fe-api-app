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
import ReportIcon from '@mui/icons-material/Report';
import { Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingButton } from '@mui/lab';

import { handleFormLogInValidate } from '../../utils/functions/common';
import { EIconStatus, TResponseError, TSignupInput } from '../../types';
import './index.scss';
import { createUser } from './action';

const SignUp: FC = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState<TSignupInput>({
    email: '',
    username: '',
    password: '',
  });
  const [formError, setFormError] = useState<TSignupInput>({
    email: '',
    username: '',
    password: '',
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [iconStatus, setIconStatus] = useState<
    'success' | 'info' | 'warning' | 'error' | undefined
  >(EIconStatus.success);

  const createUserAction = async () =>
    await createUser(formValue.email, formValue.username, formValue.password);

  const { data, error, refetch, isLoading } = useQuery('createUser', createUserAction, {
    enabled: false,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmit(true);
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string | null;
    const username = data.get('username') as string | null;
    const password = data.get('password') as string | null;
    setFormValue({ email, username, password });

    const check = handleFormValidate(email, password, username);
    if (!check) {
      return;
    }
    refetch();
  };

  const handleFormValidate = (
    email: string | null,
    password: string | null,
    username?: string | null,
  ) => {
    const validateResult = handleFormLogInValidate(email, password, username);
    setFormError({
      email: validateResult.emailError,
      username: validateResult.usernameError,
      password: validateResult.passwordError,
    });
    if (Object.values(validateResult).some((value) => value !== '')) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (data) {
      setMessage('Signup successfully');
      setIconStatus(EIconStatus.success);
      navigate('/log-in');
    }
    return;
  }, [data, navigate]);

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
    isSubmit && handleFormValidate(formValue.email, formValue.password, formValue.username);
  }, [formValue, isSubmit]);
  useEffect(() => {
    setMessage('');
  }, [formValue]);

  const handleNavigateLogIn = () => {
    navigate('/log-in');
  };

  const IconStatusComponent =
    iconStatus === EIconStatus.success ? <CheckCircleIcon /> : <ReportIcon />;

  const messageVisibility = useMemo(() => {
    return message === '' ? 'hidden' : 'visible';
  }, [message]);

  return (
    <>
      <div className="signup">
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
                Signup
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
                className="form">
                <TextField
                  inputProps={{ 'data-testid': 'username-input' }}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  helperText={formError.username}
                  error={isSubmit && formError.username !== ''}
                  onChange={(value) =>
                    setFormValue((state) => {
                      return { ...state, username: value.target.value };
                    })
                  }
                />
                <TextField
                  inputProps={{ 'data-testid': 'email-input' }}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                  Sign Up
                </LoadingButton>
                <div className="bottom-text">
                  <span>Already have an account?</span>
                  <span className="navigate-text" onClick={handleNavigateLogIn}>
                    Login
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

export default SignUp;
