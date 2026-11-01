import { Image, type ImageSource } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TAB_BAR_HEIGHT } from '@/components/TabBar';
import { colors, fonts, gentleEasing } from '@/theme';

type Props = {
  // Заголовок розділу вгорі екрана
  screenTitle?: string;
  // Замість заголовка — свій верхній рядок (наприклад, шапка з головної)
  header?: ReactNode;
  image: ImageSource;
  // Ширина ілюстрації, поділена на висоту
  imageAspectRatio: number;
  title: string;
  text: string;
  // Кнопка внизу; можна не показувати
  action?: { title: string; onPress: () => void };
  // Для окремих сторінок (не вкладок): стрілка «назад» біля заголовка й без місця під нижнє меню
  onBack?: () => void;
};

// Поява блоків одне за одним — м'яко, без стрибків
const appear = (index: number) =>
  FadeInDown.delay(80 * index)
    .duration(500)
    .easing(gentleEasing);

// Порожній розділ: ілюстрація, коротке пояснення й кнопка, що підказує, що робити далі
export function EmptyState({ screenTitle, header, image, imageAspectRatio, title, text, action, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const bottomSpace = onBack ? 16 : TAB_BAR_HEIGHT + 20;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 13, paddingBottom: insets.bottom + bottomSpace }]}>
      {header ?? (
        <View style={styles.titleRow}>
          {onBack && (
            <Pressable onPress={onBack} hitSlop={10}>
              <Image source={require('../../assets/images/icon-back-plain.svg')} style={styles.back} />
            </Pressable>
          )}
          <Text style={styles.screenTitle}>{screenTitle}</Text>
        </View>
      )}

      <View style={styles.center}>
        <Animated.View entering={appear(0)} style={styles.imageWrap}>
          <Image source={image} contentFit="contain" style={[styles.image, { aspectRatio: imageAspectRatio }]} />
        </Animated.View>
        <Animated.View entering={appear(1)} style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </Animated.View>
      </View>

      {/* Кнопка внизу (на вкладках — над меню) */}
      {action && (
        <Animated.View entering={appear(2)}>
          <PrimaryButton title={action.title} onPress={action.onPress} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  back: {
    width: 34,
    height: 34,
  },
  screenTitle: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    color: colors.text,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  imageWrap: {
    alignSelf: 'stretch',
  },
  // Ілюстрація на всю ширину, як у Quiz
  image: {
    width: '100%',
  },
  texts: {
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    maxWidth: 300,
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
