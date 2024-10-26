import {ProjectStatus} from "@/api/models/Project";
import {Text, StyleSheet, GestureResponderEvent, Pressable} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTranslation} from "react-i18next";
/**
 * Couleur correspondant à chaque statut
 */
const StatusColors = {
    "finished":"#6cc460",
    "not-done":"grey",
    "in-progress":"#3b9dee",
    "stopped":"#f64e4e"
}

/**
 * Code d'icône Ionicons correspondant à chaque statut
 */
const Icons = {
    "finished":"checkmark-circle-outline",
    "in-progress":"time-outline",
    "stopped":"alert-circle-outline",
    "not-done":"calendar-outline"
}

const textColor = "#111"

interface Props{
    status:ProjectStatus,
    onPress?:(e:GestureResponderEvent)=>void
}
export const ProjectStatusIcon = ({status,onPress}:Props)=>{
    const {t,i18n} = useTranslation()
    return (
        <Pressable
            onPress={onPress}
            style={[
                { backgroundColor: StatusColors[status] },
                styles.container
            ]}
        >
            <Text style={styles.text}>{t(status)}</Text>

            {/*@ts-ignore*/}
            <Ionicons name={Icons[status]} size={20} color={textColor}/>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        borderRadius:7,
        paddingHorizontal:6,
        paddingVertical:3,
        justifyContent:"center"
    },
    text:{
        color:textColor,
        marginRight:3
    }
})