import {View, Text, StyleSheet, TouchableOpacity, Button, ToastAndroid} from "react-native";
import {useRef, useState} from "react";
import {CameraCapturedPicture, CameraPictureOptions, CameraView, useCameraPermissions} from 'expo-camera';
import {router, useLocalSearchParams} from 'expo-router';
import {APIService} from "@/api/appwriteApi";
import {toast} from "@/lib/toast";
import {useProjects} from "@/contexts/ProjectsContext";

export default function CameraPage (){
    let cameraRef = useRef();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<CameraCapturedPicture>();
    const [modalVisible, setModalVisible] = useState(false)

    const projects = useProjects()
    const {projectId} = useLocalSearchParams()

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                {/*TODO trad*/}
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }


    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    let takePic = async () => {
        let options:CameraPictureOptions = {
            quality: 1,
            base64: true,
            exif: false,
            imageType:"jpg"

        };
        try{
            // @ts-ignore
            let newPhoto = await cameraRef.current!.takePictureAsync(options);
            setPhoto(newPhoto);
            await projects.uploadPicture(projectId, newPhoto);
            toast('photo uploadée')
        }catch(e){
            toast("problème")
        }
    };

    const closeModal = ()=>{
        setModalVisible(false)
    }
    // @ts-ignore
    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                animateShutter={false}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>{"flip-camera"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.takePicButton} onPress={_=>takePic()}>

                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        alignItems:'center',
        justifyContent:'center'
    },
    button: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    takePicButton:{
        borderRadius:30,
        width:60,
        height:60,
        backgroundColor:"white",
        borderColor:"lightgrey",
        borderWidth:5,
        bottom:5
    }
});