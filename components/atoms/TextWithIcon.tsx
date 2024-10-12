import {StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ReactNode} from "react";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    icon:ReactNode,
    text:string,
    textStyle?:StyleProp<TextStyle>
    viewStyle?:StyleProp<ViewStyle>
}
export const TextWithIcon = ({textStyle,icon,viewStyle,text}:Props)=>{
    const {colors} = useTheme()
    return <View style={[styles.container,viewStyle]}>
        {icon}
        <Text style={[{color:colors.text}, styles.text,textStyle]}>{text}</Text>
    </View>
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        flexDirection:"row",
        paddingHorizontal:10,
        paddingVertical:5
    },
    text:{
        fontSize:16,
        marginLeft:6
    }
})