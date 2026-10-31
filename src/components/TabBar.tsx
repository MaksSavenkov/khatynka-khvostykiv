import { Image, type ImageSource } from 'expo-image';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, gentleEasing, smoothEasing } from '@/theme';

// Профіль у меню не показуємо — туди веде фото профілю на головній
const TABS: Record<string, { title: string; icon: ImageSource }> = {
  home: { title: 'Головна', icon: require('../../assets/images/tab-house.svg') },
  animals: { title: 'Тварини', icon: require('../../assets/images/tab-paw-print.svg') },
  shelters: { title: 'Притулки', icon: require('../../assets/images/tab-house-heart.svg') },
};

// Усі кнопки однакові, тож при перемиканні нічого не зсувається
const ITEM_WIDTH = 86;
const BAR_PADDING = 2;
const ITEM_HEIGHT = 56;
const CIRCLE = ITEM_HEIGHT + BAR_PADDING * 2;
const GAP = 10;
const BAR_WIDTH = ITEM_WIDTH * Object.keys(TABS).length + BAR_PADDING * 2;

const SLIDE = { duration: 380, easing: smoothEasing };
// Повільний старт і м'яке гальмування — рядок пошуку виїжджає без ривка
const MORPH = { duration: 560, easing: gentleEasing };

// Нижнє меню-«пігулка», що висить над контентом, і круглий пошук поруч (як у Headway).
// Натиснув пошук — вкладки складаються в кружечок, а пошук розтягується в рядок.
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.filter((route) => TABS[route.name]);
  const activeIndex = routes.findIndex((route) => route.key === state.routes[state.index]?.key);
  const activeRoute = routes[activeIndex] ?? routes[0];

  // Де зараз підкладка (дробове число під час руху між кнопками)
  const position = useSharedValue(Math.max(activeIndex, 0));
  useEffect(() => {
    if (activeIndex >= 0) position.set(withTiming(activeIndex, SLIDE));
  }, [activeIndex, position]);

  // 0 — звичайне меню, 1 — режим пошуку
  const [searching, setSearching] = useState(false);
  const morph = useSharedValue(0);
  useEffect(() => {
    morph.set(withTiming(searching ? 1 : 0, MORPH));
  }, [searching, morph]);

  // Спершу лише виїжджає рядок; клавіатура з'явиться, коли натиснеш на сам рядок
  const openSearch = () => setSearching(true);
  const closeSearch = () => {
    Keyboard.dismiss();
    setSearching(false);
  };

  // Коли відкривається клавіатура, меню піднімається над нею
  const keyboard = useSharedValue(0);
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', (e) => {
      keyboard.set(
        withTiming(e.endCoordinates.height - insets.bottom + 8, {
          duration: e.duration || 250,
          easing: Easing.out(Easing.cubic),
        }),
      );
    });
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', (e) => {
      keyboard.set(withTiming(0, { duration: e.duration || 250, easing: Easing.out(Easing.cubic) }));
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom, keyboard]);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.get() }],
  }));
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.get() * ITEM_WIDTH }],
    opacity: activeIndex >= 0 ? 1 : 0,
  }));
  const barStyle = useAnimatedStyle(() => ({
    width: interpolate(morph.get(), [0, 1], [BAR_WIDTH, CIRCLE]),
  }));
  // Вкладки зникають на початку руху, кружечок з іконкою з'являється наприкінці
  const tabsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(morph.get(), [0, 0.4], [1, 0], 'clamp'),
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(morph.get(), [0.5, 1], [0, 1], 'clamp'),
    transform: [{ scale: interpolate(morph.get(), [0.5, 1], [0.85, 1], 'clamp') }],
  }));
  const searchStyle = useAnimatedStyle(() => ({
    width: interpolate(morph.get(), [0, 1], [CIRCLE, BAR_WIDTH]),
  }));
  const inputStyle = useAnimatedStyle(() => ({
    opacity: interpolate(morph.get(), [0.5, 1], [0, 1], 'clamp'),
  }));

  return (
    <Animated.View style={[styles.wrapper, { bottom: insets.bottom }, wrapperStyle]} pointerEvents="box-none">
      <View style={styles.row}>
        <Animated.View style={[styles.bar, barStyle]}>
          <Animated.View style={[styles.tabs, tabsStyle]} pointerEvents={searching ? 'none' : 'auto'}>
            <Animated.View style={[styles.pill, pillStyle]} />
            {routes.map((route, index) => {
              const tab = TABS[route.name];
              const active = index === activeIndex;
              return (
                <Pressable key={route.key} onPress={() => navigateToTab(route.key)} style={styles.item}>
                  {/* Обрана вкладка — іконка й підпис теракотові */}
                  <Image source={tab.icon} tintColor={active ? colors.primary : undefined} style={styles.icon} />
                  <Text style={[styles.label, active && styles.labelActive]}>{tab.title}</Text>
                </Pressable>
              );
            })}
          </Animated.View>

          {/* У режимі пошуку меню стає кружечком з іконкою поточної вкладки — він повертає назад */}
          <Animated.View style={[styles.back, backStyle]} pointerEvents={searching ? 'auto' : 'none'}>
            <Pressable onPress={closeSearch} style={styles.circleButton} hitSlop={6}>
              <Image source={TABS[activeRoute.name].icon} tintColor={colors.primary} style={styles.icon} />
            </Pressable>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.search, searchStyle]}>
          <Pressable onPress={openSearch} style={styles.searchInner} disabled={searching}>
            <Image
              source={require('../../assets/images/icon-search.svg')}
              tintColor={colors.text}
              style={styles.icon}
            />
            <Animated.View style={[styles.inputWrap, inputStyle]} pointerEvents={searching ? 'auto' : 'none'}>
              <TextInput
                placeholder="Тваринка, порода чи притулок"
                placeholderTextColor={colors.placeholder}
                selectionColor={colors.primary}
                returnKeyType="search"
                style={styles.input}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// Висота меню разом із відступом — щоб контент не ховався під ним
export const TAB_BAR_HEIGHT = 60;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  bar: {
    height: CIRCLE,
    borderRadius: 40,
    backgroundColor: colors.tabBar,
    overflow: 'hidden',
  },
  tabs: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: BAR_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    padding: BAR_PADDING,
  },
  pill: {
    position: 'absolute',
    left: BAR_PADDING,
    top: BAR_PADDING,
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 40,
    backgroundColor: colors.tabActive,
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 40,
    paddingVertical: 8,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    ...StyleSheet.absoluteFill,
  },
  circleButton: {
    width: CIRCLE,
    height: CIRCLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    height: CIRCLE,
    borderRadius: 40,
    backgroundColor: colors.tabBar,
    overflow: 'hidden',
  },
  // Лупа стоїть так, щоб у кружечку бути рівно по центру
  searchInner: {
    height: CIRCLE,
    width: BAR_WIDTH,
    paddingLeft: (CIRCLE - 28) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrap: {
    flex: 1,
    height: '100%',
    paddingRight: 16,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    width: 28,
    height: 28,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
  },
});
