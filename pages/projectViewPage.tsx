import {Project, ProjectId} from "@/api/models/Project";
import {UserRole} from "@/api/models/User";
import {ThemedPage} from "@/components/ThemedPage";
import {ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, View} from "react-native";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {useProjects} from "@/contexts/ProjectsContext";
import {useEffect, useState} from "react";
import {Problem} from "@/api/models/Problems";
import {ProblemCard} from "@/components/ProblemCard";
import {Loader} from "@/components/atoms/Loader";
import {ProjectStatusIcon} from "@/components/atoms/ProjectStatus";
import {APIService} from "@/api/appwriteApi";
import { Dimensions } from 'react-native';
import {ThemedButton} from "@/components/atoms/ThemedButton";
import {router} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import {toast} from "@/lib/toast";

const screenWidth = Dimensions.get('window').width;
const imageWidth = (screenWidth-30)/4
console.info("width:",imageWidth)

interface Props{
    projectId:ProjectId,
    userRole:UserRole
}
export const ProjectViewPage = ({projectId,userRole}:Props)=>{
    const theme = useTheme()
    const projects = useProjects()
    if(!projects.projects) return <ActivityIndicator></ActivityIndicator>
    const project = projects.projects[projectId];
    if(!project) return <Text>Problème...</Text>

    const [problems, setProblems] = useState<Problem[]|undefined>(undefined)

    useEffect(() => {
        (async ()=>{
            const pbs = []
            for(const projectId of ['0', '1']){ //project.problems){
                pbs.push(await projects.getProblemById(projectId))
            }
            console.log("problems",pbs)
            setProblems(pbs)

        })()
    }, [project.problems]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,

        });

        console.log(result);

        if (!result.canceled) {
            console.log(result.assets[0])
            await projects.uploadPicture(projectId, result.assets[0]);
            toast('photo uploadée')
        }
    };

    return <ThemedPage>
        <ScrollView>
        <View style={[
            {
                backgroundColor:theme.colors.background,
            },
            styles.titleContainer
        ]}>
            <Text style={[
                {color:theme.colors.text},
                styles.objectText
            ]}>{project.object}</Text>
            <Ionicons name={"pencil"} color={theme.colors.text} size={20}></Ionicons>
        </View>
        <View style={{marginLeft:15}}>
            <View style={{marginRight:"auto", marginBottom:10}}><ProjectStatusIcon status={project.status} ></ProjectStatusIcon></View>

        <TextWithIcon
            icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.location}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"location-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.location}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"person-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={projects.getUserById(userRole==="supervisor" ? project.manager_id:project.supervisor_id)?.firstName}
        ></TextWithIcon>
        <View><TextWithIcon
            icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.clientNumber}
        ></TextWithIcon>
            <ThemedButton onPress={_=>Linking.openURL(`tel:${project.clientNumber}`)}><Text>Call</Text></ThemedButton>
        </View>

        </View>
        <View style={[
            styles.problems
        ]}>
            <TextWithIcon
                icon={<Ionicons name={"warning"} size={20} color={theme.colors.text}></Ionicons>}
                text={"Problèmes"}
                textStyle={{
                    fontSize:20
                }}
                viewStyle={{
                    marginLeft:-10
                }}
            ></TextWithIcon>
            {problems!=undefined && problems.length>0 ? problems.map(problem=><ProblemCard problem={problem}/>) : <Loader/>}
        </View>
            <View style={{marginHorizontal:20}}>
                <TextWithIcon
                    icon={<Ionicons name={"camera-outline"} size={20} color={theme.colors.text}></Ionicons>}
                    text={"Photos"}
                    textStyle={{
                        fontSize:20
                    }}
                    viewStyle={{
                        marginLeft:-10
                    }}
                ></TextWithIcon>
                <View>
                    {project.pics.map(id=>{
                        console.log("pic id:", id)
                        return <Image onLoad={_=>{
                            console.log("loadé !")
                        }} source={{
                            uri:APIService.getPicturePreview(id, 300, 525),
                            width:imageWidth,
                            height:imageWidth*1.75
                        }}></Image>
                    })}
                </View>
            </View>
            <ThemedButton onPress={_=>pickImage()
            //     router.navigate({
            //     pathname:"/camera",
            //     params:{
            //         id:project.id
            //     }
            // })
            }>
                <Text>Ajouter une photo</Text>
            </ThemedButton>
        </ScrollView>
    </ThemedPage>
}

const styles = StyleSheet.create({
    titleContainer:{
        flexDirection:"row",
        // alignItems:"center",
        justifyContent:"space-between",
        marginHorizontal:20,
        marginBottom:10
    },
    objectText:{
        fontSize:20,
        width:'90%'
    },
    problems:{
        marginHorizontal:15,
        marginTop:15
    }
})