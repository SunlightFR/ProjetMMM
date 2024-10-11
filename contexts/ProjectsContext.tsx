import {createContext, useContext, useEffect, useState} from "react";
import {UserId} from "@/api/models/User";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";
import {APIService} from "@/api/appwriteApi";
import {ProjectInput} from "@/types/inputTypes";

interface ProjectsContextType{
    loaded:boolean,
    projects?:Project[],
    createNewProject:(projectInput:ProjectInput)=>Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType>({})

export const useProjects = ()=>useContext(ProjectsContext)

export const ProjectsProvider = ({children})=>{
    const user = useUser()
    const [projects, setProjects] = useState<Project[]>()
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
        createNewProject
    }}>
        {children}
    </ProjectsContext.Provider>
}