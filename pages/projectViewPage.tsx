import {Project, ProjectId} from "@/api/models/Project";
import {UserRole} from "@/api/models/User";
import {ThemedPage} from "@/components/ThemedPage";
import {ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, View} from "react-native";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {useProjects} from "@/contexts/ProjectsContext";
import {forwardRef, useEffect, useRef, useState} from "react";
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
import {BottomSheetModal, BottomSheetModalProvider, BottomSheetView} from "@gorhom/bottom-sheet";
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {StatusPicker} from "@/components/StatusPicker";
import {ThemedBottomSheetModal} from "@/components/atoms/ThemedBottomSheetModal";
import {ThemedModal} from "@/components/atoms/ThemedModal";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {ProblemEditor} from "@/components/ProblemEditor";
import {getEndDate} from "@/utils/dateUtils";

const screenWidth = Dimensions.get('window').width;
const imageWidth = (screenWidth-30)/4
console.info("width:",imageWidth)

interface Props{
    projectId:ProjectId,
    userRole:UserRole
}
export const ProjectViewPage = gestureHandlerRootHOC(({projectId,userRole}:Props)=>{
    const theme = useTheme()
    const projects = useProjects()
    if(!projects.projects) return <ActivityIndicator></ActivityIndicator>
    const project = projects.projects[projectId];
    if(!project) return <Text>Problème...</Text>

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);


    const [problems, setProblems] = useState<Problem[]|undefined>(undefined)
    const [isProblemEditorVisible, setProblemEditorVisible] = useState<boolean>(false)
    useEffect(() => {
        (async ()=>{
            const pbs = []
            for(const projectId of project.problems){ //project.problems){
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
        <BottomSheetModalProvider>
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
            <Ionicons name={"pencil"} color={theme.colors.text} size={20} onPress={_=>router.navigate({pathname:"edit", params:{id:projectId}})}></Ionicons>
        </View>
        <View style={{marginLeft:15}}>
            <View style={{marginRight:"auto", marginBottom:10}}><ProjectStatusIcon status={project.status} ></ProjectStatusIcon></View>

        <TextWithIcon
            icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.start + "-" + getEndDate(project.start, project.duration).getDate()}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"location-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.location}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"person-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={projects.getUserById(userRole==="supervisor" ? project.manager_id:project.supervisor_id)?.firstName}
        ></TextWithIcon>
        <View style={{alignItems:'center', flexDirection:'row'}}><TextWithIcon
            icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.clientNumber}
        ></TextWithIcon>
            <ThemedButton onPress={_=>Linking.openURL(`tel:${project.clientNumber}`)}><TextWithIcon icon={<></>} text={"Appeler"}/></ThemedButton>
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
            {problems === undefined && <Loader></Loader>}
            {problems!=undefined && problems.length>0 ? problems.map(problem=><ProblemCard problem={problem}/>) :
                <TextWithIcon
                    text={"Aucun problème"}
                ></TextWithIcon>
            }
            <ThemedButton
                onPress={_=>setProblemEditorVisible(true)}
                style={{marginHorizontal:"auto"}}
            >
                <TextWithIcon icon={<></>} text={"Ajouter un problème"}></TextWithIcon>
            </ThemedButton>
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
            <ThemedButton onPress={_=>bottomSheetModalRef.current?.present()}><Text>test</Text></ThemedButton>
        </ScrollView>

            <ProblemEditor onClose={_=>setProblemEditorVisible(false)} onEnd={_=>{
                projects.createProblem(projectId, _).then(()=>{
                    setProblemEditorVisible(false)
                }).catch(e=>{
                    toast(e)
                })
            }} visible={isProblemEditorVisible}></ProblemEditor>
            <ThemedButton onPress={_=>setProblemEditorVisible(true)}><Text>problème</Text></ThemedButton>

        <ThemedBottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['25%','50%']}
            // style={{
            //     backgroundColor:theme.colors.background,
            //     // borderColor:"blue"
            // }}
            //
            // backgroundStyle={{
            //     backgroundColor:theme.colors.background,
            //     borderColor:"blue",
            //     borderWidth:2,
            //     borderStyle:"solid"
            // }}
            // handleIndicatorStyle={{backgroundColor:'red'}}
        >
            <BottomSheetView style={{
                backgroundColor:theme.colors.background,
                marginHorizontal:"auto"
            }}>
                <Text>Bonjour</Text>
                <StatusPicker onSelected={_=>projects.updateProjectStatus(projectId, _)}></StatusPicker>
            </BottomSheetView>
        </ThemedBottomSheetModal>
        </BottomSheetModalProvider>
    </ThemedPage>
})

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