import axios from '../../utils/axios';

export const getUser = async (email: string | null, password: string | null) => {
  const response = await axios.post(
    'auth/login',
    JSON.stringify({
      email,
      password,
    }),
  );
  return response.data;
};
