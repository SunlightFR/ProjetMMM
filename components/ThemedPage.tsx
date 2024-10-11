import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet} from "react-native";
import {useTheme} from "@/hooks/useThemeColor";

interface Props{
    children:React.ReactNode
}

export const ThemedPage = ({children}:Props)=>{
    const {colors} = useTheme()

    return <SafeAreaView style={[
        { backgroundColor:colors["background"] }
    ]}>
        {children}
    </SafeAreaView>
}

const styles = StyleSheet.create({
    pageStyle:{

    }
})