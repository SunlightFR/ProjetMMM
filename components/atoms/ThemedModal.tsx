import {Modal, View} from "react-native";
import {useTheme} from "@/hooks/useThemeColor";
import {ReactNode} from "react";

interface Props{
    visible?:boolean,
    children:ReactNode,
    onClose:(event:any)=>void
}

export const ThemedModal = ({visible=false,children, onClose}:Props)=>{
    const {colors} = useTheme()
    return <Modal
        visible={visible}
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
            <View style={{
                justifyContent: "center",
                backgroundColor: colors.background,
                borderColor:colors.border,
                borderWidth:2,
                elevation:5,
                padding: 20,
                borderRadius: 10,
                width:"80%"
            }}>
                {children}
            </View>
        </View>
    </Modal>
}

