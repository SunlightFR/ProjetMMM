import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useState} from "react";
import {useTranslation} from "react-i18next";

type Props = {
    onSelected:(hour:number)=>void,
    current:number
}
export const MorningAfternoonPicker = ({onSelected, current}:Props)=>{
    const {t} = useTranslation()
    const [hour, setHour] = useState<number>(0)
    const onPress = ()=>{
        if(hour===0){
            setHour(12);
            onSelected(12)
        }else{
            setHour(0)
            onSelected(0)
        }
    }
    return <ThemedButton2
        style={{alignSelf:"flex-end", marginBottom:2, marginHorizontal:"auto"}}
        onPress={onPress}
        title={hour===0?t("morning"):t("afternoon")}
    />
}