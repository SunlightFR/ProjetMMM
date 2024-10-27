import {ProjectId} from "@/api/models/Project";
import {UserRole} from "@/api/models/User";
import {ThemedPage} from "@/components/ThemedPage";
import {ActivityIndicator, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, View} from "react-native";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {useProjects} from "@/contexts/ProjectsContext";
import {useEffect, useRef, useState} from "react";
import {Problem} from "@/api/models/Problems";
import {ProblemCard} from "@/components/ProblemCard";
import {Loader} from "@/components/atoms/Loader";
import {ProjectStatusIcon} from "@/components/atoms/ProjectStatus";
import {APIService} from "@/api/appwriteApi";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {router} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import {toast} from "@/lib/toast";
import {BottomSheetModal, BottomSheetModalProvider, BottomSheetView} from "@gorhom/bottom-sheet";
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {StatusPicker} from "@/components/StatusPicker";
import {ThemedBottomSheetModal} from "@/components/atoms/ThemedBottomSheetModal";
import {ProblemEditor} from "@/components/ProblemEditor";
import {getEndDate} from "@/utils/dateUtils";
import {ResourcesViewer} from "@/components/ResourcesViewer";
import {Pictures} from "@/components/Pictures";

// const screenWidth = Dimensions.get('window').width;
// const imageWidth = (screenWidth - 30) / 4
// console.info("width:", imageWidth)

interface Props {
    projectId: ProjectId,
    userRole: UserRole
}

