import {View, Text, ActivityIndicator, Button} from "react-native";
import {useEffect, useState} from "react";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";
import {router} from "expo-router";
import {useProjects} from "@/contexts/ProjectsContext";

export default function (){
    const {current} = useUser()
    const projects = useProjects()

    if(!projects.loaded) return <View><Text>B</Text><ActivityIndicator size={"large"}></ActivityIndicator></View>
    if(!projects.projects) return <View><Text>Il y a eu un problème</Text><ActivityIndicator size={"large"}></ActivityIndicator></View>
    console.log(projects)
    return <View><Text>Chef</Text>
        <Button title={"créer un chantier"} onPress={_=>{
            router.navigate("/(supervisor)/create/")
        }}></Button>
    </View>
}