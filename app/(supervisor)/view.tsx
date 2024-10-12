import {ThemedPage} from "@/components/ThemedPage";
import {Text} from "react-native";
import {ProjectViewPage} from "@/pages/projectViewPage";
import {useLocalSearchParams} from "expo-router";

export default function (){
    const {projectId} = useLocalSearchParams()
    return <ProjectViewPage projectId={projectId} userRole={"supervisor"}/>
}