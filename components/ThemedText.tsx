import { Text, type TextProps, StyleSheet } from 'react-native';

import {useTheme, useThemeColor} from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps;

export function ThemedText(props: ThemedTextProps) {
  const {colors} = useTheme()

  return (
    <Text
      style={[
          styles.text,
          {
            color:colors.text,
            backgroundColor:colors.background
          },
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
  }
});
