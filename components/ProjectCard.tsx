import {Project} from "@/api/models/Project";
import {ActivityIndicator, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {useUser} from "@/contexts/UserContext";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {ProjectStatusIcon} from "@/components/atoms/ProjectStatus";
import {WarningIcon} from "@/components/atoms/WarningIcon";

interface Props {
    project:Project
}
export const ProjectCard = ({project}:Props)=>{
    const theme = useTheme();
    const user = useUser()
    if(!user.current) return <View><ActivityIndicator></ActivityIndicator></View>
    return <TouchableOpacity style={[
        {
            borderColor:theme.colors.border,
            shadowColor:theme.colors.shadow,
            backgroundColor:theme.colors.background
        },
        styles.container
    ]}>
        <Text style={[
            {color:theme.colors.text},
            styles.objectText
        ]}>{project.object}</Text>
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
            text={user.current.role==="supervisor" ? project.manager_id:project.supervisor_id}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.clientNumber}
        ></TextWithIcon>
        <View style={styles.bottom}>
            <ProjectStatusIcon status={project.status}></ProjectStatusIcon>
            <WarningIcon number={2}></WarningIcon>
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container:{
        borderRadius:10,
        borderWidth:2,
        marginHorizontal:"auto",
        marginBottom:15,
        padding:10,

        elevation:5,
        shadowRadius:5,
        shadowOffset:{
            width:1,
            height:1
        },
        shadowOpacity:0.8
    },
    objectText:{
        fontSize:20
    },
    bottom:{
        marginTop:4,
        flexDirection:'row',
        justifyContent:"space-between"
    }
})