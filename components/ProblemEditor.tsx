import {ThemedTextInput} from "@/components/atoms/TextInput";
import {ThemedModal} from "@/components/atoms/ThemedModal";
import {useState} from "react";
import {Button, Text} from "react-native";
import {ThemedButton} from "@/components/atoms/ThemedButton";
import {Problem} from "@/api/models/Problems";
import {ProblemInput} from "@/types/inputTypes";
import {toast} from "@/lib/toast";

interface Props{
    onClose:(event:any)=>void,
    visible:boolean,
    onEnd:(problem:ProblemInput)=>void
}
export const ProblemEditor=({onClose,visible, onEnd}:Props)=>{
    const [title, setTitle] = useState<string>()
    const [description, setDescription] = useState<string>()

    const onValidate = ()=>{
        console.log("validation...")
        if(title && title!=""){
            onEnd({
                description:description,
                object:title
            })
        }else{
            toast("Renseignez un titre")
        }
    }

    return <ThemedModal visible={visible} onClose={onClose}>
        <ThemedTextInput
            value={title}
            onChangeText={setTitle}
            label={<Text>Title</Text>}
            placeholder={"yee"}></ThemedTextInput>
        <ThemedTextInput
            value={description} onChangeText={setDescription}
            label={<Text>Desc</Text>}
        ></ThemedTextInput>
        <ThemedButton onPress={_=>{
            onValidate()
        }}><Text>Valider</Text></ThemedButton>
    </ThemedModal>
}