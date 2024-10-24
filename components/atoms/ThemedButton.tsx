import {Button, GestureResponderEvent, Pressable, StyleProp, Text, ViewStyle} from "react-native";
import {ReactNode} from "react";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    onPress:(event:GestureResponderEvent)=>void,
    children:ReactNode,
    style?:StyleProp<ViewStyle>,
}
export const ThemedButton = ({children,onPress, style}:Props)=>{
    const {colors}= useTheme()
    return <Pressable onPress={onPress} style={[{
        backgroundColor:colors.border,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:5,
    }, style]}>
        {children}
    </Pressable>
}
interface Props2{
    onPress:(event:GestureResponderEvent)=>void,
    title:string,
    style?:StyleProp<ViewStyle>
}
export const ThemedButton2 = ({onPress, title, style}:Props2)=>{
    const {colors}= useTheme()
    return <Pressable onPress={onPress} style={[{
        backgroundColor:colors.border,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:15,
        paddingHorizontal:12,
        paddingVertical:4,
    },style]}>
        <Text style={{
            fontSize:18,
            color:colors.text
        }}>{title}</Text>
    </Pressable>
}