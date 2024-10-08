import { ID } from "react-native-appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { toast } from "@/lib/toast";

interface UserContextType {
    login:(email:string, password:string)=>Promise<void>,
    register:(email:string, password:string)=>Promise<void>,
    logout:()=>Promise<void>,
    userId:string|null,
    loading:boolean
}

const UserContext = createContext<UserContextType>();

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({children}) {
    const [userId, setUserId] = useState<string|null>(null);
    const [loading, setLoading] = useState(true);

    async function login(email:string, password:string) {
        const loggedIn = await account.createEmailPasswordSession(email, password);
        setUserId(loggedIn.userId);
        toast('Welcome back. You are logged in');
    }

    async function logout() {
        await account.deleteSession("current");
        setUserId(null);
        toast('Logged out');
    }

    async function register(email:string, password:string) {
        try {
            await account.create(ID.unique(), email, password);
            await login(email, password);
            toast('Account created');
        }catch(e){
            toast(e)
        }
    }

    async function init() {
        try {
            const loggedIn = await account.get();
            setUserId(loggedIn.$id);
            toast('Welcome back. You are logged in');
        } catch (err) {
            setUserId(null);
        }
    }

    useEffect(() => {
        init().then(()=>{
            setLoading(false)
        });
    }, []);

    return (
        <UserContext.Provider value={{ userId: userId, login, logout, register, loading}}>
            {children}
        </UserContext.Provider>
    );
}
