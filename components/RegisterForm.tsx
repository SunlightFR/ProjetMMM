import React, {useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {router} from "expo-router";
import {useUser} from "@/contexts/UserContext";
import {useTranslation} from "react-i18next";
import {UserRole} from "@/api/models/User";
import {ThemedButton2} from "@/components/atoms/ThemedButton";
import {ThemedText} from "@/components/ThemedText";
import {TouchableText} from "@/components/atoms/TouchableText";
import {UserRolePicker} from "@/components/UserRolePicker";

export const RegisterForm = ()=>{
    const user = useUser()
    const {t} = useTranslation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<UserRole>('manager');

    return <View style={styles.container}>
        <ThemedText style={{ fontSize:20,
            textAlign:'center',
            marginBottom:10}}>{t('register')}</ThemedText>
        <ThemedTextInput
            style={{marginBottom:10}}
            value={email}
            autoCapitalize={false}
            onChangeText={setEmail}
            label={<TextWithIcon
                text={t("email")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            style={{marginBottom:10}}
            autoCapitalize={false}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            label={<TextWithIcon
                text={t("password")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            style={{marginBottom:10}}
            value={firstName}
            onChangeText={setFirstName}
            label={<TextWithIcon
                text={t("first-name")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            style={{marginBottom:10}}
            value={lastName}
            onChangeText={setLastName}
            label={<TextWithIcon
                text={t("last-name")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <UserRolePicker role={role} onSubmit={setRole}></UserRolePicker>
        <View style={styles.buttonContainer}>
            <ThemedButton2
                style={{marginHorizontal:"auto", marginBottom:20}}
                title={t('register')}
                onPress={
                    () => {
                        user.register(email, password, firstName, lastName, role).then(()=>{
                            router.navigate('/')
                        }).catch(e=>{
                            console.error("reg", e)
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