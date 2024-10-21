import {ThemedTextInput} from "@/components/atoms/TextInput";
import {ThemedModal} from "@/components/atoms/ThemedModal";
import {useState} from "react";
import {Button, Text, View} from "react-native";
import {ThemedButton} from "@/components/atoms/ThemedButton";
import {Problem} from "@/api/models/Problems";
import {ProblemInput, ResourceInput} from "@/types/inputTypes";
import {toast} from "@/lib/toast";
import {ResourceType} from "@/api/models/Resource";
import Checkbox from "expo-checkbox";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import Ionicons from "@expo/vector-icons/Ionicons";
import {FontAwesome6} from "@expo/vector-icons";
import {getResourceIcon} from "@/components/atoms/ResourceButton";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    onClose:(event:any)=>void,
    visible:boolean,
    onEnd:(resource:ResourceInput)=>void
}
export const ResourceEditor=({onClose,visible, onEnd}:Props)=>{
    const {colors} = useTheme()
    const [name, setName] = useState<string>()
    const [resourceType, setResourceType] = useState<ResourceType>()

    const onValidate = ()=>{
        console.log("validation...")
        if(name && resourceType){
            onEnd({
                name:name,
                type:resourceType
            })
        }else{
            toast("Renseignez un nom et un type de resource")
        }
    }

    const TypeInput = ({type})=>{
        return <View style={{flexDirection:"row"}}>
            <Checkbox
                value={resourceType ? resourceType===type : false}
                onValueChange={value=>{
                    setResourceType(value ? type : undefined)
                }}
                disabled={false}
            ></Checkbox>
            <TextWithIcon
                text={type}
                iconPosition={"right"}
                icon={<FontAwesome6 name={getResourceIcon(type)} color={colors.text}></FontAwesome6>}
            ></TextWithIcon>
        </View>
    }

    return <ThemedModal visible={visible} onClose={onClose}>
        <ThemedTextInput
            value={name}
            onChangeText={setName}
            label={<Text>Title</Text>}
            placeholder={"yee"}>
        </ThemedTextInput>
        <View>

            <TypeInput type={"staff"}></TypeInput>
            <TypeInput type={"vehicle"}></TypeInput>
            <TypeInput type={"tools"}></TypeInput>

        </View>

        {/*<ThemedTextInput*/}
        {/*    lines={5}*/}
        {/*    value={description} onChangeText={setDescription}*/}
        {/*    label={<Text>Desc</Text>}*/}
        {/*></ThemedTextInput>*/}
        <ThemedButton onPress={_=>{
            onValidate()
        }}><Text>Valider</Text></ThemedButton>
    </ThemedModal>
}