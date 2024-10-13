import {Button, GestureResponderEvent, Pressable} from "react-native";
import {ReactNode} from "react";

interface Props{
    onPress:(event:GestureResponderEvent)=>void,
    children:ReactNode
}
export const ThemedButton = ({children,onPress}:Props)=>{
    return <Pressable onPress={onPress}>
        {children}
    </Pressable>
}