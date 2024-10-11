import {User, UserId, UserRole} from "@/api/models/User";
import {Project, ProjectStatus} from "@/api/models/Project";
import {ResourceId} from "@/api/models/Resource";

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
    createProject:(
        object:string,
        manager_id:UserId,
        supervisor_id:UserId,
        resources:ResourceId[],
        status:ProjectStatus,
        start:Date,
        end:Date,
        location:string,
        clientNumber:string
    ) =>Promise<Project>
}