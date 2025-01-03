import {Project, ProjectId} from "@/api/models/Project";
import {Button, ScrollView, StyleSheet, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import {ProjectInput} from "@/types/inputTypes";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {useUser} from "@/contexts/UserContext";
import {useProjects} from "@/contexts/ProjectsContext";
import {ThemedPage} from "@/components/ThemedPage";
import Ionicons from "@expo/vector-icons/Ionicons";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {useTheme} from "@/hooks/useThemeColor";
import {TouchableText} from "@/components/atoms/TouchableText";
import {ThemedBottomSheetModal} from "@/components/atoms/ThemedBottomSheetModal";
import {UserPicker} from "@/components/ManagerPicker";
import {BottomSheetModal, BottomSheetModalProvider, BottomSheetView} from "@gorhom/bottom-sheet";
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {ResourceButton} from "@/components/atoms/ResourceButton";
import {ResourcePicker} from "@/components/ResourcePicker";
import {MorningAfternoonPicker} from "@/components/MorningAfternoonPicker";
import {useTranslation} from "react-i18next";
import {toast} from "@/lib/toast";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {ResourcesViewer} from "@/components/ResourcesViewer";


interface Props {
    projectInput?: Partial<ProjectInput>,
    projectId?: ProjectId,
}

export const ProjectEditionPage = gestureHandlerRootHOC(({projectInput, projectId}: Props) => {
    const theme = useTheme()
    const {t} = useTranslation()
    const user = useUser()
    const projects = useProjects()

    //On considère que si un projectInput est fourni, on est en mode édition.
    const mode = projectInput ? "edition" : "creation"

    console.log("MODE : ", mode, projectInput)

    const userBottomSheetModalRef = useRef<BottomSheetModal>(null);
    const resourcesBottomSheetModalRef = useRef<BottomSheetModal>(null);

    const [projectInput_, setProjectInput] = useState<Partial<ProjectInput>>({})

    useEffect(() => {
        if (projectInput) {
            setProjectInput(projectInput)
        }
    }, [projectInput]);

    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false)
    //todo
    const [date, setDate] = useState<Date>()
    const [duration, setDuration] = useState<number>()
    const [morningAfternoon, setMorningAfternoon] = useState<"morning" | "afternoon" | undefined>()


    const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
        if (event.type === "dismissed") {
            setIsDatePickerVisible(false)
        } else {
            setIsDatePickerVisible(false)
            setProjectInput(s => ({
                ...s,
                start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0)
            }))
        }
    }

    const updateProject = () => {
        const pI = projectInput_ as Project
        delete pI.id
        delete pI.supervisor_id
        delete pI.problems
        delete pI.pics
        projects.updateProject(projectId, projectInput_).then(d => {
            console.log("update", d)
        }).catch(e => {
            console.error('update', e)
        });
    }

    const createProject = () => {
        const pI = {...projectInput_}
        pI.supervisor_id = user.current!.userId
        pI.duration = Number.parseInt(pI.duration)
        pI.status = 'not-done'
        projects.createNewProject(pI)
    }

    const submit = () => {
        if (mode === "edition") {
            updateProject()
        } else {
            createProject()
        }
    }

    return <ThemedPage><BottomSheetModalProvider>
        <ScrollView style={{marginHorizontal:15}} 
        // contentContainerStyle={{flex:1, justifyContent:'center'}}
        >
        <ThemedTextInput
            placeholder={t('Object')}
            style={{marginBottom:8}}
            value={projectInput_?.object ?? ""}
            onChangeText={text => setProjectInput(s => ({
                ...s,
                object: text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"construct-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={t("Object")}
            ></TextWithIcon>}
        ></ThemedTextInput>

        <ThemedTextInput
            placeholder={t("Location")}
            style={{marginBottom:8}}
            value={projectInput_?.location ?? ""}
            onChangeText={text => setProjectInput(s => ({
                ...s,
                location: text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"location-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={t("Location")}
            ></TextWithIcon>}
        ></ThemedTextInput>

        <ThemedTextInput
            style={{marginBottom:8}}
            placeholder={t("Client-number")}
            type={"phone-pad"}
            value={projectInput_?.clientNumber ?? ""}
            onChangeText={text => setProjectInput(s => ({
                ...s,
                clientNumber: text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={t("Client-number")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <View style={styles.dateContainer}

        >
            <TouchableText
                text={projectInput_.start?.toDateString()}
                placeholder={t('Date')}
                onPress={_ => setIsDatePickerVisible(true)}
                label={<TextWithIcon
                    icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
                    text={t("Date")}
                ></TextWithIcon>}
            ></TouchableText>
            <MorningAfternoonPicker
                current={projectInput_.start?.getHours()}
                onSelected={hour=>{
                    const date = projectInput_.start
                    date?.setHours(hour)
                    setProjectInput(s => ({
                        ...s,
                        start: date
                    }))
                }}
                disabled={projectInput_.start === undefined}
            />


        </View>
        <ThemedTextInput
            style={{marginBottom:8}}
            disabledMessage={t("select-date")}
            disabled={projectInput_.start === undefined}
            placeholder={"numéro"}
            type={"number-pad"}
            value={projectInput_.duration?.toString()}
            onChangeText={text => setProjectInput(s => ({
                ...s,
                duration: text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={t("Duration")}
            ></TextWithIcon>}
        ></ThemedTextInput>

        <TouchableText
            placeholder={t("Manager")}
            text={projectInput_.manager_id ? projects.getUserById(projectInput_.manager_id).firstName : undefined}
            onPress={_ => {
                if(projectInput_.start){
                    userBottomSheetModalRef.current!.present()
                }else {
                    toast(t("select-date"))
                }
            }}
            label={<TextWithIcon
                icon={<Ionicons name={"person-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={t("Manager")}
            ></TextWithIcon>}
        ></TouchableText>
            <TextWithIcon
                viewStyle={{marginTop:8}}
                icon={<Ionicons name={"cog"} color={theme.colors.text} size={20}></Ionicons>}
                text={t("Resources")}
            ></TextWithIcon>
            <ResourcesViewer resources={projectInput_.resources}/>
            <ThemedButton2
                style={{marginHorizontal:'auto', width:"70%", marginTop:10}}
                title={t('edit-resources')}
                onPress={_ => resourcesBottomSheetModalRef.current!.present()}
            ></ThemedButton2>


            <ThemedButton2
            title={t('submit')}
            onPress={_ => submit()}
            style={{marginHorizontal:'auto', width:"70%", marginVertical:10}}
        ></ThemedButton2>

        {isDatePickerVisible && <DateTimePicker
            value={projectInput_?.start ?? date ?? new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
        />}


        <ThemedBottomSheetModal ref={userBottomSheetModalRef} snapPoints={['25%', '50%']}>
            <BottomSheetView>
                <UserPicker
                    selectedUser={projectInput_.manager_id}
                    users={user.current?.contacts}
                    onSelected={u => setProjectInput(s => ({...s, manager_id: u}))}
                    start={projectInput_.start}
                    duration={projectInput_.duration}
                ></UserPicker>

            </BottomSheetView>
        </ThemedBottomSheetModal>

        <ThemedBottomSheetModal ref={resourcesBottomSheetModalRef} snapPoints={['25%', '50%']}>
            <BottomSheetView>
                <ResourcePicker
                    selectedResources={projectInput_.resources}
                    resourceIds={projects.resources} onSelected={(rids) => {
                    console.error("validation", rids)
                    setProjectInput(p => ({
                        ...p,
                        resources: rids
                    }))
                }} start={projectInput_.start} duration={projectInput_.duration}></ResourcePicker>
            </BottomSheetView>
        </ThemedBottomSheetModal>
        </ScrollView>


    </BottomSheetModalProvider>

    </ThemedPage>
})

const styles = StyleSheet.create({
    dateContainer: {
        flexDirection: "row",
        marginBottom:8,
        alignItems:"center",
        // justifyContent:"space-between"
    }
})