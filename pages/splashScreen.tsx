import {ThemedView} from "@/components/ThemedView";
import {Loader} from "@/components/atoms/Loader";
import {useTheme} from "@/hooks/useThemeColor";
import {Image, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export const SplashScreen = ({message})=>{
    const {colors} = useTheme()
    return <View style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.background
    }}>
        <Image
            source={require("../assets/images/splash.png")}
            // resizeMode={"contain"}
            style={{width:50, height:50}}
        ></Image>
        <Loader/>
        <ThemedText>{message}</ThemedText>
    </View>
}