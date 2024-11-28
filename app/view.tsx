import {ThemedPage} from "@/components/ThemedPage";
import {Text} from "react-native";
import {ProjectViewPage} from "@/pages/projectViewPage";
import {useLocalSearchParams} from "expo-router";
import {useUser} from "@/contexts/UserContext";

export default function (){
    const {projectId} = useLocalSearchParams()
    const {current} = useUser()
    return <ProjectViewPage projectId={projectId} userRole={current?.role}/>
}