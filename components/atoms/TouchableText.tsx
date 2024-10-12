import {
    GestureResponderEvent,
    KeyboardTypeOptions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {useTheme} from "@/hooks/useThemeColor";
import {ReactNode} from "react";

interface Props{
    text:string,
    onPress:(event:GestureResponderEvent)=>void,
    label:ReactNode,
}
export const TouchableText = ({text,label,onPress}:Props)=>{
    const {colors} = useTheme()

    return <TouchableOpacity onPress={onPress} style={[
        { backgroundColor:colors.background },
        styles.container
    ]}>
        {label}
        <Text style={[
            {
                color:colors.text,
                backgroundColor:colors.background,
                borderColor:colors.border,
                shadowColor:colors.shadow,
            },
            styles.text
        ]}>
            {text}
        </Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    container:{

    },
    text:{
        padding:6,
        borderRadius:10,
        borderWidth:2,
        marginHorizontal:15,

        elevation:5,
        shadowRadius:5,
        shadowOffset:{
            width:2,
            height:0
        },
        shadowOpacity:0.8
    }
})