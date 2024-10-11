import {createContext, useContext, useEffect, useState} from "react";
import {UserId} from "@/api/models/User";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";
import {APIService} from "@/api/appwriteApi";
import {ProjectInput} from "@/types/inputTypes";
import {Resource, ResourceId} from "@/api/models/Resource";

type Resources = {
    [id:ResourceId]:Resource
}

interface ProjectsContextType{
    loaded:boolean,
    projects?:Project[],
    createNewProject:(projectInput:ProjectInput)=>Promise<void>,
    getResourceById:(resourceId:ResourceId)=>Promise<Resource>
}

const ProjectsContext = createContext<ProjectsContextType>({})

export const useProjects = ()=>useContext(ProjectsContext)

export const ProjectsProvider = ({children})=>{
    const user = useUser()
    const [projects, setProjects] = useState<Project[]>()
    const [resources, setResources] = useState<Resources>({})

    const [loaded, setLoaded] = useState<boolean>(false)

    const loadProjects = async ()=>{
        try{
            if(user.current){
                if(user.current.role === "manager"){
                    setProjects(await APIService.getManagerProjects(user.current.userId))
                }
                else if(user.current.role==="supervisor"){
                    setProjects(await APIService.getSupervisorProjects(user.current.userId))
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
            setProjects(s=>[...s!, project]);
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
        getResourceById
    }}>
        {children}
    </ProjectsContext.Provider>
}