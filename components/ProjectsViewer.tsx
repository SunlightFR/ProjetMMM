import {useProjects} from "@/contexts/ProjectsContext";
import {View} from "react-native";
import {ProjectCard} from "@/components/ProjectCard";
import {ThemedText} from "@/components/ThemedText";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";

export const ProjectsViewer = ()=>{
    const {t} = useTranslation()
    const projects = useProjects()

    if(!projects.projects) return <ThemedText>Non</ThemedText>

    const onGoingProjects = Object.keys(projects.projects ?? {}).filter(id=>projects.projects?.[id]?.status === "in-progress");

    return <View style={{marginBottom:20}}>
        {Object.keys(projects.projects).length > 0 ?
            <>
                {onGoingProjects.length > 0 ?
                    onGoingProjects.slice(0,2).map(id=><ProjectCard key={id} project={projects.projects![id]} onPress={_=>router.navigate({pathname:"/view", params:{projectId:id}})}/>)
                    : <ThemedText>{t("no-ongoing-project")}</ThemedText>}
                <ThemedButton2 title={t("see-all")} onPress={_=>{router.navigate('/allprojects')}}/>
            </>
            : <ThemedText>{t("no-project")}</ThemedText>}
    </View>
}