import {ProjectStatus} from "@/api/models/Project";
import {Text, StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";

const AlertColor = "#f63838"

interface Props{
    number:number
}
export const WarningIcon = ({number}:Props)=>{
    const {colors} = useTheme()
    return <View style={[
        { borderColor: AlertColor },
        styles.container
    ]}>
        <Ionicons name={"warning"} size={20} color={AlertColor}></Ionicons>
        <Text style={[
            {color:colors.text},
            styles.text
        ]}>{number} problems</Text>
    </View>
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        borderRadius:7,
        borderWidth:1,
        paddingHorizontal:6,
        paddingVertical:3
    },
    text:{
        marginLeft:3,

    }
})