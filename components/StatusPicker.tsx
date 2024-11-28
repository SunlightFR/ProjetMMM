import {ProjectStatus} from "@/api/models/Project";
import {View} from "react-native";
import {ProjectStatusIcon} from "@/components/atoms/ProjectStatus";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";

interface Props {
    currentStatus?:ProjectStatus,
    onSelected:(status:ProjectStatus)=>void
}

export const StatusPicker = ({currentStatus, onSelected}:Props)=>{
    return <View>
        <TextWithIcon
            text={"Choisissez un statut pour le chantier"}
            viewStyle={{marginBottom:5}}
        />
        <View
            style={{marginHorizontal:"auto", gap:3, marginBottom:10}}
        >
            {(['not-done', 'in-progress', 'finished', 'stopped'] as ProjectStatus[]).map((status,id)=>{
                return <ProjectStatusIcon key={id} status={status} onPress={_=>onSelected(status)}/>
            })}
        </View>
    </View>
}