import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Keyframe, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationPill } from '@/components/LocationPill';
import { LikeablePetCard } from '@/components/LikeablePetCard';
import { hasFilters, matchesFilters, NO_FILTERS, PetFiltersSheet, type PetFilters } from '@/components/PetFiltersSheet';
import { SwipeDeck } from '@/components/SwipeDeck';
import { TAB_BAR_HEIGHT } from '@/components/TabBar';
import { useFavoriteIds } from '@/data/favorites';
import { deckPets, type PetProfile, type Species } from '@/data/pets';
import { colors, fonts, gentleEasing, smoothEasing } from '@/theme';

type Filter = 'all' | 'favorites' | Species | 'other';

const FILTERS: { key: Filter; label: string; icon?: ImageSource }[] = [
  { key: 'all', label: 'Усі' },
  { key: 'cat', label: 'Коти', icon: require('../../../assets/images/chip-cat-active.svg') },
  { key: 'dog', label: 'Собаки', icon: require('../../../assets/images/chip-dog.svg') },
  { key: 'other', label: 'Інші', icon: require('../../../assets/images/chip-other.svg') },
  { key: 'favorites', label: 'Обране', icon: require('../../../assets/images/chip-heart.svg') },
];

type ViewMode = 'cards' | 'list';

// Відступ між категоріями (однаковий для кнопок і білої копії підписів у «пігулці»)
const CHIP_GAP = 8;

// Зміна колоди на список (і фільтра): нове м'яко проявляється й ледь підпливає знизу,
// старе тихо тане й трохи віддаляється. Повільний старт і м'яке гальмування, без стрибків.
const contentEntering = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 14 }, { scale: 0.98 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }], easing: gentleEasing },
}).duration(520);

const contentExiting = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.98 }], easing: gentleEasing },
}).duration(320);

const openPet = (pet: PetProfile) => router.push({ pathname: '/pet/[id]', params: { id: pet.id } });

export default function AnimalsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  // Як показувати тваринок: колодою для свайпів або вертикальним списком
  const [view, setView] = useState<ViewMode>('cards');
  // Висота плаваючого верхнього блоку — щоб контент починався під ним
  const [topHeight, setTopHeight] = useState(insets.top + 117);

  // Панель з фільтрами (стать, вік, здоров'я), що виїжджає знизу
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [petFilters, setPetFilters] = useState<PetFilters>(NO_FILTERS);

  const favoriteIds = useFavoriteIds();
  const pets = useMemo(() => {
    const byCategory =
      filter === 'all'
        ? deckPets
        : filter === 'favorites'
          ? deckPets.filter((pet) => favoriteIds.has(pet.id))
          : deckPets.filter((pet) => pet.species === filter);
    return byCategory.filter((pet) => matchesFilters(pet, petFilters));
  }, [filter, favoriteIds, petFilters]);

  return (
    <View style={styles.screen}>
      {/* key скидає колоду/список на початок при зміні фільтра чи вигляду; старе й нове плавно перетікають на місці */}
      <View style={styles.content}>
        <Animated.View
          key={`${view}-${filter}-${JSON.stringify(petFilters)}`}
          style={StyleSheet.absoluteFill}
          entering={contentEntering}
          exiting={contentExiting}
        >
          {pets.length === 0 ? (
            <Text style={[styles.empty, { marginTop: topHeight + 40 }]}>
              {hasFilters(petFilters)
                ? 'Немає тваринок за цими фільтрами.\nСпробуй змінити або скинути фільтри.'
                : filter === 'favorites'
                  ? 'Тут з’являться тваринки, яких ти вподобаєш.\nНатисни сердечко, свайпни вправо або двічі тапни картку.'
                  : 'Поки що тут немає тваринок'}
            </Text>
          ) : view === 'cards' ? (
            <View style={{ marginTop: topHeight + 26 }}>
              <SwipeDeck pets={pets} onOpen={openPet} />
            </View>
          ) : (
            // Список прокручується під верхнім блоком, як сторінка на головній
            <FlatList
              data={pets}
              keyExtractor={(pet) => pet.id}
              renderItem={({ item }) => <LikeablePetCard pet={item} onOpen={() => openPet(item)} />}
              contentContainerStyle={[
                styles.list,
                { paddingTop: topHeight + 16, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
              ]}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.View>
      </View>

      {/* Верхній блок висить над контентом. Рядок стоїть там само, як на головній: 13 px від безпечної зони */}
      <View
        style={[styles.top, { paddingTop: insets.top + 13 }]}
        onLayout={(e) => setTopHeight(e.nativeEvent.layout.height)}
        pointerEvents="box-none"
      >
        <View style={styles.topRow}>
          {/* Пошук тепер у нижньому меню, тож тут лишилась тільки кнопка фільтрів */}
          <Pressable
            onPress={() => setFiltersOpen(true)}
            style={({ pressed }) => [styles.icon48, styles.toggle, pressed && { opacity: 0.7 }]}
            hitSlop={6}
          >
            <Image source={require('../../../assets/images/icon-filter-animals.svg')} style={styles.icon48} />
            {/* Теракотова крапка — якщо якісь фільтри увімкнені */}
            {hasFilters(petFilters) && <View style={styles.filterDot} />}
          </Pressable>
          <LocationPill />
          <ViewToggle view={view} onPress={() => setView(view === 'cards' ? 'list' : 'cards')} />
        </View>

        <Filters value={filter} onChange={setFilter} />
      </View>

      {filtersOpen && (
        <PetFiltersSheet
          value={petFilters}
          onChange={setPetFilters}
          resultCount={pets.length}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </View>
  );
}

const SLIDE = { duration: 380, easing: smoothEasing };

// Кнопка в правому куті: показує, на який вигляд перемкнемо.
// Значки м'яко провертаються, і один перетікає в інший (біле коло лишається на місці).
function ViewToggle({ view, onPress }: { view: ViewMode; onPress: () => void }) {
  const progress = useSharedValue(view === 'list' ? 1 : 0);

  useEffect(() => {
    progress.set(withTiming(view === 'list' ? 1 : 0, { duration: 450, easing: smoothEasing }));
  }, [view, progress]);

  const cardsIconStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: interpolate(p, [0, 0.6], [1, 0], 'clamp'),
      transform: [{ rotate: `${-90 * p}deg` }, { scale: 1 - 0.3 * p }],
    };
  });
  const listIconStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      opacity: interpolate(p, [0.4, 1], [0, 1], 'clamp'),
      transform: [{ rotate: `${90 * (1 - p)}deg` }, { scale: 0.7 + 0.3 * p }],
    };
  });

  return (
    <Pressable onPress={onPress} hitSlop={6} style={[styles.icon48, styles.toggle]}>
      <Animated.View style={[StyleSheet.absoluteFill, cardsIconStyle]}>
        <Image source={require('../../../assets/images/icon-cards-fan.svg')} style={styles.icon48} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, listIconStyle]}>
        <Image source={require('../../../assets/images/icon-rows.svg')} style={styles.icon48} />
      </Animated.View>
    </Pressable>
  );
}

