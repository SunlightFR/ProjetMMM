import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import {useTheme} from "@/hooks/useThemeColor";
import {ReactNode} from "react";

interface Props{
    text?:string,
    onPress:(event:GestureResponderEvent)=>void,
    label:ReactNode,
    placeholder?:string
}
export const TouchableText = ({text,label,onPress, placeholder}:Props)=>{
    const {colors} = useTheme()

    return <View  style={[
        { backgroundColor:colors.background },
        styles.container
    ]}>
        {label}
        <Pressable onPress={onPress}>

        <Text style={[
            {
                color:text ? colors.text : colors.placeholder,
                backgroundColor:colors.background,
                borderColor:colors.border,
                shadowColor:colors.shadow,
            },
            styles.text
        ]}>
            {text ?? placeholder}
        </Text>
        </Pressable>

    </View>
}

const styles = StyleSheet.create({
    container:{

    },
    text:{
        paddingTop:7,
        paddingBottom:4,
        paddingHorizontal:10,
        borderRadius:10,
        borderWidth:2,
        justifyContent:"center",
        alignItems:"center",
        fontSize:15,
        marginTop:6,

        // marginHorizontal:15,

        elevation:5,
        shadowRadius:5,
        shadowOffset:{
            width:2,
            height:0
        },
        shadowOpacity:0.8
    }
})