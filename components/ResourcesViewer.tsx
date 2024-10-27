import {useProjects} from "@/contexts/ProjectsContext";
import {View} from "react-native";
import {Resource, ResourceId, ResourceType} from "@/api/models/Resource";
import {ThemedText} from "@/components/ThemedText";
import {ResourceButton} from "@/components/atoms/ResourceButton";
import {useEffect, useState} from "react";
import {ProjectId} from "@/api/models/Project";
import {useTranslation} from "react-i18next";

interface Props{
    projectId:ProjectId
}
export const ResourcesViewer = ({projectId}:Props)=>{
    const {t} = useTranslation()
    const projects = useProjects();
    const [resources, setResources] = useState<Resource>()
    useEffect(() => {
        (async()=>{
            setResources(await projects.getProjectResources(projectId))
        })()
    }, []);
    const ResourceByType = (resources_:Resource[], type:ResourceType)=>{
        return <View style={{alignItems:'center', paddingHorizontal:10, width:'100%', justifyContent:'center'}}>
            <ThemedText >{t(type)}</ThemedText>
            <View style={{
                flexDirection:'row',
                flexWrap:"wrap",
                gap:10,
                marginHorizontal:"auto",
                // justifyContent:"",
                marginTop:3
            }}>
                {resources_ && Object.values(resources_).filter(r=>r.type===type).sort().map(resource=><ResourceButton
                    selected={false}
                    type={resource.type}
                    name={resource.name}
                    available={true}
                    onPress={_=>{}}/>)}
            </View>
        </View>
    }
    //todo : affichage tri modal avec dispo + méthode api dispo
    return <View>
        {resources && [...new Set(Object.keys(resources).map(resourceId => resources[resourceId].type))].sort().map(type=>ResourceByType(resources,type))}
    </View>
}