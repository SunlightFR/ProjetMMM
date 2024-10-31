import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import {useTheme} from '@/hooks/useThemeColor';
import { ReactNode } from 'react';

export type ThemedTextProps = {
  style?:StyleProp<TextStyle>,
  children:ReactNode
}

export function ThemedText({style, children}: ThemedTextProps) {
  const {colors} = useTheme()

  return (
    <Text
      style={[
          styles.text,
          {
            color:colors.text,
            backgroundColor:colors.background
          },
          style
      ]}
    >{children}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
  }
});
