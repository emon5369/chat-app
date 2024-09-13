import config from '../config/config';
import { Account, Client, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint(config.appwriteUrl)
    .setProject(config.appwriteProjectId);

export const databases = new Databases(client);
export const account= new Account(client);

export default client;