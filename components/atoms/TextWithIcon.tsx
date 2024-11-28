import {StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {ReactNode} from "react";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    icon?:ReactNode,
    iconPosition?:"left" | "right",
    text:string,
    textStyle?:StyleProp<TextStyle>
    viewStyle?:StyleProp<ViewStyle>
}
export const TextWithIcon = ({textStyle,icon,viewStyle,text, iconPosition="left"}:Props)=>{
    const {colors} = useTheme()
    return <View style={[styles.container,viewStyle]}>
        {icon && iconPosition === "left" && icon}
        <Text style={[{color:colors.text}, styles.text,textStyle, {
            marginLeft:icon ? 6 : 0,
            marginRight:6
        }]}>{text}</Text>
        {icon && iconPosition === "right" && icon }
    </View>
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        flexDirection:"row",
    },
    text:{
        fontSize:16,
    }
})