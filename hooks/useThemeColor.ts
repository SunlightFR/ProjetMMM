/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import {useEffect, useState} from "react";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type Theme = "dark" | "light"
export function useTheme(){
  const colorScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>('dark')
  // useEffect(() => {
  //   setTheme(colorScheme ?? 'light')
  // }, [colorScheme]);

  return {
    toggleTheme:()=>setTheme(theme=>theme==="dark" ? "light":"dark"),
    colors:Colors[theme]
  }

}
