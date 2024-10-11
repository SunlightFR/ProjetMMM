import {ProjectId} from "@/api/models/Project";
import {Button, View} from "react-native";
import {useEffect, useState} from "react";
import {ProjectInput} from "@/types/inputTypes";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {SafeAreaView} from "react-native-safe-area-context";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";


interface Props {
    projectInput?:Partial<ProjectInput>
}
export const ProjectEditionPage = ({projectInput}:Props)=>{
    const user = useUser()
    //On considère que si un projectId est fourni, on est en mode édition.
    const mode = projectInput ? "edition":"creation"

    const [projectInput_, setProjectInput] = useState<Partial<ProjectInput>>({})
    useEffect(() => {
        if(projectInput) {
            console.log("refresh", projectInput)
            setProjectInput(projectInput)
        }
    }, [projectInput]);

    return <SafeAreaView>
        <ThemedTextInput
            value={projectInput_?.object ?? ""}
            onChangeText={text=>setProjectInput(s=>({
                ...s,
                object:text
            }))}
            label={"Objet du chantier"}
        ></ThemedTextInput>

        <Button title={"créer"} onPress={_=>{
            APIService.createProject({
                object:"Test chantier",
                end:new Date(),
                start:new Date(),
                clientNumber:"0235",
                location:"Paris",
                manager_id:user.current?.userId,
                supervisor_id:user.current?.userId,
                resources:[],
                status:"stopped"
            }).then(d=>{
                console.log(d)
            }).catch(e=>{
                console.error(e)
        })}}></Button>


    </SafeAreaView>
}