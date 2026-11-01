import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { PrimaryButton } from '@/components/PrimaryButton';
import { deckPets } from '@/data/pets';
import { matchPets, TRAITS, type Trait } from '@/data/traits';
import { colors, fonts, gentleEasing, smoothEasing } from '@/theme';

// «тваринку / тваринки / тваринок» залежно від числа
function petsWord(n: number) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return 'тваринку';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'тваринки';
  return 'тваринок';
}

type Props = {
  // Риса, з якої почали (якщо натиснули плашку на головній)
  initial?: Trait;
  onClose: () => void;
};

// Панель «Підібрати тваринку»: виїжджає знизу, шість зелених плашок-рис і кнопка з кількістю знайдених
export function MatchSheet({ initial, onClose }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Trait[]>(initial ? [initial] : []);
  const found = matchPets(deckPets, selected);
  const shown = useSharedValue(0);

  // Завжди найсвіжіший onClose, щоб анімація кликала актуальний
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const finishClose = () => onCloseRef.current();
  const openResults = () => {
    onCloseRef.current();
    router.push({ pathname: '/match', params: { traits: selected.join(',') } });
  };

  useEffect(() => {
    shown.set(withTiming(1, { duration: 420, easing: smoothEasing }));
  }, [shown]);

  const close = (then: 'close' | 'results' = 'close') => {
    shown.set(
      withTiming(0, { duration: 280, easing: smoothEasing }, (finished) => {
        if (finished) scheduleOnRN(then === 'results' ? openResults : finishClose);
      }),
    );
  };

  const toggle = (key: Trait) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const overlayStyle = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - shown.get()) * height }] }));

  const buttonTitle =
    selected.length === 0
      ? 'Обери, що тобі до душі'
      : found.length === 0
        ? 'Нікого не знайдено'
        : `Знайдено ${found.length} ${petsWord(found.length)}`;

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => close()}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => close()} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }, sheetStyle]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Підібрати тваринку</Text>
            <Pressable onPress={() => close()} hitSlop={12}>
              <Image source={require('../../assets/images/icon-x.svg')} style={styles.icon24} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>Обери, яким буде твій ідеальний хвостик. Можна кілька варіантів.</Text>

          <View style={styles.chips}>
            {TRAITS.map((trait) => (
              <TraitChip
                key={trait.key}
                label={trait.label}
                icon={trait.icon}
                active={selected.includes(trait.key)}
                onPress={() => toggle(trait.key)}
              />
            ))}
          </View>

          <PrimaryButton title={buttonTitle} onPress={() => close('results')} disabled={found.length === 0} />
        </Animated.View>
      </View>
    </Modal>
  );
}

type ChipProps = { label: string; icon: ImageSource; active: boolean; onPress: () => void };

// Зелена плашка, як на головній; обрана — плавно заливається темнішим зеленим
function TraitChip({ label, icon, active, onPress }: ChipProps) {
  const on = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    on.set(withTiming(active ? 1 : 0, { duration: 260, easing: gentleEasing }));
  }, [active, on]);
  const fillStyle = useAnimatedStyle(() => ({ opacity: on.get() }));

  return (
    <Pressable onPress={onPress} style={styles.chip}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.chipFill, fillStyle]} pointerEvents="none" />
      <Image source={icon} tintColor={active ? colors.white : undefined} style={styles.icon24} />
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    marginHorizontal: 5,
    marginBottom: 8,
    paddingTop: 28,
    paddingHorizontal: 16,
    borderRadius: 40,
    backgroundColor: colors.white,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  subtitle: {
    marginTop: -8,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  // Усі плашки однакові: дві рівні колонки, ширина вміщує найдовшу «Готовий до хаосу»
  chip: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.chip,
  },
  chipFill: {
    backgroundColor: colors.optionSelected,
  },
  chipLabel: {
    flexShrink: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.chipText,
  },
  chipLabelActive: {
    color: colors.white,
  },
});