type FiltersProps = {
  value: Filter;
  onChange: (filter: Filter) => void;
};

// Категорії: помаранчева «пігулка» плавно перепливає під обрану кнопку.
// Усередині пігулки лежить біла копія підписів, тож текст «перефарбовується» рівно там,
// де зараз пігулка — як у системних перемикачах iOS.
function Filters({ value, onChange }: FiltersProps) {
  // Де стоїть кожна кнопка (вимірюємо після першого показу)
  const [layouts, setLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const left = useSharedValue(0);
  const width = useSharedValue(0);
  const measured = useRef(false);

  const active = layouts[value];
  useEffect(() => {
    if (!active) return;
    if (!measured.current) {
      // Перший раз просто ставимо на місце, без руху
      measured.current = true;
      left.set(active.x);
      width.set(active.width);
    } else {
      left.set(withTiming(active.x, SLIDE));
      width.set(withTiming(active.width, SLIDE));
    }
  }, [active, left, width]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: width.get() > 0 ? 1 : 0,
    width: width.get(),
    transform: [{ translateX: left.get() }],
  }));
  // Біла копія рухається у зворотний бік, тож стоїть на місці відносно екрана
  const whiteRowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: -left.get() }] }));

  // Категорій більше, ніж влазить в екран, тож рядок гортається вбік
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filtersScroll}
      contentContainerStyle={styles.filtersContent}
    >
      {/* Окремий ряд без відступів, щоб «пігулка» і кнопки міряли положення від одного краю */}
      <View style={styles.filters}>
        {FILTERS.map(({ key, label, icon }) => (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            onLayout={(e) => {
              const { x, width: w } = e.nativeEvent.layout;
              setLayouts((prev) => ({ ...prev, [key]: { x, width: w } }));
            }}
            style={[styles.filter, styles.filterInactive]}
          >
            <ChipContent label={label} icon={icon} color={colors.text} />
          </Pressable>
        ))}

        <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none">
          <Animated.View style={[styles.filtersRow, whiteRowStyle]}>
            {FILTERS.map(({ key, label, icon }) => (
              <View key={key} style={styles.filter}>
                <ChipContent label={label} icon={icon} color={colors.white} />
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

function ChipContent({ label, icon, color }: { label: string; icon?: ImageSource; color: string }) {
  return (
    <>
      {icon && <Image source={icon} style={styles.icon24} tintColor={color} />}
      <Text style={[styles.filterLabel, { color }]}>{label}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.white,
    backgroundColor: colors.primary,
  },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtersScroll: {
    marginTop: 20,
    flexGrow: 0,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filters: {
    flexDirection: 'row',
    gap: CHIP_GAP,
  },
  filtersRow: {
    position: 'absolute',
    left: 0,
    top: 0,
    flexDirection: 'row',
    gap: CHIP_GAP,
  },
  pill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 36,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  filter: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  filterInactive: {
    backgroundColor: colors.white,
  },
  filterLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  // Старий і новий вигляд на мить накладаються один на одного, тому обидва лежать в одній рамці
  content: {
    flex: 1,
  },
  list: {
    alignItems: 'center',
    gap: 16,
  },
  empty: {
    marginHorizontal: 32,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  icon48: {
    width: 48,
    height: 48,
  },
  // Біле коло під кнопками у верхньому рядку (фільтри зліва, вигляд справа)
  toggle: {
    borderRadius: 24,
    backgroundColor: colors.white,
  },
});
