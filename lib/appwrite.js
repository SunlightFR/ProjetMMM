import { Client, Account, Databases} from 'react-native-appwrite';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('670465fa000e2d402de7')
    .setPlatform('fr.istic.mmm');

export const account = new Account(client);
export const databases = new Databases(client);