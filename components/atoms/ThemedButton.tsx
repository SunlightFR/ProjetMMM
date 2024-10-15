import {Button, GestureResponderEvent, Pressable, StyleProp, ViewStyle} from "react-native";
import {ReactNode} from "react";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    onPress:(event:GestureResponderEvent)=>void,
    children:ReactNode,
    style?:StyleProp<ViewStyle>
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