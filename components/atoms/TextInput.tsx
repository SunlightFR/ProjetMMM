import {KeyboardTypeOptions, StyleSheet, Text, TextInput, View} from "react-native";
import {useTheme} from "@/hooks/useThemeColor";
import {ReactNode} from "react";

interface Props{
    placeholder?:string,
    value:string,
    onChangeText:(text:string)=>void,
    label:ReactNode,
    type?:KeyboardTypeOptions,
    lines?:number
}
export const ThemedTextInput = ({type,label,onChangeText,value,placeholder, lines}:Props)=>{
    const {colors} = useTheme()

    return <View style={[
        { backgroundColor:colors.background },
        styles.container
    ]}>
        {label}
        <TextInput
            placeholderTextColor={colors.placeholder}
            keyboardType={type}
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
            numberOfLines={lines}
            multiline={lines !== undefined && lines >1}
            style={[
                {
                    color:colors.text,
                    backgroundColor:colors.background,
                    borderColor:colors.border,
                    shadowColor:colors.shadow,
                },
                styles.textInput
            ]}
        ></TextInput>
    </View>
}

const styles = StyleSheet.create({
    container:{

    },
    textInput:{
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