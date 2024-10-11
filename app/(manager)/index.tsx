import {View, Text, ActivityIndicator, Button} from "react-native";
import {useEffect, useState} from "react";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";
import {Project} from "@/api/models/Project";
import {router} from "expo-router";

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
    }, [current]);

    if(!projects) return <View><Text>B</Text><ActivityIndicator size={"large"}></ActivityIndicator></View>
    console.log(projects)
    return <View><Text>Chef</Text>
        <Button title={"créer un chantier"} onPress={_=>{
            router.navigate("/(supervisor)/create/")
        }}></Button>
    </View>
}