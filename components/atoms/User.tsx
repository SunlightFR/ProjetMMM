import {ThemedButton} from "@/components/atoms/ThemedButton";
import {GestureResponderEvent, StyleSheet, View} from "react-native";
import {User, UserId} from "@/api/models/User";
import {useTheme} from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props{
    selected?:boolean,
    onPress?:(event: GestureResponderEvent) => void,
}

export const UserView = ({selected, onPress}:Props)=>{
    const {colors} = useTheme()

    return (
        <View>
            <Ionicons name={"person-circle-outline"} color={colors.text}></Ionicons>
        </View>
    )
}

const styles = StyleSheet.create({

})