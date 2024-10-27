import {Project} from "@/api/models/Project";
import {ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useUser} from "@/contexts/UserContext";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {ProjectStatusIcon} from "@/components/atoms/ProjectStatus";
import {WarningIcon} from "@/components/atoms/WarningIcon";
import {useProjects} from "@/contexts/ProjectsContext";
import {Loader} from "@/components/atoms/Loader";
import {ThemedText} from "@/components/ThemedText";
import {getEndDate} from "@/utils/dateUtils";

interface Props {
    project: Project,
    onPress: (event: GestureResponderEvent) => void
}

export const ProjectCard = ({project, onPress}: Props) => {
    const theme = useTheme();
    const user = useUser()
    const projects = useProjects()

    if (!user.current) return <View><Loader/></View>

    return <TouchableOpacity style={[
        {
            borderColor: theme.colors.border,
            shadowColor: theme.colors.shadow,
            backgroundColor: theme.colors.background
        },
        styles.container
    ]} onPress={onPress}>
        <ThemedText style={[
            {color: theme.colors.text},
            styles.objectText
        ]}>{project.object}</ThemedText>
        <TextWithIcon
            icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={Intl.DateTimeFormat('fr', {//TODO locale
                dateStyle:"medium"
            }).format(project.start) +" - "+Intl.DateTimeFormat('fr', {//TODO locale
                dateStyle:"medium"
            }).format(getEndDate(project.start, project.duration))}
            viewStyle={{marginTop: 8}}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"location-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.location}
            viewStyle={{marginTop: 8}}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"person-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={projects.getUserById(user.current.role === "supervisor" ? project.manager_id : project.supervisor_id)?.firstName}
            viewStyle={{marginTop: 8}}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.clientNumber}
            viewStyle={{marginVertical: 8}}
        ></TextWithIcon>
        <View style={styles.bottom}>
            <ProjectStatusIcon status={project.status}></ProjectStatusIcon>
            {project.problems.length > 0 && <WarningIcon number={project.problems.length}/>}
        </View>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 2,
        marginHorizontal: 10,
        marginBottom: 15,
        padding: 10,

        elevation: 5,
        shadowRadius: 5,
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.8
    },
    objectText: {
        fontSize: 20
    },
    bottom: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: "space-between"
    }
})