import {useUser} from "@/contexts/UserContext";
import {useProjects} from "@/contexts/ProjectsContext";
import {ThemedPage} from "@/components/ThemedPage";
import Ionicons from "@expo/vector-icons/Ionicons";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {useTranslation} from "react-i18next";
import {useTheme} from "@/hooks/useThemeColor";
import {ProjectsViewer} from "@/components/ProjectsViewer";
import {ThemedText} from "@/components/ThemedText";
import {View} from "react-native";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import * as Clipboard from 'expo-clipboard';
import {CopyId} from "@/components/CopyId";
import {router} from "expo-router";

export const ManagerPage = ()=>{
    const user = useUser()
    const projects = useProjects()
    const theme = useTheme()
    const {t} = useTranslation()

    // if(Object.keys(projects.projects).length);

    return <ThemedPage>
        <View style={{flex:1, justifyContent:"center", marginHorizontal:20}}>
        <Ionicons name={"settings"} style={{position:"absolute",top:25, right:25}} color={theme.colors.text} size={30} onPress={_=>router.navigate('/settings')}></Ionicons>
        <TextWithIcon
            icon={<Ionicons name={"construct-outline"} color={theme.colors.text} size={20}></Ionicons>}

            text={t("ongoing-projects")}
            viewStyle={{marginBottom:8}}
        ></TextWithIcon>
        <ProjectsViewer></ProjectsViewer>

        {user.current?.role === "manager" ?
            <CopyId id={user.current.userId}></CopyId>
            : <View>
                <ThemedButton2 onPress={_=>{}} title={t('manage-resources')}/>
                <ThemedButton2 onPress={_=>{}} title={t('manage-contacts')}/>
            </View>
        }
        </View>
    </ThemedPage>
}