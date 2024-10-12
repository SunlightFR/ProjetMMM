import {ProjectId} from "@/api/models/Project";
import {Button, View} from "react-native";
import {useEffect, useState} from "react";
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


interface Props {
    projectInput?:Partial<ProjectInput>
}
export const ProjectEditionPage = ({projectInput}:Props)=>{
    const theme = useTheme()
    const user = useUser()
    const projects = useProjects()
    //On considère que si un projectId est fourni, on est en mode édition.
    const mode = projectInput ? "edition":"creation"

    const [projectInput_, setProjectInput] = useState<Partial<ProjectInput>>({})
    useEffect(() => {
        if(projectInput) {
            console.log("refresh", projectInput)
            setProjectInput(projectInput)
        }
    }, [projectInput]);

    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false)
    const [date, setDate] = useState<Date>()


    const handleDateChange = (event:DateTimePickerEvent, selectedDate:Date) => {
        if(event.type==="dismissed"){
            setIsDatePickerVisible(false)
        }else{
            setIsDatePickerVisible(false)
            setDate(new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()))
        }
    }

    return <ThemedPage>
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

        <Button title={"créer"} onPress={_=>{
            projects.createNewProject({
                object:"Test chantier",
                end:new Date(),
                start:new Date(),
                clientNumber:"0235",
                location:"Paris",
                manager_id:user.current?.userId,
                supervisor_id:user.current?.userId,
                resources:[],
                status:"stopped"
            }).then(d=>{
                console.log(d)
            }).catch(e=>{
                console.error(e)
        })}}></Button>
        <Button title={"ouvrir"} onPress={_=>setIsDatePickerVisible(true)}></Button>

        {isDatePickerVisible && <DateTimePicker
            value={projectInput_?.start ?? date ??  new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}

            // style={styles.datetimePicker}
        />}


    </ThemedPage>
}