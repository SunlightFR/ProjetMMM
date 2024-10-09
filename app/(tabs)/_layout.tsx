import {Redirect, Stack, Tabs} from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {useUser} from "@/contexts/UserContext";
import {Text} from "react-native";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const {login, register, current, loading} = useUser()

    if(loading){
        return <Text>Loading...</Text>
    }

    if(!current){
        return <Redirect href={"/sign-in"}></Redirect>
    }

    if(current.role === "manager"){
        return <Redirect href={"/(manager)"}></Redirect>
    }

    if(current.role === "supervisor"){
        return <Redirect href={"/(supervisor)"}></Redirect>
    }

    return <Stack></Stack>

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
