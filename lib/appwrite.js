import {Client, Account, Databases, Teams, Storage} from 'react-native-appwrite';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670465fa000e2d402de7')
    .setPlatform('fr.istic.mmm');

export const account = new Account(client);
export const teams = new Teams(client)
export const databases = new Databases(client);

export const storage = new Storage(client);

export const DATABASE_ID = '67059627002e0309280e'
export const USERS_COLLECTION_ID = '6705963500152ffe1f2c'
export const PROJECTS_COLLECTION_ID = '6707cae1000532a86376'
export const RESOURCES_COLLECTION_ID = '670799d10000ededf114'
export const PROBLEMS_COLLECTION_ID = '670d9ce100207cdfbb3e'

export const STORAGE_PICS_ID = "670bc035002e47b09ad5"
