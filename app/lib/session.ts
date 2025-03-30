// lib/session.ts
import { account } from './appwrite';

export const verifySession = async () => {
  try {
    const session = await account.getSession('current');
    const user = await account.get();
    return { session, user };
  } catch (error) {
    return { session: null, user: null };
  }
};