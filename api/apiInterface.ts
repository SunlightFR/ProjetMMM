import {User, UserRole} from "@/api/models/User";
import {Project} from "@/api/models/Project";

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
    getUserById:(userId:string)=>Promise<User>,

    /**
     * @returns projects une liste d'objets Projet dont l'utilisateur actuel est le chef
     */
    getSupervisorProjects:()=>Promise<Project[]>,

    /**
     * @returns projects une liste d'objets Projet dont l'utilisateur actuel est le responsable
     */
    getManagerProjects:()=>Promise<Project[]>
}