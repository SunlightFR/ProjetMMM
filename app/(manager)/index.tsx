import {View, Text, ActivityIndicator, Button, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";
import {router} from "expo-router";
import {useProjects} from "@/contexts/ProjectsContext";
import {ThemedPage} from "@/components/ThemedPage";
import {ProjectCard} from "@/components/ProjectCard";
import {SplashScreen} from "@/pages/splashScreen";

export default function (){
    const {current} = useUser()
    const projects = useProjects()

    // if(!projects.loaded) return <SplashScreen/>
    // if(!projects.projects) return <View><Text>Il y a eu un problème</Text><ActivityIndicator size={"large"}></ActivityIndicator></View>
    console.log(projects)

    return <ThemedPage>
        <Button title={"créer un chantier"} onPress={_=>{
            router.navigate("/(supervisor)/create/")
        }}></Button>
        <Button title={"oo"} onPress={_=>router.navigate("/test")}></Button>
        <ScrollView style={{height:'80%'}}>{Object.keys(projects.projects).map(projectId=><ProjectCard onPress={_=>router.navigate({
            params:{
                projectId:projectId
            },
            pathname:"view/"
        })} project={projects.projects[projectId]}></ProjectCard>)}
        </ScrollView>
        </ThemedPage>
    return <View><Text>Chef</Text>
        <Button title={"créer un chantier"} onPress={_=>{
            router.navigate("/(supervisor)/create/")
        }}></Button>
    </View>
}