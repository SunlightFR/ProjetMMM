import {ResourceId, Resource, ResourceWithAvailability, ResourceType} from "@/api/models/Resource";
import {View} from "react-native";
import {useProjects} from "@/contexts/ProjectsContext";
import {ResourceButton} from "@/components/atoms/ResourceButton";
import {useEffect, useState} from "react";
import {Loader} from "@/components/atoms/Loader";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {ThemedText} from "@/components/ThemedText";
import {ResourceEditor} from "@/components/ResourceEditor";
import {ResourceInput} from "@/types/inputTypes";
import {useTranslation} from "react-i18next";

/**
 * Ce composant permet à un responsable de sélectionner des resources pour son chantier.
 */
interface Props {
    resourceIds?:ResourceId[],
    selectedResources?:ResourceId[],
    onSelected:(selectedResources:ResourceId[])=>void,
    start:Date,
    duration:number
}

export const ResourcePicker = ({resourceIds,selectedResources,onSelected, start, duration}:Props)=>{
    const {t} = useTranslation()
    const projects = useProjects()
    const [resources, setResources] = useState<ResourceWithAvailability[]>()
    const [selectedResources_, setSelectedResources] = useState<ResourceId[]>(selectedResources ?? [])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    useEffect(() => {
        if(selectedResources) setSelectedResources(selectedResources)
    }, [selectedResources]);

    useEffect(() => {
        (async ()=>{
           const r:ResourceWithAvailability[] = []
           for(let id in resourceIds){
               const resource = resourceIds[id]
               resource.available = projects.isResourceAvailable(id, start, duration)
               r.push(resource)
           }
           setResources(r)
        })().catch(e=>{
            console.error(e)
        })
    }, []);

    const ResourceByType = (resources:Resource[], type:ResourceType)=>{
        return <View key={type} style={{alignItems:'center', paddingHorizontal:10, width:'100%', justifyContent:'center'}}>
            <ThemedText>{t(type)}</ThemedText>
            <View style={{
                flexDirection:'row',
                flexWrap:"wrap",
                gap:10,
                marginHorizontal:"auto"
            }}>
            {resources.filter(r=>r.type===type).sort((a,b)=>{
                if (a.available && !b.available) return -1;
                if (!a.available && b.available) return 1;
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            }).map((resource,id)=><ResourceButton
                key={id}
                selected={selectedResources_.includes(resource.id)}
                type={resource.type}
                name={resource.name}
                available={
                    (selectedResources_.includes(resource.id) || selectedResources?.includes(resource.id)) ? true :
                    resource.available}
                onPress={_=>onPress(resource.id)}/>)}
            </View>
        </View>
    }

    const createResource = (resourceInput:ResourceInput)=>{
        projects.createResource(resourceInput).then(resource=>{
            console.log('créée avec succès')
            resource.available = true;
            setResources(r=>[...r, resource])
            setIsModalOpen(false)
        })
    }

    const onPress = (resourceId:ResourceId)=>{
        if(selectedResources_.includes(resourceId)){
            setSelectedResources(r=>r.filter(id=>id!=resourceId))
        }else{
            setSelectedResources(r=>[...r, resourceId])
        }
    }

    return <View>
        { !resources && <Loader/> }
        {resources && [...new Set(resources.map(resource => resource.type))].sort().map(type=>ResourceByType(resources,type))}
        <ThemedButton2
            style={{marginHorizontal:80}}
            title={t('add-resource')}
            onPress={_=>setIsModalOpen(true)}
        />
        <ThemedButton2
            style={{marginHorizontal:80}}
            title={t('submit')}
            onPress={_=>onSelected(selectedResources_)}
        />
        {isModalOpen &&
            <ResourceEditor
                onClose={_=>setIsModalOpen(false)}
                visible={isModalOpen}
                onEnd={createResource}
            />
        }
    </View>
}