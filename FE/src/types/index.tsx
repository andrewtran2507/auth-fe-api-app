export type TLoginInput = {
  email: string | null;
  password: string | null;
};

export type TLogInData =
  | (TLoginInput & {
      id: string;
      email: string;
      username: string;
      token: string;
      refreshToken: string;
      created_at: Date;
      updated_at: Date;
      deleted_at: null;
      is_activated: boolean;
    })
  | null;

export type TSignupInput = TLoginInput & {
  username: string | null;
};

export type TResponseError = {
  statusCode: number;
  message: string;
};

export enum EIconStatus {
  'success' = 'success',
  'info' = 'info',
  'warning' = 'warning',
  'error' = 'error',
  'undefined' = 'undefined',
}
