import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';

type Variant = 'primary' | 'dark' | 'light';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  // Показує «крутилку» замість тексту й не дає натиснути ще раз
  loading?: boolean;
};

const VARIANTS: Record<Variant, { background: string; text: string }> = {
  primary: { background: colors.primary, text: colors.white },
  dark: { background: colors.text, text: colors.white },
  light: { background: colors.surface, text: colors.text },
};

// Кругла кнопка на всю ширину (наприклад, «Почати»)
export function PrimaryButton({ title, onPress, variant = 'primary', disabled = false, loading = false }: Props) {
  const palette = VARIANTS[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.title, { color: palette.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 18,
  },
});
