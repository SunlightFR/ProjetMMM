import React, {useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {router} from "expo-router";
import {useUser} from "@/contexts/UserContext";
import {useTranslation} from "react-i18next";
import {ThemedText} from "@/components/ThemedText";

export const LoginForm = ()=>{
    const user = useUser()
    const {t} = useTranslation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <View style={styles.container}>
        <ThemedText>{t('login')}</ThemedText>
        <ThemedTextInput
            autoCapitalize={false}
            value={email}
            onChangeText={setEmail}
            label={<TextWithIcon
                text={t("email")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            autoCapitalize={false}
            secureTextEntry
            label={<TextWithIcon text={t('password')}/>}
            value={password}
            onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
            <Button
                title="Login"
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
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});