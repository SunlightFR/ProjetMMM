import {ThemedModal} from "@/components/atoms/ThemedModal";
import {ProblemInput} from "@/types/inputTypes";
import {Text} from "react-native";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import React, {useState} from "react";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useTranslation} from "react-i18next";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";
import {toast} from "@/lib/toast";
import {useProjects} from "@/contexts/ProjectsContext";
import {ThemedText} from "@/components/ThemedText";

interface Props{
    onClose:(event:any)=>void,
    visible:boolean,
    onEnd:(problem:ProblemInput)=>void
}
export const AddContactModal = ({onClose, visible, onEnd}:Props)=>{
    const {t} = useTranslation()
    const [userId, setUserId] = useState<string>()
    const  {addContact} = useProjects()

    const onValidate = ()=>{
        if(!userId || userId === ""){//todo
            toast(t('contact-code-warning'))//todo
            return;
        }
        addContact(userId).then(_=>{
            toast("contact ajoué avec sucès")
        }).catch(e=>{
            console.error(e);
        })
    }

    return <ThemedModal onClose={onClose} visible={visible}>
        <ThemedTextInput
            style={{marginBottom:10}}
            value={userId}
            onChangeText={setUserId}
            label={<ThemedText>{t('add-contact-title')}</ThemedText>}
            placeholder={t('add-contact-ph')}
        />
        <ThemedButton2
            onPress={_=>onValidate()}
            title={t('submit')}
        />

    </ThemedModal>
}