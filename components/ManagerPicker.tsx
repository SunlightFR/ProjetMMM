import {useProjects} from "@/contexts/ProjectsContext";
import {BottomSheetView} from "@gorhom/bottom-sheet";
import {UserId} from "@/api/models/User";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {useEffect, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useTheme} from "@/hooks/useThemeColor";
import {ThemedBottomSheetModal} from "@/components/atoms/ThemedBottomSheetModal";
import {ThemedButton} from "@/components/atoms/ThemedButton";
import {usePick} from "@/hooks/usePick";

interface Props{
    users:UserId[],
    selectedUser?:UserId,
    onSelected:(selectedUser:UserId)=>void
}

export const UserPicker = ({users, selectedUser, onSelected}:Props) =>{
    const {colors} = useTheme()
    const projects = useProjects();
    const [selectedUser_, setSelectedUser] = useState<UserId|undefined>()

    useEffect(() => {
        users.forEach(async (userId)=>{
            await projects.loadUser(userId)
        })
    }, [users]);

    useEffect(() => {
        if(selectedUser){
            setSelectedUser(selectedUser)
        }
    }, [selectedUser]);

    const toggle = (userId:UserId)=>{
        if(selectedUser_ === userId){
            setSelectedUser(undefined)
        }else{
            setSelectedUser(userId)
        }
    }


    return (
        <View style={{
            backgroundColor:colors.background,
            margin:"auto"
        }}>
            {users.map(userId=>{
                const user = projects.getUserById(userId)
                return (
                    <TouchableOpacity
                        onPress={_=>toggle(userId)}
                        style={{
                            flexDirection:"row",
                            alignItems:"center",
                            backgroundColor:selectedUser_ === userId ? colors.border : colors.background,
                            paddingHorizontal:10,
                            paddingVertical:5
                        }}
                    >
                        <Ionicons name={"person-circle-outline"} size={20}></Ionicons>
                        <View style={{
                            backgroundColor:selectedUser_ === userId ? colors.border : colors.background,
                            marginLeft:5
                        }}>
                            <ThemedText>{user.firstName} {user.lastName}</ThemedText>
                            <ThemedText>{user.role}</ThemedText>
                        </View>
                    </TouchableOpacity>
                )
            })}
            <ThemedButton
                onPress={_=>onSelected(selectedUser_)}
            ><ThemedText>Valider</ThemedText></ThemedButton>
        </View>
    )
}