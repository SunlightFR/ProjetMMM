import {Problem} from "@/api/models/Problems";
import {StyleSheet, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    problem:Problem
}
export const ProblemCard = ({problem}:Props)=>{
    const theme = useTheme()
    return <View style={[
        styles.container,
        {
            borderColor:theme.colors.border,
            backgroundColor:theme.colors.background
        }
    ]}>
        <Text style={[
            {color:theme.colors.text, fontSize:18},
        ]}>{problem.object}</Text>
        <TextWithIcon
            icon={<Ionicons name={"information-circle-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={problem.description ?? 'pas de description'}
        ></TextWithIcon>
        <TextWithIcon
            icon={<Ionicons name={"calendar-outline"} color={theme.colors.text} size={20}></Ionicons>}
            text={problem.date ?? "date non renseignée"}
        ></TextWithIcon>
    </View>
}

const styles = StyleSheet.create({
    container:{
        borderRadius:10,
        borderWidth:2,
        marginBottom:15,
        padding:10,

        elevation:5,
        shadowRadius:5,
        shadowOffset:{
            width:1,
            height:1
        },
        shadowOpacity:0.8
    }
})