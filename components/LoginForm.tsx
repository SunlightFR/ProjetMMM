import React, {useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {router} from "expo-router";
import {useUser} from "@/contexts/UserContext";
import {useTranslation} from "react-i18next";
import {ThemedText} from "@/components/ThemedText";
import { ThemedButton2 } from "./atoms/ThemedButton";

export const LoginForm = ()=>{
    const user = useUser()
    const {t} = useTranslation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <View style={styles.container}>
        <ThemedText style={{
            fontSize:20,
            textAlign:'center',
            marginBottom:10
        }}>{t('login')}</ThemedText>
        <ThemedTextInput
            style={{marginBottom:10}}
            autoCapitalize={false}
            value={email}
            onChangeText={setEmail}
            label={<TextWithIcon
                text={t("email")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            style={{marginBottom:10 }}
            autoCapitalize={false}
            secureTextEntry
            label={<TextWithIcon text={t('password')}/>}
            value={password}
            onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
            <ThemedButton2
                style={{marginHorizontal:"auto", marginBottom:20}}
                title={t('login')}
                onPress={
                    () => {
                        user.login(email, password).then(()=>{
                            router.navigate('/')
                        })
                    }
                }
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        width:"80%",
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});