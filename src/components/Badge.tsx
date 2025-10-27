import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  return (
    <View style={[styles.badge, styles[`${variant}Badge`], styles[`${size}Badge`], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },

  // Variants
  primaryBadge: {
    backgroundColor: theme.colors.primary,
  },
  successBadge: {
    backgroundColor: theme.colors.success,
  },
  warningBadge: {
    backgroundColor: theme.colors.warning,
  },
  dangerBadge: {
    backgroundColor: theme.colors.danger,
  },
  infoBadge: {
    backgroundColor: theme.colors.info,
  },
  defaultBadge: {
    backgroundColor: theme.colors.lightGray,
  },

  // Sizes
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xs,
  },
  mediumBadge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  largeBadge: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },

  // Text
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  primaryText: {
    color: theme.colors.white,
  },
  successText: {
    color: theme.colors.white,
  },
  warningText: {
    color: theme.colors.white,
  },
  dangerText: {
    color: theme.colors.white,
  },
  infoText: {
    color: theme.colors.white,
  },
  defaultText: {
    color: theme.colors.darkGray,
  },

  // Text sizes
  smallText: {
    fontSize: theme.typography.fontSize.xs,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.sm,
  },
  largeText: {
    fontSize: theme.typography.fontSize.md,
  },
});

export default Badge;
