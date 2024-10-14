import {ProjectStatus} from "@/api/models/Project";
import {TouchableOpacity, View} from "react-native";
import {ProjectStatusIcon} from "@/components/atoms/ProjectStatus";

interface Props {
    currentStatus?:ProjectStatus,
    onSelected:(status:ProjectStatus)=>void
}

export const StatusPicker = ({currentStatus, onSelected}:Props)=>{
    return <View>
        {(['not-done', 'in-progress', 'finished', 'stopped'] as ProjectStatus[]).map(status=>{
            return <TouchableOpacity onPress={_=>onSelected(status)}>
                <ProjectStatusIcon status={status}/>
            </TouchableOpacity>
        })}
    </View>
}