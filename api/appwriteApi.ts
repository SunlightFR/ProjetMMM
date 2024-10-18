import {ApiInterface} from "@/api/apiInterface";
import {
    account,
    DATABASE_ID,
    databases, PROBLEMS_COLLECTION_ID,
    PROJECTS_COLLECTION_ID,
    RESOURCES_COLLECTION_ID, storage, STORAGE_PICS_ID,
    USERS_COLLECTION_ID
} from "@/lib/appwrite";
import {User, UserId, UserRole} from "@/api/models/User";
import {ID, Permission, Query, Role} from "react-native-appwrite";
import {Project, ProjectId, ProjectStatus} from "@/api/models/Project";
import {Resource, ResourceId} from "@/api/models/Resource";
import {Problem, ProblemId} from "@/api/models/Problems";
import {ProblemInput, ProjectInput, ResourceInput} from "@/types/inputTypes";
import {ImagePickerAsset} from "expo-image-picker";

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
                lastName:userData.lastName,
                contacts:userData.contacts
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
                role:role,
                contacts:[]
            },[
                Permission.update(`user:${x.$id}`),
                Permission.delete(`user:${x.$id}`)
            ])
            return Promise.resolve({
                userId:x.$id,
                firstName:firstName,
                lastName:lastName,
                role:role,
                contacts:[]
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
        console.log(projectInput.supervisor_id, projectInput.manager_id, projectInput.duration)

        try{
            const result = await databases.createDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, ID.unique(),{
                ...projectInput,
                problems:[],
                pics:[]
            },[
                Permission.write(Role.user(projectInput.supervisor_id)),
                Permission.write(Role.user(projectInput.manager_id)),
                Permission.read(Role.user(projectInput.manager_id)),
                Permission.read(Role.user(projectInput.supervisor_id))
            ]);
            return {
                ...projectInput,
                id:result.$id,
                problems:[] as ProblemId[],
                pics:[],
            } as Project
        }catch (e){
            console.error(e)
            return Promise.reject(e)
        }
    },

    createResource:async (resourceInput:ResourceInput, authorizedUsers:UserId[],supervisorId:UserId)=>{
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

    getResourceAvailability:async (resourceId,from,to)=>{
        try{
            const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID, [
                Query.contains("resources", resourceId)
            ]) as unknown as Project[]
            const startCheck = from.getTime() / (1000 * 60 * 60 * 12); // Conversion de la date en demi-journées
            const endCheck = to.getTime() / (1000 * 60 * 60 * 12);
            return !projects.some(project =>{
                const projectStart = new Date(project.start).getTime() / (1000 * 60 * 60 * 12);
                const projectEnd = projectStart + project.duration;

                // Vérifier si l'intervalle du projet se chevauche avec l'intervalle donné
                return (
                    (startCheck >= projectStart && startCheck < projectEnd) ||  // chevauchement au début
                    (endCheck > projectStart && endCheck <= projectEnd) ||      // chevauchement à la fin
                    (startCheck <= projectStart && endCheck >= projectEnd)      // chevauchement total
                );
            })

        }catch (e) {
            return Promise.reject(e)
        }
    },


    getProblemById:async(problemId:ProblemId):Promise<Problem>=>{
        const doc = await databases.getDocument(DATABASE_ID, PROBLEMS_COLLECTION_ID, problemId)
        return {
            id:problemId,
            date:doc.$createdAt,
            description:doc.description,
            object:doc.object
        }
    },

    uploadPicture:async (picture:ImagePickerAsset)=>{
        try{
            const response = await storage.createFile(STORAGE_PICS_ID, ID.unique(), {
                name:picture.fileName,
                type:picture.mimeType,
                uri:picture.uri,
                size:picture.fileSize,

            }
            // ,[
            //     ...(authorizedUsers.map(id=>Permission.read(Role.user(id)))),
            //     Permission.update(Role.user(authorizedUsers[0]))
            // ]
            )
            console.log("response",response)
            return response;

        }catch(e){
            console.error("upload:",e)
            return Promise.reject(e)
        }
    },

    getPictureUrl:(pictureId:string)=>{
        return storage.getFileView(STORAGE_PICS_ID,pictureId).toString();
    },

    getPicturePreview:(pictureId:string, width:number, height:number)=>{
        return storage.getFilePreview(STORAGE_PICS_ID, pictureId, width, height, 'center', 100).toString()
    },

    updatePictures:async (pictures, projectId)=>{
        try{
            return await databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID,projectId, {
                pics: pictures
            });

        }catch(e){
            console.error("update : ", e)
            return Promise.reject(e);
        }
    },

    updateProjectStatus:(projectId, status)=>{
        return databases.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId, {
            status:status
        })
    },

    createProblem:async (projectId:ProjectId, problemInput:ProblemInput)=>{
        try{
            const doc = await databases.createDocument(DATABASE_ID, PROBLEMS_COLLECTION_ID, ID.unique(),problemInput)
            const problem:Problem = {
                id:doc.$id,
                object:doc.object,
                description:doc.description
            }
            const docs = await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId)
            await databases.updateDocument(DATABASE_ID,PROJECTS_COLLECTION_ID, projectId, {
                problems:[...docs.problems, doc.$id]
            })
            return doc.$id
        }catch(e){
            return Promise.reject(e)
        }
    },

    updateContacts:(userId, contacts)=>{
        return databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, {
            contacts:contacts
        })
    }

}