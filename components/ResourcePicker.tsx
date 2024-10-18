import {ResourceId} from "@/api/models/Resource";
import {View} from "react-native";
import {useProjects} from "@/contexts/ProjectsContext";
import {ResourceButton} from "@/components/atoms/ResourceButton";
import {useEffect} from "react";
import {databases} from "@/lib/appwrite";

interface Props {
    resources:ResourceId[],
    selectedResource?:ResourceId,
    onSelected:(selectedResource:ResourceId)=>void
}

export const ResourcePicker = ({resources,selectedResource,onSelected}:Props)=>{


    return <View>
        {resources.map(resourceId=><ResourceButton
            type={}
            name={}
            available={}
            onPress={}/>)}
    </View>
}