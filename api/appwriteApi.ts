import {ApiInterface} from "@/api/apiInterface";
import {account, DATABASE_ID, databases, PROJECTS_COLLECTION_ID, USERS_COLLECTION_ID} from "@/lib/appwrite";
import {User, UserId, UserRole} from "@/api/models/User";
import {ID, Permission, Query, Role} from "react-native-appwrite";
import {Project, ProjectStatus} from "@/api/models/Project";
import {ResourceId} from "@/api/models/Resource";
import {ProblemId} from "@/api/models/Problems";

export const APIService:ApiInterface = {
    logout:async()=>{
        await account.deleteSession("current");
    },

    getUserById:async (userId:string):Promise<User>=>{
        try {
            const userData = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
            return {
                userId:userId,
                role:userData.role,
                firstName:userData.firstName,
                lastName:userData.lastName
            }
        }catch(e){
            return Promise.reject(e);
        }
    },

    login:async(email, password) => {
        console.log("login")
        try {
            const session = await account.createEmailPasswordSession(email, password);
            console.log("session",session.userId, session.$id)
            return await APIService.getUserById(session.userId);
        }catch (e){
            console.error(e)
            return Promise.reject(e)
        }
    },

    register:async (email:string, password:string,firstName:string,lastName:string, role:UserRole)=>{
        try{
            await APIService.logout();
            const x = await account.create(ID.unique(), email, password);
            // const loggedIn = await account.createEmailPasswordSession(email, password);
            const y = await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, x.$id,{
                firstName:firstName,
                lastName:lastName,
                role:role
            },[
                Permission.read(`user:${x.$id}`),  // Permission de lecture pour l'utilisateur
                Permission.update(`user:${x.$id}`),  // Permission de mise à jour
                Permission.delete(`user:${x.$id}`)
            ])
            return Promise.resolve({
                userId:x.$id,
                firstName:firstName,
                lastName:lastName,
                role:role
            })
        }catch(e){
            return Promise.reject(e)
        }
    },

    getManagerProjects:async(managerId:UserId)=>{
        return Promise.resolve([
            {
                end:new Date(),
                manager_id:managerId,
                clientNumber:'029988.....',
                resources:[] as ResourceId[],
                object:"Chantier 1",
                location:"Paris",
                problems:[] as ProblemId[],
                status:"not-done",
                start:new Date(),
                supervisor_id:'0',
                id:'25'
            }
        ])
        try{
            const documents = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID,[
                Query.equal("manager_id",managerId)
            ])
            const projects:Project[] = documents.documents.map(d=>({
                end:d.end,
                manager_id:managerId,
                clientNumber:d.clientNumber,
                resources:d.resources,
                object:d.object,
                location:d.location,
                problems:d.problems,
                status:d.status,
                start:d.start,
                supervisor_id:d.supervisor_id,
                id:d.$id
            }))
            return projects;
        }catch(e){
            console.error("get manager projects",e)
            return Promise.reject(e)
        }
    },

    createProject:async(
        object:string,
        manager_id:UserId,
        supervisor_id:UserId,
        resources:ResourceId[],
        status:ProjectStatus,
        start:Date,
        end:Date,
        location:string,
        clientNumber:string
    ) =>{
        try{
            const result = await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(),{
                object:object,
                manager_id:manager_id,
                supervisor_id:supervisor_id,
                resources:resources,
                status:status,
                start:start,
                end:end,
                location:location,
                clientNumber:clientNumber,
                problems:[]
            },[
                Permission.write(Role.user(supervisor_id)),
                Permission.write(Role.user(manager_id))
            ]);
            return {
                id:result.$id,
                object:object,
                manager_id:manager_id,
                supervisor_id:supervisor_id,
                resources:resources,
                status:status,
                start:start,
                end:end,
                location:location,
                clientNumber:clientNumber,
                problems:[] as ProblemId[]
            } as Project
        }catch (e){
            console.error(e)
            return Promise.reject(e)
        }
    }
}