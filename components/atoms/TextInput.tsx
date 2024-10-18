import {KeyboardTypeOptions, StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native";
import {useTheme} from "@/hooks/useThemeColor";
import {ReactNode} from "react";
import {toast} from "@/lib/toast";

interface Props{
    placeholder?:string,
    value:string,
    onChangeText:(text:string)=>void,
    //Un élément React placé au-dessus de l'input, ayant un rôle de label
    label:ReactNode,
    //Type de clavier
    type?:KeyboardTypeOptions,
    //Nombre de lignes de l'input
    lines?:number,
    style?:StyleProp<ViewStyle>,
    disabled?:boolean,
    disabledMessage?:string,
}


export const ThemedTextInput = ({type,label,onChangeText,value,placeholder, lines, style, disabledMessage, disabled}:Props)=>{
    const {colors} = useTheme()

    return <View style={[
        { backgroundColor:colors.background },
        styles.container,
        style
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
            showSoftInputOnFocus={!disabled}
            onPress={_=>{
                console.log("pressé")
                if(disabled) {
                    _.preventDefault()
                    // _.stopPropagation()
                    if(disabledMessage) {
                        toast(disabledMessage)
                    }
                }
            }}
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
        marginTop:5,
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:10,
        borderWidth:2,
        fontSize:16,

        elevation:5,
        shadowRadius:5,
        shadowOffset:{
            width:2,
            height:0
        },
        shadowOpacity:0.8
    }
})