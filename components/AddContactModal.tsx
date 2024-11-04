import {ThemedModal} from "@/components/atoms/ThemedModal";
import {ProblemInput} from "@/types/inputTypes";
import {Text} from "react-native";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {useState} from "react";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useTranslation} from "react-i18next";
import {APIService} from "@/api/appwriteApi";
import {useUser} from "@/contexts/UserContext";
import {toast} from "@/lib/toast";
import {useProjects} from "@/contexts/ProjectsContext";

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
            toast("")//todo
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
            value={userId}
            onChangeText={setUserId}
            label={<Text>Title</Text>}
            placeholder={"yee"}//todo
        />
        <ThemedButton2
            onPress={_=>onValidate()}
            title={""}//todo
        />

    </ThemedModal>
}