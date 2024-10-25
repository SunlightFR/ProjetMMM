import {ActivityIndicator, Dimensions, Image, Pressable, View} from "react-native";
import {useState} from "react";
import ImageView from "react-native-image-viewing";
import {APIService} from "@/api/appwriteApi";
import {Picture} from "@/components/atoms/Picture";

const screenWidth = Dimensions.get('window').width;
const imageWidth = (screenWidth - 70) / 3

type Props = {
    picturesIds:string[]
}
export const Pictures = ({picturesIds}:Props)=>{

    /**
     * Si défini, l'ImageView s'affiche. Elle affiche l'image dnt l'id est la valeur.
     */
    const [visibleIndex, setVisibleIndex] = useState<number|undefined>(undefined);

    const onPress = (id:number)=>{
        setVisibleIndex(id)
    }

    return <View style={{
        flexDirection:'row',
        gap:10,
        flexWrap:'wrap'
    }}>
        {picturesIds.map((url,id)=><Pressable onPress={_=>onPress(id)}>
            <Picture source={{
                uri:APIService.getPicturePreview(url, 300, 525),
                width:imageWidth,
                height:imageWidth*1.75
            }}/>
        </Pressable>)}

        <ImageView
            images={picturesIds.map(url=>({uri:APIService.getPictureUrl(url)}))}
            imageIndex={visibleIndex ?? 0}
            visible={visibleIndex!=undefined}
            onRequestClose={() => setVisibleIndex(undefined)}
            swipeToCloseEnabled={true}
        />
    </View>
}