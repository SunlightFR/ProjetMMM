import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import {account, teams, databases} from "@/lib/appwrite";
import { toast } from "@/lib/toast";
import {User, UserId, UserRole} from "@/api/models/User";
import {APIService} from "@/api/appwriteApi";

interface UserContextType {
    login:(email:string, password:string)=>Promise<void>,
    register:(email:string, password:string, firstName:string, lastName:string, role:UserRole)=>Promise<void>,
    logout:()=>Promise<void>,
    current:User | null,
    addContact:(userId:UserId)=>Promise<User>,
    loading:boolean
}

const UserContext = createContext<UserContextType>();

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({children}) {
    const [user, setUser] = useState<User|null>(null)
    const [loading, setLoading] = useState(true);

    async function login(email:string, password:string) {
        try {
            if(user){
                await logout();
            }
            const u = await APIService.login(email, password);
            setUser(u);
            toast('Welcome back. You are logged in');
        }catch(e){
            console.log("login ctx", e)
        }
    }

    async function logout() {
        await account.deleteSession("current");
        setUser(null);
        // toast('Logged out');
    }

    async function register(email:string, password:string, firstName:string, lastName:string,role:UserRole) {
        try {
            if(user){
                await logout()
            }
            const u = await APIService.register(email,password, firstName, lastName, role);
            console.log("registered:",u)
            setUser(u)
        }catch(e){
            console.log(e)
            toast(e)
        }
    }

    async function createMembership(teamId:string, email:string){
        try{
            await databases.createDocument('67059627002e0309280e','6705ae78001510b08394',ID.unique(),{
                test:"bonjourent"
            })
            // await teams.createMembership(teamId, ['truc'], "groudonkyogre22@gmail.com",undefined,undefined,'https://cloud.appwrite.io/v1',undefined)
        }
        catch(e){
            console.log(e)
        }
    }

    async function joinTeam(teamId:string){
        try{
            await teams.createMembership(teamId, ['unverified'], undefined, userId)
            toast("Vous avez rejoint la team")
        }catch(e){
            console.log(e)
            toast(e)
        }
    }

    async function addContact(userId:UserId){
        try{
            const u_ = await APIService.getUserById(userId);
            if(!u_){
                throw new Error("existe pas")
            }
            const contacts =  [...user!.contacts, userId]
            await APIService.updateContacts(user!.userId, contacts)
            setUser(u=>({
                ...u!,
                contacts:contacts
            }))
            return Promise.resolve(u_)
        }catch(e){
            return Promise.reject(e);
        }
    }


    async function init() {
        console.log("init")
        try {
            const loggedIn = await account.get();

            console.log(loggedIn)
            const userData = await APIService.getUserById(loggedIn.$id)
            setUser(userData);
            toast('Welcome back. You are logged in');
            return Promise.resolve()
        } catch (err) {
            setUser(null);
            return Promise.resolve()
        }
    }

    useEffect(() => {
        init().then(()=>{
            console.log("fin de l'initialisation")
            setLoading(false)
        }).catch(e=>{
            console.error(e)
        });
    }, []);

    return (
        <UserContext.Provider value={{ current:user, addContact, login, logout, register, loading, joinTeam, createMembership}}>
            {children}
        </UserContext.Provider>
    );
}
