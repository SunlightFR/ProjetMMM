import {Text, TextInput, View} from "react-native";

interface Props{
    placeholder?:string,
    value:string,
    onChangeText:(text:string)=>void,
    label:string,
}
export const ThemedTextInput = ({label,onChangeText,value,placeholder}:Props)=>{
    return <View>
        <Text>{label}</Text>
        <TextInput
            onChangeText={onChangeText}
            value={value}
            placeholder={placeholder}
        ></TextInput>
    </View>
}