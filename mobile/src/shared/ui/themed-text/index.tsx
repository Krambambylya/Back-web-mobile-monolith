import { Text, type TextProps } from 'react-native';

import { Typography } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ThemedText({ style, ...rest }: TextProps) {
  const theme = useTheme();
  return <Text style={[{ color: theme.text, ...Typography.body }, style]} {...rest} />;
}
