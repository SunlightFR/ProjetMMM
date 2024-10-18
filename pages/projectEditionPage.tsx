import {ProjectId} from "@/api/models/Project";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useRef, useState} from "react";
import {ProjectInput} from "@/types/inputTypes";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {SafeAreaView} from "react-native-safe-area-context";
import {APIService} from "@/api/appwriteApi";
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
import Checkbox from 'expo-checkbox';



interface Props {
    projectInput?:Partial<ProjectInput>
}
export const ProjectEditionPage = gestureHandlerRootHOC(({projectInput}:Props)=>{
    const theme = useTheme()
    const user = useUser()
    const projects = useProjects()
    //On considère que si un projectId est fourni, on est en mode édition.
    const mode = projectInput ? "edition":"creation"

    const userBottomSheetModalRef = useRef<BottomSheetModal>(null);


    const [projectInput_, setProjectInput] = useState<Partial<ProjectInput>>({})
    useEffect(() => {
        if(projectInput) {
            console.log("refresh", projectInput)
            setProjectInput(projectInput)
        }
    }, [projectInput]);

    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false)
    //todo
    const [date, setDate] = useState<Date>()
    const [duration, setDuration] = useState<number>()
    const [morningAfternoon, setMorningAfternoon] = useState<"morning"|"afternoon"|undefined>()


    const handleDateChange = (event:DateTimePickerEvent, selectedDate:Date) => {
        if(event.type==="dismissed"){
            setIsDatePickerVisible(false)
        }else{
            setIsDatePickerVisible(false)
            setProjectInput(s=>({
                ...s,
                start:new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate(), 0)
            }))
        }
    }

    return <ThemedPage><BottomSheetModalProvider>
        <ThemedTextInput
            value={projectInput_?.object ?? ""}
            onChangeText={text=>setProjectInput(s=>({
                ...s,
                object:text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"construct-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={"Object"}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            value={projectInput_?.location ?? ""}
            onChangeText={text=>setProjectInput(s=>({
                ...s,
                location:text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"location-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={"Location"}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            placeholder={"numéro"}
            type={"phone-pad"}
            value={projectInput_?.clientNumber ?? ""}
            onChangeText={text=>setProjectInput(s=>({
                ...s,
                clientNumber:text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={"Client Number"}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <View style={styles.dateContainer}

        >
            <TouchableText
                text={projectInput_.start?.toDateString()}
                onPress={_=>setIsDatePickerVisible(true)}
                label={<TextWithIcon
                    icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
                    text={"Date"}
                ></TextWithIcon>}
            ></TouchableText>
            <Checkbox
                disabled={projectInput_.start===undefined}
                // style = {{backgroundColor:'red'}}
                value={projectInput_.start?.getHours() === 0}
                onChange={(_)=>{
                    console.log("changé")
                    const date = projectInput_.start
                    date?.setHours(0)
                    setProjectInput(s=>({
                        ...s,
                        start:date
                    }))
                }}
            ></Checkbox>
            {/*<Checkbox*/}
            {/*    disabled={date === undefined}*/}
            {/*    style = {{}}*/}

            {/*    value={morningAfternoon === "afternoon" ?? false}*/}
            {/*    onChange={(_)=>{*/}
            {/*        if(morningAfternoon === "afternoon") {*/}
            {/*            setMorningAfternoon(undefined)*/}
            {/*        }*/}
            {/*        else setMorningAfternoon("afternoon")*/}
            {/*        console.log("cliqué")*/}
            {/*    }}*/}
            {/*></Checkbox>*/}


        </View>
        <ThemedTextInput
            disabledMessage={"Veuillez d'abord saisir une date"}
            disabled={projectInput_.start===undefined}
            placeholder={"numéro"}
            type={"number-pad"}
            value={projectInput_.duration ?? ""}
            onChangeText={text=>setProjectInput(s=>({
                ...s,
                duration:text
            }))}
            label={<TextWithIcon
                icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={"Duration"}
            ></TextWithIcon>}
        ></ThemedTextInput>

        <TouchableText
            text={projectInput_.manager_id ? projects.getUserById(projectInput_.manager_id).firstName:""}
            onPress={_=>userBottomSheetModalRef.current!.present()}
            label={<TextWithIcon
                icon={<Ionicons name={"person-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
                text={"Manager"}
            ></TextWithIcon>}
        ></TouchableText>

        <Button title={"créer"} onPress={_=>{
            const pI = projectInput_
            pI.supervisor_id = user.current!.userId
            pI.resources = []
            pI.duration = Number.parseInt(pI.duration)
            pI.status = 'not-done'
            projects.createNewProject(pI)
            // projects.createNewProject({
            //     object:"etvdsbhhhhb qerhk ts uoren qerk esr sqmerk ubqer rqe s jrebk qrej qer req qrve jfqdbuqyubqrh vqrubvr rv jrqdsuo jdfoqrvi qvoif",
            //     duration:525,
            //     start:new Date(),
            //     clientNumber:"0235",
            //     location:"Paris",
            //     manager_id:user.current?.userId,
            //     supervisor_id:user.current?.userId,
            //     resources:[],
            //     status:"not-done"
            // })
                .then(d=>{
                console.log(d)
            }).catch(e=>{
                console.error(e)
        })}}></Button>
        <Button title={"ouvrir"} onPress={_=>userBottomSheetModalRef.current!.present()}></Button>

        {isDatePickerVisible && <DateTimePicker
            value={projectInput_?.start ?? date ??  new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}

            // style={styles.datetimePicker}
        />}
        <ResourceButton selected={true} type={"tools"} name={"Outil1"} available={false} onPress={_=>{}}></ResourceButton>


        <ThemedBottomSheetModal ref={userBottomSheetModalRef} snapPoints={['25%','50%']} >
            <BottomSheetView>
                <UserPicker selectedUser={projectInput_.manager_id} users={['67052d650020a8263f27']} onSelected={u=>setProjectInput(s=>({...s, manager_id:u}))}></UserPicker>
            </BottomSheetView>
        </ThemedBottomSheetModal>



    </BottomSheetModalProvider>

    </ThemedPage>
})

const styles = StyleSheet.create({
    dateContainer:{
        flexDirection:"row"
    }
})