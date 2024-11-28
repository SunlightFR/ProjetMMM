import {ThemedPage} from "@/components/ThemedPage";
import {Button, ScrollView} from "react-native";
import {router} from "expo-router";
import {ProjectCard} from "@/components/ProjectCard";
import {useProjects} from "@/contexts/ProjectsContext";

export default function (){
    const projects = useProjects();

    return <ThemedPage>
        <ScrollView style={{height:'80%'}}>{Object.keys(projects.projects).map(projectId=><ProjectCard key={projectId} onPress={_=>router.navigate({
            params:{
                projectId:projectId
            },
            pathname:"view/"
        })} project={projects.projects[projectId]}></ProjectCard>)}
        </ScrollView>
    </ThemedPage>
}