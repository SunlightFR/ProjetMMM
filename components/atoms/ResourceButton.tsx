import {ResourceType} from "@/api/models/Resource";
import {GestureResponderEvent, Text, TouchableOpacity, View} from "react-native";
import {FontAwesome6} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTranslation} from "react-i18next";

interface Props{
    selected?:boolean,
    type:ResourceType,
    name:string,
    available:boolean,
    onPress:(e:GestureResponderEvent)=>void
}
export const getResourceIcon = (type:ResourceType)=>{
    switch (type){
        case "vehicle":return "truck"
        case "tools":return "wrench"
        case "staff": return "users"
        default:return "gear"
    }
}
export const ResourceButton = ({available,name,type,onPress, selected=false}:Props)=>{
    const {t} = useTranslation()
    return <TouchableOpacity onPress={onPress} style={{
        width:100,
        height:100,
        backgroundColor:"lightgrey",
        alignItems:"center",
        justifyContent:"center",
        opacity:available ? 1:0.6,
        borderRadius:5
    }}>
        {selected && <View style={{alignSelf:"flex-end", marginRight:2, marginTop:2}}><Ionicons name={"checkmark-circle"} size={10} color={"green"}></Ionicons></View>}
        <FontAwesome6  style={{flex:1,marginTop:15}} name={getResourceIcon(type)} size={60} color={"grey"}></FontAwesome6>
        <Text>{name}</Text>
        {!available && <View style={
            {
                width:"100%",
                height:"100%",
                position:"absolute",
                top:0,
                left:0,
                zIndex:999,
                opacity:1,
                alignItems:"center",
                justifyContent:"center"
            }}>
            <Text style={{
                transform:"rotate(-45deg)",
                fontSize:18,
            }}>{t('unavailable')}</Text>
        </View>}

    </TouchableOpacity>
}