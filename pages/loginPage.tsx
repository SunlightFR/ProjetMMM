import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useUser } from '@/contexts/UserContext';
import {router} from "expo-router";
import {APIService} from "@/api/appwriteApi";


export default function LoginScreen() {
    const user = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login or register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Login"
                    onPress={
                        () => {
                            user.login(email, password).then(()=>{
                                router.navigate('/(tabs)/')
                            })
                        }
                    }
                />
                <Button
                    title="Register"
                    onPress={
                        () => {
                            user.register(email, password,"Lucas","T","manager").then(()=>{
                                router.navigate('/(tabs)/')
                            })
                        }
                    }
                />
                <Button title={"test"} onPress={_=>{
                    APIService.getUserById("6706f458000f60da4f94").then(d=>console.log(d))
                }}></Button>
            </View>
        </View>
    );
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
