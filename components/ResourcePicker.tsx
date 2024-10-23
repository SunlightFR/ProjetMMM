import {ResourceId, Resource, ResourceWithAvailability, ResourceType} from "@/api/models/Resource";
import {Button, View} from "react-native";
import {useProjects} from "@/contexts/ProjectsContext";
import {ResourceButton} from "@/components/atoms/ResourceButton";
import {useEffect, useState} from "react";
import {databases} from "@/lib/appwrite";
import {Loader} from "@/components/atoms/Loader";
import {ThemedButton} from "@/components/atoms/ThemedButton";
import {ThemedText} from "@/components/ThemedText";
import {ResourceEditor} from "@/components/ResourceEditor";
import {ResourceInput} from "@/types/inputTypes";

interface Props {
    resourceIds?:ResourceId[],
    selectedResource?:ResourceId,
    onSelected:(selectedResources:ResourceId[])=>void,
    start:Date,
    duration:number
}



export const ResourcePicker = ({resourceIds,selectedResource,onSelected, start, duration}:Props)=>{
    const projects = useProjects()
    const [resources, setResources] = useState<ResourceWithAvailability[]>()
    const [selectedResources, setSelectedResources] = useState<ResourceId[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    useEffect(() => {
        (async ()=>{
           const r:ResourceWithAvailability[] = []
            console.log("resource picker : ", resourceIds)
           for(let id in resourceIds){
               const resource = resourceIds[id]
               console.log("resource", resource)
               resource.available = projects.isResourceAvailable(id, start, duration)
               r.push(resource)
           }
           setResources(r)
        })().catch(e=>{
            console.error(e)
        })
    }, []);

    const ResourceByType = (resources:Resource[], type:ResourceType)=>{
        return <View style={{alignItems:'center', paddingHorizontal:10, width:'100%', justifyContent:'center'}}>
            <ThemedText>{type}</ThemedText>
            <View style={{
                flexDirection:'row',
                flexWrap:"wrap",
                gap:10,
                marginHorizontal:"auto"
                // justifyContent:"",
            }}>
            {resources.filter(r=>r.type===type).sort((a,b)=>{
                if (a.available && !b.available) return -1;
                if (!a.available && b.available) return 1;
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;


                return 0;
            }).map(resource=><ResourceButton
                selected={selectedResources.includes(resource.id)}
                type={resource.type}
                name={resource.name}
                available={resource.available}
                onPress={_=>onPress(resource.id)}/>)}
            </View>
        </View>
    }

    const createResource = (resourceInput:ResourceInput)=>{
        //todo
        projects.createResource(resourceInput).then(resource=>{
            resource.available = projects.isResourceAvailable(resource.id, start, duration)
            setResources(r=>[...r, resource])
            setIsModalOpen(false)
        })
    }

    const onPress = (resourceId:ResourceId)=>{
        if(selectedResources.includes(resourceId)){
            setSelectedResources(r=>r.filter(id=>id!=resourceId))
        }else{
            setSelectedResources(r=>[...r, resourceId])
        }
    }

    return <View>
        { !resources && <Loader/>}
        {/*{resources && resources.sort((a, b) => {*/}

        {/*    if (a.type < b.type) return -1;*/}
        {/*    if (a.type > b.type) return 1;*/}

        {/*    if (a.available && !b.available) return -1;*/}
        {/*    if (!a.available && b.available) return 1;*/}
        {/*    if (a.name < b.name) return -1;*/}
        {/*    if (a.name > b.name) return 1;*/}


        {/*    return 0;*/}
        {/*}).map(resource=>{*/}
        {/*    console.log(resources)*/}
        {/*    return <ResourceButton*/}
        {/*    selected={selectedResources.includes(resource.id)}*/}
        {/*    type={resource.type}*/}
        {/*    name={resource.name}*/}
        {/*    available={resource.available}*/}
        {/*    onPress={_=>onPress(resource.id)}/>})}*/}
        {resources && [...new Set(resources.map(resource => resource.type))].sort().map(type=>ResourceByType(resources,type))}
        <ThemedButton onPress={_=>setIsModalOpen(true)}
        ><ThemedText>Ajouter une resource</ThemedText></ThemedButton>
        <ThemedButton onPress={_=>onSelected(selectedResources)}><ThemedText>Valider</ThemedText></ThemedButton>
        {isModalOpen && <ResourceEditor onClose={_=>setIsModalOpen(false)} visible={isModalOpen} onEnd={createResource}/>}
    </View>
}