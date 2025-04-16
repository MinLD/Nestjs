const bcrypt = require('bcrypt');

const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (err) {
    console.log(err);
  }
};
export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string | undefined,
) => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (err) {
    console.log(err);
  }
};
