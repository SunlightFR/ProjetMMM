import {useProjects} from "@/contexts/ProjectsContext";
import {View} from "react-native";
import {Resource, ResourceId, ResourceType} from "@/api/models/Resource";
import {ThemedText} from "@/components/ThemedText";
import {ResourceButton} from "@/components/atoms/ResourceButton";
import {useEffect, useState} from "react";
import {ProjectId} from "@/api/models/Project";
import {useTranslation} from "react-i18next";

interface Props{
    projectId?:ProjectId,
    resources?:ResourceId[]
}
export const ResourcesViewer = ({projectId, resources}:Props)=>{
    const {t} = useTranslation()
    const projects = useProjects();
    const [resources_, setResources_] = useState<Resource>()
    useEffect(() => {
        if(projectId) {
            (async () => {
                console.log('ici')
                setResources_(await projects.getProjectResources(projectId))
                await projects.getProjectResources(projectId)
            })()
        }else if(resources){
            (async()=>{const r = []
            for(let rid of resources){
                console.log('la')
                r.push(await projects.getResourceById(rid))
                // console.log(await projects.getResourceById(rid))
            }
            setResources_(r)})()
        }
    }, [projectId, resources]);
    const ResourceByType = (resources_:Resource[], type:ResourceType)=>{
        return <View key={type} style={{alignItems:'center', paddingHorizontal:10, width:'100%', justifyContent:'center'}}>
            <ThemedText >{t(type)}</ThemedText>
            <View style={{
                flexDirection:'row',
                flexWrap:"wrap",
                gap:10,
                marginHorizontal:"auto",
                // justifyContent:"",
                marginTop:3
            }}>
                {resources_ && Object.values(resources_).filter(r=>r.type===type).sort().map((resource,id)=><ResourceButton
                    key={id}
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
        {resources_ && [...new Set(Object.keys(resources_).map(resourceId => resources_[resourceId].type))].sort().map(type=>ResourceByType(resources_,type))}
    </View>
}