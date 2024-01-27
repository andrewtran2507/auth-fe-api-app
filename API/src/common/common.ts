import * as argon2 from 'argon2';

// export const hashData = (data: string) => {
//     return argon2.hash(data);
// }

export function hashData(data: string) {
  return argon2.hash(data);
}
