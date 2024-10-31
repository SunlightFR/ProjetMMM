import {UserId} from "@/api/models/User";
import {ThemedText} from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import {StyleSheet, View} from "react-native";
import {useTranslation} from "react-i18next";
import {useTheme} from "@/hooks/useThemeColor";

type Props = {
    id:UserId
}
export const CopyId = ({id}:Props)=>{
    const {t} = useTranslation()
    const {colors} = useTheme()

    return <View style={styles.container}>
        <ThemedText>{t('give-code')}</ThemedText>
        <View style={[{
            borderColor:colors.border
        },styles.codeContainer]}>
        <ThemedText>{id}</ThemedText>
        <Ionicons
            style={styles.icon}
            name={"copy-outline"}
            onPress={_=>{
                Clipboard.setStringAsync(id)
            }}
            color={colors.text}
            size={20}
        ></Ionicons>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        marginHorizontal:"auto",
        marginTop:5
    },
    icon:{
        marginLeft:6
    },
    codeContainer:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:5,
        paddingHorizontal:6,
        paddingVertical:3,
        borderWidth:2,
        borderRadius:5
    }
})