export const ProjectViewPage = gestureHandlerRootHOC(({projectId, userRole}: Props) => {
    const theme = useTheme()
    const projects = useProjects()
    if (!projects.projects) return <ActivityIndicator></ActivityIndicator>
    const project = projects.projects[projectId];
    if (!project) return <Text>Ce chantier n'existe pas !</Text>

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const [problems, setProblems] = useState<Problem[] | undefined>(undefined)
    const [isProblemEditorVisible, setProblemEditorVisible] = useState<boolean>(false)
    useEffect(() => {
        (async () => {
            const pbs = []
            for (const projectId of project.problems) {
                pbs.push(await projects.getProblemById(projectId))
            }
            // console.log("problems", pbs)
            setProblems(pbs)
        })()
    }, [project.problems]);

    /**
     * Propose à l'utilisateur de prendre une photo.
     */
    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,//qualité baissée car Appwrite n'accepte que des images <5Mo
        });

        // console.log(result);

        if (!result.canceled) {
            // console.log(result.assets[0])
            toast("Photo en cours d'envoi")
            try{
                await projects.uploadPicture(projectId, result.assets[0]);
                toast('photo uploadée')
            }
            catch(e){
                toast("Impossible d'envoyer la photo pour le moment")
            }
        }
    };

    const formattedDate = (start:Date, duration:number)=>{
        const end = getEndDate(start, duration)
        return Intl.DateTimeFormat('fr', {//TODO locale
                dateStyle:"medium"
            }).format(start)
            + (start.getHours() === 0 ? " (matin)" : " (aprem)")
            + " - "
            +Intl.DateTimeFormat('fr', {//TODO locale
                dateStyle:"medium"
            }).format(end)
            + (end.getHours() === 0 ? " (matin)" : " (aprem)")
    }

    return <ThemedPage>
        <BottomSheetModalProvider>
            <ScrollView>
                <View style={[
                    {
                        backgroundColor: theme.colors.background,
                    },
                    styles.titleContainer
                ]}>
                    <Text style={[
                        {color: theme.colors.text},
                        styles.objectText
                    ]}>{project.object}</Text>
                    {userRole === "supervisor" && <Ionicons
                        name={"pencil"} color={theme.colors.text} size={20}
                        onPress={_ => router.navigate({
                            pathname: "edit",
                            params: {id: projectId}
                        })}/>}
                </View>
                <View style={{marginLeft: 15}}>
                    <View style={{marginRight: "auto", marginBottom: 10}}>
                        <ProjectStatusIcon
                            status={project.status}
                            onPress={_=>bottomSheetModalRef.current!.present()}
                        ></ProjectStatusIcon>
                    </View>

                    <TextWithIcon
                        icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
                        text={formattedDate(project.start, project.duration)}
                        viewStyle={{marginBottom:8}}
                    ></TextWithIcon>
                    <TextWithIcon
                        icon={<Ionicons name={"location-outline"} color={theme.colors.text} size={20}></Ionicons>}
                        text={project.location}
                        viewStyle={{marginBottom:8}}
                    ></TextWithIcon>
                    <TextWithIcon
                        icon={<Ionicons name={"person-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
                        text={projects.getUserById(userRole === "supervisor" ? project.manager_id : project.supervisor_id)?.firstName}
                        viewStyle={{marginBottom:4}}
                    ></TextWithIcon>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        <TextWithIcon
                            icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
                            text={project.clientNumber}
                            viewStyle={{marginRight:10}}
                        ></TextWithIcon>
                        <ThemedButton2
                            title={"Appeler"}
                            onPress={_ => Linking.openURL(`tel:${project.clientNumber}`)}
                        ></ThemedButton2>
                    </View>


                </View>
                <View style={[
                    styles.problems
                ]}>
                    <TextWithIcon
                        icon={<Ionicons name={"warning"} size={20} color={theme.colors.text}></Ionicons>}
                        text={"Problèmes"}
                        textStyle={{
                            fontSize: 20
                        }}
                        viewStyle={{
                            // marginLeft: -10
                        }}
                    ></TextWithIcon>
                    {problems === undefined && <Loader></Loader>}
                    {problems != undefined && problems.length > 0 ? problems.map(problem => <ProblemCard
                            problem={problem}/>) :
                        <TextWithIcon
                            text={"Aucun problème"}
                            viewStyle={{marginVertical:8}}
                        ></TextWithIcon>
                    }
                    {userRole === "manager" && <ThemedButton2
                        onPress={_ => setProblemEditorVisible(true)}
                        style={{marginHorizontal: "auto"}}
                        title={"Signaler un problème"}
                    />}
                </View>
                <View style={{marginHorizontal: 20}}>
                    <TextWithIcon
                        icon={<Ionicons name={"camera-outline"} size={20} color={theme.colors.text}></Ionicons>}
                        text={"Photos"}
                        textStyle={{
                            fontSize: 20
                        }}
                        viewStyle={{
                            marginBottom:8
                        }}
                    ></TextWithIcon>
                    <View>
                        <Pictures picturesIds={project.pics}></Pictures>
                    </View>
                </View>
                <ThemedButton2 style={{marginHorizontal:"auto", marginTop:8}}  onPress={_ => pickImage()} title={"Ajouter une image"}/>
                {/*<ThemedButton onPress={_=>bottomSheetModalRef.current?.present()}><Text>test</Text></ThemedButton>*/}
                {/*{project.resources}*/}
                <View style={{marginHorizontal: 20}}>
                    <TextWithIcon
                        icon={<Ionicons name={"cog-outline"} size={20} color={theme.colors.text}></Ionicons>}
                        text={"Resources"}
                        textStyle={{
                            fontSize: 20
                        }}
                        // viewStyle={{
                        //     marginBottom:8
                        // }}
                    ></TextWithIcon>
                    <ResourcesViewer projectId={projectId}></ResourcesViewer>
                </View>
            </ScrollView>

            <ProblemEditor onClose={_ => setProblemEditorVisible(false)} onEnd={_ => {
                projects.createProblem(projectId, _).then(() => {
                    setProblemEditorVisible(false)
                }).catch(e => {
                    toast(e)
                })
            }} visible={isProblemEditorVisible}></ProblemEditor>


            {/*<ThemedButton onPress={_=>setProblemEditorVisible(true)}><Text>problème</Text></ThemedButton>*/}

            <ThemedBottomSheetModal
                ref={bottomSheetModalRef}
                snapPoints={['25%', '50%']}
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
                    backgroundColor: theme.colors.background,
                    marginHorizontal: "auto"
                }}>
                    <StatusPicker onSelected={_ => projects.updateProjectStatus(projectId, _)}></StatusPicker>
                </BottomSheetView>
            </ThemedBottomSheetModal>
        </BottomSheetModalProvider>
    </ThemedPage>
})

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        // alignItems:"center",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 10
    },
    objectText: {
        fontSize: 20,
        width: '90%'
    },
    problems: {
        marginHorizontal: 20,
        marginTop: 15
    }
})