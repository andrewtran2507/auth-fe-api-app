export const handleFormLogInValidate = (
  email: string | null,
  password: string | null,
  username?: string | null,
) => {
  const passwordRegex = /^.{7,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  let emailError = '';
  let passwordError = '';
  let usernameError = '';
  if (email === '') {
    emailError = 'Email is required';
  } else if (email && !emailRegex.test(email)) {
    emailError = 'Email is invalid';
  }
  if (password === '') {
    passwordError = 'Password is required';
  } else if (password && !passwordRegex.test(password)) {
    passwordError = 'Password should contain at least 7 characters';
  }
  if (username === '') {
    usernameError = 'Username is required';
  }
  return {
    emailError,
    passwordError,
    usernameError,
  };
};
