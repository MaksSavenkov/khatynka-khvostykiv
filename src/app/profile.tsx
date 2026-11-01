import { Image, type ImageSource } from 'expo-image';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCity } from '@/data/city';
import { useFavoriteIds } from '@/data/favorites';
import { colors, fonts, gentleEasing } from '@/theme';

// Поява блоків одне за одним — м'яко, без стрибків
const appear = (index: number) =>
  FadeInDown.delay(70 * index)
    .duration(450)
    .easing(gentleEasing);

type Item = {
  icon: ImageSource;
  title: string;
  // Підказка праворуч, наприклад кількість
  hint?: string;
  onPress: () => void;
  danger?: boolean;
};

const go = (href: Href) => () => router.push(href);

// Сторінка профілю: відкривається з фото профілю на головній, закривається стрілкою або свайпом від краю
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const city = useCity();
  const favorites = useFavoriteIds();

  const mine: Item[] = [
    { icon: require('../../assets/images/pi-coins.svg'), title: 'Мої донати', hint: '0 ₴', onPress: go('/donations') },
    { icon: require('../../assets/images/pi-chat.svg'), title: 'Мої чати', onPress: go('/chats') },
    {
      icon: require('../../assets/images/pi-bell.svg'),
      title: 'Мої сповіщення',
      hint: '0',
      onPress: go('/notifications'),
    },
    {
      icon: require('../../assets/images/pi-heart.svg'),
      title: 'Обране',
      hint: String(favorites.size),
      onPress: go('/favorites'),
    },
    { icon: require('../../assets/images/pi-file.svg'), title: 'Мої заявки', hint: '0', onPress: () => {} },
  ];

  const settings: Item[] = [
    { icon: require('../../assets/images/pi-pin.svg'), title: 'Місто', hint: city, onPress: go('/city') },
    { icon: require('../../assets/images/pi-settings.svg'), title: 'Налаштування', onPress: () => {} },
    { icon: require('../../assets/images/pi-help.svg'), title: 'Допомога', onPress: () => {} },
  ];

  const logOut = () => {
    router.dismissAll();
    router.replace('/onboarding');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 13, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.titleRow}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Image source={require('../../assets/images/icon-back-plain.svg')} style={styles.back} />
        </Pressable>
        <Text style={styles.screenTitle}>Профіль</Text>
      </View>

      {/* Картка користувача */}
      <Animated.View entering={appear(0)} style={styles.userCard}>
        <View style={styles.avatar}>
          <Image
            source={require('../../assets/images/avatar.png')}
            contentFit="fill"
            style={{ position: 'absolute', left: '-25%', top: '-0.74%', width: '147.98%', height: '184.07%' }}
          />
        </View>
        <View style={styles.userTexts}>
          <Text style={styles.userName}>Макс Савенков</Text>
          <Text style={styles.userCity}>м. {city}</Text>
        </View>
        <Pressable hitSlop={8} style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
          <Image source={require('../../assets/images/pi-edit.svg')} style={styles.icon20} />
        </Pressable>
      </Animated.View>

      {/* Коротка статистика */}
      <Animated.View entering={appear(1)} style={styles.stats}>
        <Stat value={String(favorites.size)} label="в обраному" />
        <View style={styles.statDivider} />
        <Stat value="0" label="заявок" />
        <View style={styles.statDivider} />
        <Stat value="0 ₴" label="донатів" />
      </Animated.View>

      <Animated.View entering={appear(2)}>
        <Section title="Моє" items={mine} />
      </Animated.View>
      <Animated.View entering={appear(3)}>
        <Section title="Налаштування" items={settings} />
      </Animated.View>
      <Animated.View entering={appear(4)}>
        <Section
          items={[
            { icon: require('../../assets/images/pi-logout.svg'), title: 'Вийти', onPress: logOut, danger: true },
          ]}
        />
      </Animated.View>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, items }: { title?: string; items: Item[] }) {
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.card}>
        {items.map((item, i) => (
          <Pressable
            key={item.title}
            onPress={item.onPress}
            style={({ pressed }) => [styles.row, i > 0 && styles.rowBorder, pressed && styles.rowPressed]}
          >
            <View style={[styles.rowIcon, item.danger && styles.rowIconDanger]}>
              <Image source={item.icon} tintColor={item.danger ? colors.primary : undefined} style={styles.icon20} />
            </View>
            <Text style={[styles.rowTitle, item.danger && styles.rowTitleDanger]}>{item.title}</Text>
            {item.hint !== undefined && <Text style={styles.rowHint}>{item.hint}</Text>}
            {!item.danger && <Image source={require('../../assets/images/pi-chevron.svg')} style={styles.chevron} />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: colors.placeholder,
  },
  userTexts: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  userCity: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.surface,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginLeft: 4,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    borderRadius: 20,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.surface,
  },
  rowPressed: {
    backgroundColor: colors.background,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: {
    backgroundColor: colors.tabActive,
  },
  icon20: {
    width: 20,
    height: 20,
  },
  rowTitle: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  rowTitleDanger: {
    color: colors.primary,
  },
  rowHint: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chevron: {
    width: 18,
    height: 18,
    opacity: 0.5,
  },
});
