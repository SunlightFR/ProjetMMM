import {Text} from "react-native";
import React, {useState} from "react";
import {useUser} from "@/contexts/UserContext";
import {useProjects} from "@/contexts/ProjectsContext";
import {ThemedPage} from "@/components/ThemedPage";
import {Loader} from "@/components/atoms/Loader";
import {ThemedText} from "@/components/ThemedText";
import {SplashScreen} from "@/pages/splashScreen";
import * as SP from "expo-splash-screen"
import {Redirect, router} from "expo-router";

export default function (){
    const [message, setMessage] = useState<string>()

    const {login, register, current, loading} = useUser()
    const {loaded} = useProjects()
    SP.hideAsync();

    if(loading){
        return <SplashScreen message={"Connexion..."}></SplashScreen>
    }

    if(!current){
        return <Redirect href={"/sign-in"}></Redirect>
    }

    console.log("current", current.firstName)

    if(!loaded){
        return <SplashScreen message={"Chargement des chantiers..."}/>
    }

    return <Redirect href={"/test"}></Redirect>



    return <ThemedPage>
        <Loader/>
        <ThemedText>{message}</ThemedText>
    </ThemedPage>
}