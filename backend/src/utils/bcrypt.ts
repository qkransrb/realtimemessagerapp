import { hash, compare } from "bcryptjs";

export const hashValue = async (value: string, salt: number = 10) => {
  return await hash(value, salt);
};

export const compareValue = async (value: string, hashed: string) => {
  return await compare(value, hashed);
};
