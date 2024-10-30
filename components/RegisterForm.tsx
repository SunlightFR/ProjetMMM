import React, {useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {ThemedTextInput} from "@/components/atoms/TextInput";
import {TextWithIcon} from "@/components/atoms/TextWithIcon";
import {router} from "expo-router";
import {useUser} from "@/contexts/UserContext";
import {useTranslation} from "react-i18next";
import {UserRole} from "@/api/models/User";
import {ThemedButton2} from "@/components/atoms/ThemedButton";

export const RegisterForm = ()=>{
    const user = useUser()
    const {t} = useTranslation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<UserRole>('manager');

    return <View style={styles.container}>
        <Text style={styles.header}>Login or register</Text>
        <ThemedTextInput
            value={email}
            onChangeText={setEmail}
            label={<TextWithIcon
                text={t("email")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            label={<TextWithIcon
                text={t("password")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            value={firstName}
            onChangeText={setFirstName}
            label={<TextWithIcon
                text={t("first-name")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <ThemedTextInput
            value={lastName}
            onChangeText={setLastName}
            label={<TextWithIcon
                text={t("last-name")}
            ></TextWithIcon>}
        ></ThemedTextInput>
        <View style={styles.buttonContainer}>
            <ThemedButton2
                title="Login"
                onPress={
                    () => {
                        user.register(email, password, firstName, lastName, role).then(()=>{
                            router.navigate('/(tabs)/')
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