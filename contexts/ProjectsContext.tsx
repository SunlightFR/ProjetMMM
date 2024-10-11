import {createContext, useContext, useEffect, useState} from "react";
import {UserId} from "@/api/models/User";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";
import {APIService} from "@/api/appwriteApi";

interface ProjectsContextType{
    loaded:boolean,
    projects?:Project[]
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

    useEffect(() => {
        if(user.current){
            loadProjects().then(()=>{
                setLoaded(true);
            })
        }
    }, [user.current]);

    return <ProjectsContext.Provider value={{
        loaded,
        projects
    }}>
        {children}
    </ProjectsContext.Provider>
}