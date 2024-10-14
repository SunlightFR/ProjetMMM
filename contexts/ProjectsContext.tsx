import {createContext, useContext, useEffect, useState} from "react";
import {User, UserId} from "@/api/models/User";
import {useUser} from "@/contexts/UserContext";
import {Project, ProjectId, ProjectStatus} from "@/api/models/Project";
import {APIService} from "@/api/appwriteApi";
import {ProblemInput, ProjectInput} from "@/types/inputTypes";
import {Resource, ResourceId} from "@/api/models/Resource";
import {Problem,ProblemId} from "@/api/models/Problems";
import {CameraCapturedPicture} from "expo-camera";

function listToObject(l:any[]){
    const o = {}
    l.forEach(item=>{
        o[item.id] = item;
    })
    return o;
}

type Projects = {
    [id:ProjectId]:Project
}
type Resources = {
    [id:ResourceId]:Resource
}

type Users = {
    [id:UserId]:User
}

type Problems = {
    [id:ProblemId]:Problem
}

interface ProjectsContextType{
    loaded:boolean,
    projects?:Projects,
    createNewProject:(projectInput:ProjectInput)=>Promise<void>,
    getResourceById:(resourceId:ResourceId)=>Promise<Resource>,
    getUserById:(userId:UserId)=>User,
    getProblemById:(problemId:ProblemId)=>Promise<Problem>,
    uploadPicture:(projectId:ProjectId, picture:CameraCapturedPicture)=>Promise<void>,
    updateProjectStatus:(projectId:ProjectId, status:ProjectStatus)=>Promise<any>,
    createProblem:(projectId:ProjectId, problemInput:ProblemInput)=>Promise<void>
}

const ProjectsContext = createContext<ProjectsContextType>({})

export const useProjects = ()=>useContext(ProjectsContext)

export const ProjectsProvider = ({children})=>{
    const user = useUser()
    const [projects, setProjects] = useState<Projects>()
    const [resources, setResources] = useState<Resources>({})
    const [users, setUsers] = useState<Users>({})
    const [problems, setProblems] = useState<Problems>({})
    const [loaded, setLoaded] = useState<boolean>(false)

    useEffect(() => {
        console.log(users)
    }, [users]);

    const loadProjects = async ()=>{
        try{
            if(user.current){
                if(user.current.role === "manager"){
                    const p = await APIService.getManagerProjects(user.current.userId)

                    setProjects(listToObject(p))
                    p.forEach(async (pp)=>{
                        await loadUser(pp.supervisor_id)
                    })
                }
                else if(user.current.role==="supervisor"){
                    const p = await APIService.getSupervisorProjects(user.current.userId)
                    setProjects(listToObject(p))
                    p.forEach(async (pp)=>{
                        await loadUser(pp.manager_id)
                    })
                }
            }
        }catch(e){
            console.error(e)//TODO
        }
    }

    const createNewProject = async (projectInput:ProjectInput)=>{
        try{
            const project:Project = await APIService.createProject(projectInput);
            console.log("le projet", project, "a été créé")
            setProjects(s=> ({
                ...s!,
                [project.id]:project
            }));
        }catch(e){
            console.error(e)//todo
        }
    };

    const getResourceById = async(resourceId:ResourceId)=>{
        if(resources[resourceId]){
            return Promise.resolve(resources[resourceId])
        }else{
            try{
                const resource:Resource = await APIService.getResourceById(resourceId);
                setResources(r=>({
                    ...r,
                    [resource.id]:resource
                }))
                return resource
            }catch (e) {
                console.error(e);
                return Promise.reject(e)
            }
        }
    }

    const getProblemById=async(problemId:ProblemId):Promise<Problem>=>{
        if(problems[problemId]){
            return Promise.resolve(problems[problemId])
        }else{
            try{
                const problem:Problem = await APIService.getProblemById(problemId);
                setProblems(p=>({
                    ...p,
                    [problem.id]:problem
                }))
                return Promise.resolve(problem)
            }catch (e) {
                console.error(e);
                return Promise.reject(e)
            }
        }
    }


    const loadUser=async(userId:UserId):Promise<void>=>{
        if(users[userId]){
            return Promise.resolve()
        }else{
            try{
                const user:User = await APIService.getUserById(userId);
                setUsers(u=>({
                    ...u,
                    [user.userId]:user
                }))
            }catch (e) {
                console.error(e);
                return Promise.reject(e)
            }
        }
    }

    const getUserById = (userId:UserId)=>{
        return users[userId]
    }

    const uploadPicture = async (projectId:ProjectId, picture:CameraCapturedPicture)=>{
        try{
            const file = await APIService.uploadPicture(picture, [
                Permissions
            ]);
            console.info("photo uploadée !", file)
            const pics = projects![projectId].pics;
            pics.push(file.$id);
            await APIService.updatePictures(pics, projectId);
            setProjects(s=>({
                ...s,
                [projectId]:{
                    ...projects![projectId],
                    pics:pics
                }
            }))
        }catch(e){
            console.error(e)
        }
    }

    const updateProjectStatus = async (projectId:ProjectId, status:ProjectStatus)=>{
        try{
            await APIService.updateProjectStatus(projectId, status);
            setProjects(s=>({
                ...s,
                [projectId]:{
                    ...projects![projectId],
                    status:status
                }
            }))
        }catch(e){
            console.error(e)
        }
    }

    const createProblem = async (projectId:ProjectId, problemInput:ProblemInput)=>{
        try{
            const id = await APIService.createProblem(projectId, problemInput);

            setProjects(s=>({
                ...s,
                [projectId]:{
                    ...projects![projectId],
                    problems:[...projects![projectId].problems, id]
                }
            }))
        }catch(e){
            console.error(e)
        }
    }


    useEffect(() => {
        if(user.current){
            loadProjects().then(()=>{
                setLoaded(true);
            })
        }
    }, [user.current]);

    return <ProjectsContext.Provider value={{
        loaded,
        projects,
        createNewProject,
        getResourceById,
        getUserById,
        getProblemById,
        uploadPicture,
        updateProjectStatus,
        createProblem
    }}>
        {children}
    </ProjectsContext.Provider>
}