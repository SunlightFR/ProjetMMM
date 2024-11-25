import {ThemedTextInput} from "@/components/atoms/TextInput";
import {ThemedModal} from "@/components/atoms/ThemedModal";
import {useState} from "react";
import {Button, Text} from "react-native";
import {ThemedButton} from "@/components/atoms/ThemedButton";
import {Problem} from "@/api/models/Problems";
import {ProblemInput} from "@/types/inputTypes";
import {toast} from "@/lib/toast";
import {useTranslation} from "react-i18next";
import {ThemedText} from "@/components/ThemedText";

interface Props{
    onClose:(event:any)=>void,
    visible:boolean,
    onEnd:(problem:ProblemInput)=>void
}
export const ProblemEditor=({onClose,visible, onEnd}:Props)=>{
    const {t} = useTranslation()
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
            label={<ThemedText>{t('problem-title')}</ThemedText>}
            placeholder={t('problem-title-ph')}></ThemedTextInput>
        <ThemedTextInput
            style={{marginTop:10}}
            lines={5}
            value={description}
            onChangeText={setDescription}
            label={<ThemedText>{t('problem-desc')}</ThemedText>}
            placeholder={t('problem-desc-ph')}
        ></ThemedTextInput>
        <ThemedButton style={{marginTop:10}} onPress={_=>{
            onValidate()
        }}><Text>{t('submit')}</Text></ThemedButton>
    </ThemedModal>
}