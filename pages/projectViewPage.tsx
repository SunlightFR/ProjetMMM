import {Project, ProjectId} from "@/api/models/Project";
import {UserRole} from "@/api/models/User";
import {ThemedPage} from "@/components/ThemedPage";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {useProjects} from "@/contexts/ProjectsContext";
import {useEffect, useState} from "react";
import {Problem} from "@/api/models/Problems";
import {ProblemCard} from "@/components/ProblemCard";
import {Loader} from "@/components/atoms/Loader";

interface Props{
    projectId:ProjectId,
    userRole:UserRole
}
export const ProjectViewPage = ({projectId,userRole}:Props)=>{
    const theme = useTheme()
    const projects = useProjects()
    if(!projects.projects) return <ActivityIndicator></ActivityIndicator>
    const project = projects.projects.find(p=>p.id===projectId);
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

    return <ThemedPage>
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
        <TextWithIcon
            icon={<Ionicons name={"call-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={project.clientNumber}
        ></TextWithIcon>
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