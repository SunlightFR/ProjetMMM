import {ThemedPage} from "@/components/ThemedPage";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useUser} from "@/contexts/UserContext";
import {useTranslation} from "react-i18next";
import {router} from "expo-router";

export const SettingsPage = ()=>{
    const {logout, current} = useUser()
    const {t} = useTranslation()
    return <ThemedPage>
        <ThemedButton2 onPress={_=>{
            logout().then(()=>{
                router.navigate('/')
            })
        }} title={t('logout')}/>
    </ThemedPage>
}