import {User, UserId, UserRole} from "@/api/models/User";
import {Project, ProjectId, ProjectStatus} from "@/api/models/Project";
import {Resource, ResourceId} from "@/api/models/Resource";
import {ProjectInput, ResourceInput} from "@/types/inputTypes";
import {Problem, ProblemId} from "@/api/models/Problems";
import {CameraCapturedPicture} from "expo-camera";
import {Models} from "react-native-appwrite";
import {ImagePickerAsset} from "expo-image-picker";

export interface ApiInterface{
    /**
     * Authentification avec email et mot de passe
     * @param email
     * @param password
     */
    login:(email:string, password:string)=>Promise<User>,

    /**
     * Création de compte avec un rôle.
     * @param email
     * @param password
     * @param role
     */
    register:(email:string, password:string, firstName:string, lastName:string, role:UserRole)=>Promise<User>,

    logout:()=>Promise<void>,

    /**
     * Retourne les données d'un utilisateur
     * @param userId
     */
    getUserById:(userId:UserId)=>Promise<User>,

    /**
     * @returns projects une liste d'objets Projet dont l'utilisateur actuel est le chef
     */
    getSupervisorProjects:(supervisorId:UserId)=>Promise<Project[]>,

    /**
     * @returns projects une liste d'objets Projet dont l'utilisateur actuel est le responsable
     */
    getManagerProjects:(managerId:UserId)=>Promise<Project[]>

    /**
     *
     * @param project
     */
    createProject:(projectInput:ProjectInput) =>Promise<Project>

    /**
     *
     * @param resourceId
     */
    getResourceById:(resourceId:ResourceId)=>Promise<Resource>,
    /**
     *
     * @param resourceInput
     */
    createResource:(resourceInput:ResourceInput, authorizedUsers:UserId[], supervisorId:UserId)=>Promise<Resource>

    getProblemById:(problemId:ProblemId)=>Promise<Problem>,

    uploadPicture:(picture:ImagePickerAsset)=>Promise<Models.File>,
    getPictureUrl:(pictureId:string)=>string,
    getPicturePreview:(pictureId:string, width:number, height:number)=>string,

    updatePictures:(pictures:string[], projectId:ProjectId)=>Promise<any>,

}