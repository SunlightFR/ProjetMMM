import {createContext, useContext, useEffect, useState} from "react";
import {User, UserId} from "@/api/models/User";
import {useUser} from "@/contexts/UserContext";
import {Project, ProjectId, ProjectStatus} from "@/api/models/Project";
import {APIService} from "@/api/appwriteApi";
import {ProblemInput, ProjectInput, ResourceInput} from "@/types/inputTypes";
import {Resource, ResourceId, ResourceWithAvailability} from "@/api/models/Resource";
import {Problem,ProblemId} from "@/api/models/Problems";
import {CameraCapturedPicture} from "expo-camera";
import {useLoad} from "@/hooks/useLoad";
import {areDatesNotOverlapping} from "@/utils/dateUtils";
import {ImagePickerAsset} from "expo-image-picker";

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
    [id:ResourceId]:ResourceWithAvailability
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
    updateProject:(projectId:ProjectId, projectInput:ProjectInput)=>Promise<void>,
    getResourceById:(resourceId:ResourceId)=>Promise<Resource>,
    loadUser:(userId:UserId)=>Promise<void>,
    getUserById:(userId:UserId)=>User,
    getProblemById:(problemId:ProblemId)=>Promise<Problem>,
    uploadPicture:(projectId:ProjectId, picture:ImagePickerAsset)=>Promise<void>,
    updateProjectStatus:(projectId:ProjectId, status:ProjectStatus)=>Promise<any>,
    createProblem:(projectId:ProjectId, problemInput:ProblemInput)=>Promise<void>,
    isResourceAvailable:(resourceId:ResourceId, start:Date, duration:number)=>boolean,
    isManagerAvailable:(managerId:UserId, start:Date, duration:number)=>boolean,
    createResource:(resourceInput:ResourceInput)=>Promise<Resource>,
    getResources:()=>Promise<ResourceId>,
    getProjectResources:(projectId:ProjectId)=>Promise<Resources>
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
                    await loadResources()
                    const p = await APIService.getManagerProjects(user.current.userId)
                    console.info("manager", p)
                    setProjects(listToObject(p))
                    p.forEach(async (pp)=>{
                        await loadUser(pp.supervisor_id)
                    })
                }
                else if(user.current.role==="supervisor"){
                    await loadResources()
                    const p = await APIService.getSupervisorProjects(user.current.userId)
                    console.info(p)
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

    const loadResources = async ()=>{
        if(true || user.current && user.current.role==="supervisor"){
            setResources(await APIService.getSupervisorResources(user.current.userId))
        }
    }

    const createNewProject = async (projectInput:ProjectInput)=>{
        console.log("project input", projectInput)
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

    const getProjectResources = async (projectId:ProjectId) =>{
        if(projects && projects[projectId]){
            const r:Resources = {}
            for(let resourceId of projects[projectId].resources){
                r[resourceId] = await getResourceById(resourceId)
            }
            return r;
        }
    }

    const updateProject = async (projectId:ProjectId, projectInput:ProjectInput)=>{
        try{
            const result = await APIService.updateProject(projectId, projectInput);
            setProjects(s=>({
                ...s!,
                [projectId]:{
                    ...s![projectId],
                    ...projectInput
                }
            }))

        }catch (e) {
            return Promise.reject(e)
        }
    }


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
                console.error("ici", e, resourceId);
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

    const createResource = (resourceInput:ResourceInput)=>{
        return APIService.createResource(resourceInput,[], user.current?.userId)
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
            // setProjects(s=>({
            //     ...s,
            //     [projectId]:{
            //         ...projects![projectId],
            //         pics:[...(s![projectId]!.pics), undefined]
            //     }
            // }))
            const file = await APIService.uploadPicture(picture);
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

    const isResourceAvailable = (resourceId:ResourceId, start:Date, duration:number)=>{
        if(!projects) return false;

        return !Object.keys(projects).filter(id=>projects[id].resources.includes(resourceId)).some(id=>{
            return !areDatesNotOverlapping(projects[id].start, projects[id].duration, start, duration)
        })
    }

    const isManagerAvailable =  (managerId:UserId, start:Date, duration:number)=>{
        if(!projects) return false;

        return !Object.keys(projects).filter(id=>projects[id].manager_id === managerId).some(id=>{
            return !areDatesNotOverlapping(projects[id].start, projects[id].duration, start, duration)
        })
    }

    //todo add contact
    const addContact = async(userId:UserId)=>{
        try{
            const u = await user.addContact(userId)
            setUsers({
                ...users,
                [userId]:u
            })
        }catch(e){
            return Promise.reject(e)
        }
    }

    const loadContacts = async ()=>{
        for(const id of user.current!.contacts){
            await loadUser(id)
        }
    }


    useEffect(() => {
        if(user.current){
            loadProjects().then(()=>{
                loadContacts().then(()=>{
                    setLoaded(true);
                })

            })
        }
    }, [user.current]);

    return <ProjectsContext.Provider value={{
        loaded,
        projects,
        createNewProject,
        updateProject,
        getResourceById,
        getUserById,
        getProblemById,
        uploadPicture,
        updateProjectStatus,
        createProblem,
        loadUser,
        isResourceAvailable,
        createResource,
        resources,
        getProjectResources,
        isManagerAvailable,
        addContact
    }}>
        {children}
    </ProjectsContext.Provider>
}