import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {toast} from "@/lib/toast";

type Props = {
    onSelected:(hour:number)=>void,
    current?:number,
    disabled?:boolean
}
export const MorningAfternoonPicker = ({onSelected, current,disabled}:Props)=>{
    const {t} = useTranslation()
    const [hour, setHour] = useState<number>(current ?? 0)
    useEffect(() => {
        if(current){
            setHour(current)
        }
    }, [current]);
    const onPress = ()=>{
        if(disabled){
            toast(t("select-date"))
            return;
        }
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