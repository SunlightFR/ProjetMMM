import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {useState} from "react";

type Props = {
    onSelected:(hour:number)=>void,
    current:number
}
export const MorningAfternoonPicker = ({onSelected, current}:Props)=>{
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
    return <ThemedButton2 onPress={onPress} title={hour===0?"Matin":"Aprem"}/>
}