import {View, Text, ActivityIndicator} from "react-native";
import {useEffect, useState} from "react";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";

export default function (){
    const {current} = useUser()
    const [projects, setProjects] = useState<Project[]>();


    useEffect(() => {
        if(current) {
            APIService.getManagerProjects(current!.userId).then(p => {
                setProjects(p)
            })
        }
        else{
            setProjects(undefined)
        }
    }, []);

    if(!projects) return <View><ActivityIndicator size={"large"}></ActivityIndicator></View>
    console.log(projects)
    return <View><Text>Chef</Text></View>
}