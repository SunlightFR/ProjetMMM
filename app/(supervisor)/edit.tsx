import {ProjectEditionPage} from "@/pages/projectEditionPage";
import {useLocalSearchParams} from "expo-router";
import {useProjects} from "@/contexts/ProjectsContext";

export default function (){
    const {id} = useLocalSearchParams()
    const projects = useProjects()
    console.log("Projet:", projects.projects[id])
    return <ProjectEditionPage projectId={id} projectInput={projects.projects![id]}></ProjectEditionPage>
}