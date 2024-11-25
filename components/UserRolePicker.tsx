import {UserRole} from "@/api/models/User";
import {ThemedModal} from "@/components/atoms/ThemedModal";
import Checkbox from "expo-checkbox";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {FontAwesome6} from "@expo/vector-icons";
import {getResourceIcon} from "@/components/atoms/ResourceButton";
import {View} from "react-native";
import React, {useEffect, useState} from "react";
import {TouchableText} from "@/components/atoms/TouchableText";
import {useTranslation} from "react-i18next";
import {ThemedButton2} from "@/components/atoms/ThemedButton";

type Props = {
    role:UserRole,
    onSubmit:(userRole:UserRole)=>any,
    onClose:()=>void,
    visible:boolean
}
export const UserRolePicker = ({role,onSubmit,visible,onClose}:Props)=>{
    const {t} = useTranslation()
    const [role_, setRole] = useState<UserRole>(role)
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if(role) setRole(role)
    }, [role]);
    const submit = (r?:UserRole)=>{
        setRole(r);
        onSubmit(r!);
    }

    return <>
        <TouchableText
        onPress={_=>setIsVisible(true)}
        label={<TextWithIcon text={t('pick-role')}/>}
        text={t(role_)}
        placeholder={t('pick-role-ph')}
    ></TouchableText>
        <ThemedModal
        onClose={_=>setIsVisible(false)}
        visible={isVisible}
    >
        <View style={{flexDirection:"row"}}>
            <Checkbox
                value={role_ ? role_==="manager" : false}
                onValueChange={value=>{
                    submit(value ? "manager" : undefined)
                }}
                disabled={false}
            ></Checkbox>
            <TextWithIcon
                text={t('manager')}
                iconPosition={"right"}
            ></TextWithIcon>
        </View>
            <View style={{flexDirection:"row"}}>
                <Checkbox

                    value={role_ ? role_==="supervisor" : false}
                    onValueChange={value=>{
                        submit(value ? "supervisor" : undefined)
                    }}
                    disabled={false}
                ></Checkbox>
                <TextWithIcon
                    text={t('supervisor')}
                    iconPosition={"right"}
                ></TextWithIcon>
            </View>
            <ThemedButton2 onPress={_=>{
                setIsVisible(false)

            }}
                title={t('submit')}/>

    </ThemedModal></>
}