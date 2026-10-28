import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, BCRYPT_COST);
};
console.log("Start");
hashPassword("123456")
  .then((result) => console.log(result))
  .catch(async (error) => {
    console.log(error);
  });
console.log("end");
