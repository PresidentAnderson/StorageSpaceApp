import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface DividerProps {
  spacing?: keyof typeof theme.spacing;
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  spacing = 'md',
  color = theme.colors.border,
  thickness = 1,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          marginVertical: theme.spacing[spacing],
          backgroundColor: color,
          height: thickness,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
