import {Image, ImageSourcePropType, View, StyleSheet} from "react-native";
import {useState} from "react";
import {Loader} from "@/components/atoms/Loader";

type PictureProps = {
    source: ImageSourcePropType
}
export const Picture = ({source}:PictureProps)=>{
    const [loaded, setLoaded] = useState<boolean>(false)

    return <View>
        <Image
            source={source}
            onLoad={_=>setLoaded(true)}
        />
        {!loaded && <View style={styles.loaderContainer}>
            <Loader/>
        </View>
        }
    </View>
}

const styles = StyleSheet.create({
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});