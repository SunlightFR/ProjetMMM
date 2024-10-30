import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {useTranslation} from "react-i18next";
import {ThemedPage} from "@/components/ThemedPage";
import {LoginForm} from "@/components/LoginForm";
import {RegisterForm} from "@/components/RegisterForm";
import {ThemedButton2} from "@/components/atoms/ThemedButton";

enum Mode {LOGIN, REGISTER}
export default function LoginScreen() {
    const {t} = useTranslation()
    const [mode, setMode] = useState<Mode>(Mode.LOGIN)

    return (
        <ThemedPage>
            <View style={styles.container}>
                {mode === Mode.LOGIN ? <LoginForm/> : <RegisterForm/>}
                <ThemedButton2
                    title={mode === Mode.LOGIN ? t('go-register') : t('go-login')}
                    onPress={_=>{
                        if(mode === Mode.LOGIN) {
                            setMode(Mode.REGISTER)
                        }else {
                            setMode(Mode.LOGIN)
                        }
                    }}
                />
            </View>
        </ThemedPage>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:"center"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
