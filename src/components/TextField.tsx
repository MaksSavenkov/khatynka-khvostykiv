import { Image } from 'expo-image';
import { useEffect, useState, type ReactNode, type Ref } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, fonts, gentleEasing } from '@/theme';

type Props = Omit<TextInputProps, 'style'> & {
  ref?: Ref<TextInputInstance>;
  label: string;
  // Щось перед полем, наприклад «+380»
  prefix?: ReactNode;
  // Поле для пароля: з кнопкою «показати / сховати»
  password?: boolean;
};

// Поле вводу в стилі додатку: біла «пігулка», рамка плавно підсвічується, коли поле активне
export function TextField({ ref, label, prefix, password = false, onFocus, onBlur, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const active = useSharedValue(0);

  useEffect(() => {
    active.set(withTiming(focused ? 1 : 0, { duration: 260, easing: gentleEasing }));
  }, [focused, active]);

  const boxStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(active.get(), [0, 1], ['rgba(187, 82, 48, 0)', colors.primary]),
  }));

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.box, boxStyle]}>
        {prefix}
        <TextInput
          {...input}
          ref={ref}
          secureTextEntry={password && hidden}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {password && (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Image
              source={
                hidden ? require('../../assets/images/icon-eye.svg') : require('../../assets/images/icon-eye-off.svg')
              }
              style={styles.icon}
            />
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  box: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
