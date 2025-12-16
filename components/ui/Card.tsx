import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return Spacing.sm;
      case 'lg':
        return Spacing.lg;
      default:
        return Spacing.md;
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 4,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {};
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: BorderRadius.lg,
    padding: getPadding(),
    ...getVariantStyles(),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({});

