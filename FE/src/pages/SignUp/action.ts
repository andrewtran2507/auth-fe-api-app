import axios from '../../utils/axios';

export const createUser = async (
  email: string | null,
  username: string | null,
  password: string | null,
) => {
  const response = await axios.post(
    'auth/signup',
    JSON.stringify({
      email,
      username,
      password,
    }),
  );
  return response.data;
};
