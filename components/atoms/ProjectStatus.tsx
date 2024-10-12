import {ProjectStatus} from "@/api/models/Project";
import {Text, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const StatusColors = {
    "finished":"#6cc460",
    "not-done":"grey",
    "in-progress":"#3b9dee",
    "stopped":"#f64e4e"
}
const TextColor = "#111"

interface Props{
    status:ProjectStatus
}
export const ProjectStatusIcon = ({status}:Props)=>{

    const statusIcon = (status:ProjectStatus)=>{
        const iconSize = 20
        switch (status){
            case "finished":return <Ionicons name={"checkmark-circle-outline"} size={iconSize} color={TextColor}></Ionicons>
            case "in-progress":return <Ionicons name={"time-outline"} size={iconSize} color={TextColor}></Ionicons>
            case "stopped":return <Ionicons name={"alert-circle-outline"} size={iconSize} color={TextColor}></Ionicons>
            case "not-done":return <Ionicons name={"calendar-outline"} size={iconSize} color={TextColor}></Ionicons>
        }
    }

    return <View style={[
        { backgroundColor: StatusColors[status] },
        styles.container
    ]}>
        <Text style={styles.text}>{status}</Text>
        {statusIcon(status)}
    </View>
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        borderRadius:7,
        paddingHorizontal:6,
        paddingVertical:3
    },
    text:{
        color:TextColor,
        marginRight:3
    }
})