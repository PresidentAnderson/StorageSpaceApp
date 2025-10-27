import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  style,
}) => {
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizes = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 96,
  };

  const fontSize = {
    small: theme.typography.fontSize.sm,
    medium: theme.typography.fontSize.md,
    large: theme.typography.fontSize.xl,
    xlarge: theme.typography.fontSize.xxxl,
  };

  const avatarSize = sizes[size];

  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.avatar,
          { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        styles.placeholder,
        { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: fontSize[size] }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default Avatar;
