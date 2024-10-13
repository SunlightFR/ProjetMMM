import {ApiInterface} from "@/api/apiInterface";
import {
    account,
    DATABASE_ID,
    databases,
    PROJECTS_COLLECTION_ID,
    RESOURCES_COLLECTION_ID, storage, STORAGE_PICS_ID,
    USERS_COLLECTION_ID
} from "@/lib/appwrite";
import {User, UserId, UserRole} from "@/api/models/User";
import {ID, Permission, Query, Role} from "react-native-appwrite";
import {Project, ProjectStatus} from "@/api/models/Project";
import {Resource, ResourceId} from "@/api/models/Resource";
import {Problem, ProblemId} from "@/api/models/Problems";
import {ProjectInput, ResourceInput} from "@/types/inputTypes";
import {CameraCapturedPicture} from "expo-camera";

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
        // return Promise.resolve([
        //     {
        //         end:new Date(),
        //         manager_id:managerId,
        //         clientNumber:'029988.....',
        //         resources:[] as ResourceId[],
        //         object:"Chantier 1",
        //         location:"Paris",
        //         problems:[] as ProblemId[],
        //         status:"not-done",
        //         start:new Date(),
        //         supervisor_id:'0',
        //         id:'25'
        //     }
        // ])
        try{
            const results = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID,[
                Query.equal("manager_id",managerId)
            ])
            const projects:Project[] = results.documents.map(d=>({
                duration:d.duration,
                manager_id:managerId,
                clientNumber:d.clientNumber,
                resources:d.resources,
                object:d.object,
                location:d.location,
                problems:d.problems,
                status:d.status,
                start:d.start,
                supervisor_id:d.supervisor_id,
                pics:d.pics,
                id:d.$id
            }))
            return projects;
        }catch(e){
            console.error("get manager projects",e)
            return Promise.reject(e)
        }
    },

    createProject:async(projectInput:ProjectInput) =>{
        try{
            const result = await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(),{
                ...projectInput,
                problems:[],
                pics:['670bc0e200302924b3ba']
            },[
                Permission.write(Role.user(projectInput.supervisor_id)),
                Permission.write(Role.user(projectInput.manager_id))
            ]);
            return {
                ...projectInput,
                id:result.$id,
                problems:[] as ProblemId[],
                pics:['670bc0e200302924b3ba'],
            } as Project
        }catch (e){
            console.error(e)
            return Promise.reject(e)
        }
    },

    createResource:async (resourceInput:ResourceInput, authorizedUsers:UserId[],supervisorId:UserId)=>{
        //todo permissions
        const permissions = authorizedUsers.map(id=>Permission.write(Role.user(id)))
        try{
            const result = await databases.createDocument(
                DATABASE_ID,
                RESOURCES_COLLECTION_ID,
                ID.unique(),
                resourceInput,
                permissions
            );
            return {
                ...resourceInput,
                id:result.$id
            } as Resource
        }catch (e){
            console.error(e)//todo
            return Promise.reject(e)
        }
    },

    getResourceById:async (resourceId) => {
        try{
            const results = await databases.listDocuments(DATABASE_ID, RESOURCES_COLLECTION_ID,[
                Query.equal("id",resourceId)
            ])
            const document = results.documents[0]
            return {
                id:document.$id,
                name:document.name,
                type:document.type
            }
        }catch(e){
            console.error(e)//todo
            return Promise.reject(e)
        }
    },

    getProblemById:async(problemId:ProblemId):Promise<Problem>=>{
        return {
            id:'02',
            description:"description pb",
            title:"problème"
        }
    },
    uploadPicture:async (picture:CameraCapturedPicture)=>{
        try{
            return storage.createFile(STORAGE_PICS_ID, ID.unique(), {
                name:"",
                type:"jpg",
                uri:picture.uri,
                size:picture.width
            })

        }catch(e){
            return Promise.reject(e)
        }
    },

    getPictureUrl:(pictureId:string)=>{
        return storage.getFileView(STORAGE_PICS_ID,pictureId).toString();
    },

    getPicturePreview:(pictureId:string, width:number, height:number)=>{
        return storage.getFilePreview(STORAGE_PICS_ID, pictureId, width, height, 'center', 100).toString()
    },

    // addPictureToProject:(pictureId, projectId)=>{
    //     try{
    //         const document = await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
    //         const pics = document.pics;
    //         return await databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID,projectId, {
    //             pics: [...pics, pictureId]
    //         });
    //
    //     }catch(e){
    //
    //     }
    // }

}