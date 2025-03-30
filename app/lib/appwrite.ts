import { Client, Account, Databases, ID, Models } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const account = new Account(client);
const databases = new Databases(client);

const databaseId = process.env.APPWRITE_DATABASE_ID!;
const collectionId = process.env.APPWRITE_USER_COLLECTION_ID!;

export { client, account, databases, databaseId, collectionId, ID };
export type { Models };