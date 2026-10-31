import { Image } from 'expo-image';
import { useEffect, useRef, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { PrimaryButton } from '@/components/PrimaryButton';
import type { PetProfile } from '@/data/pets';
import { colors, fonts, smoothEasing } from '@/theme';

export type PetFilters = {
  sex: 'any' | 'female' | 'male';
  age: 'any' | 'baby' | 'young' | 'adult';
  sterilized: boolean;
  chipped: boolean;
};

export const NO_FILTERS: PetFilters = { sex: 'any', age: 'any', sterilized: false, chipped: false };

export const hasFilters = (f: PetFilters) => f.sex !== 'any' || f.age !== 'any' || f.sterilized || f.chipped;

// Чи підходить тваринка під обрані фільтри
export function matchesFilters(pet: PetProfile, f: PetFilters) {
  if (f.sex !== 'any' && pet.sex !== f.sex) return false;
  const years = parseFloat(pet.age);
  if (f.age === 'baby' && !(years < 1)) return false;
  if (f.age === 'young' && !(years >= 1 && years <= 2)) return false;
  if (f.age === 'adult' && !(years > 2)) return false;
  const health = (pet.health ?? []).join(' ');
  if (f.sterilized && !/Стериліз|Кастр/.test(health)) return false;
  if (f.chipped && !/Чипов/.test(health)) return false;
  return true;
}

// «тваринку / тваринки / тваринок» залежно від числа
function petsWord(n: number) {
  const last = n % 10;
  const lastTwo = n % 100;
  if (last === 1 && lastTwo !== 11) return 'тваринку';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'тваринки';
  return 'тваринок';
}

type Props = {
  value: PetFilters;
  onChange: (value: PetFilters) => void;
  // Скільки тваринок підходить під поточний вибір — показуємо на кнопці
  resultCount: number;
  onClose: () => void;
};

// Панель з фільтрами для каталогу: виїжджає знизу, як «Обери місто». Вибір застосовується одразу.
// Показуємо її, лише поки вона відкрита; закриваючись, вона спершу ховається вниз, а тоді кличе onClose.
export function PetFiltersSheet({ value, onChange, resultCount, onClose }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // 0 — панель схована внизу, 1 — повністю відкрита
  const shown = useSharedValue(0);

  // Завжди найсвіжіший onClose, щоб анімація кликала актуальний
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const finishClose = () => onCloseRef.current();

  useEffect(() => {
    shown.set(withTiming(1, { duration: 420, easing: smoothEasing }));
  }, [shown]);

  const close = () => {
    shown.set(
      withTiming(0, { duration: 280, easing: smoothEasing }, (finished) => {
        if (finished) scheduleOnRN(finishClose);
      }),
    );
  };

  const overlayStyle = useAnimatedStyle(() => ({ opacity: shown.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - shown.get()) * height }],
  }));

  const set = (patch: Partial<PetFilters>) => onChange({ ...value, ...patch });

  return (
    <Modal visible transparent animationType="none" onRequestClose={close}>
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }, sheetStyle]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Фільтри</Text>
            {/* «Скинути» біля хрестика, щоб кнопка внизу мала всю ширину під свій напис */}
            <View style={styles.headerActions}>
              <Pressable onPress={() => onChange(NO_FILTERS)} hitSlop={8} disabled={!hasFilters(value)}>
                <Text style={[styles.reset, !hasFilters(value) && styles.resetDisabled]}>Скинути</Text>
              </Pressable>
              <Pressable onPress={close} hitSlop={12}>
                <Image source={require('../../assets/images/icon-x.svg')} style={styles.icon24} />
              </Pressable>
            </View>
          </View>

          <Section title="Стать">
            <Option label="Будь-яка" active={value.sex === 'any'} onPress={() => set({ sex: 'any' })} />
            <Option label="Дівчинка" active={value.sex === 'female'} onPress={() => set({ sex: 'female' })} />
            <Option label="Хлопчик" active={value.sex === 'male'} onPress={() => set({ sex: 'male' })} />
          </Section>

          <Section title="Вік">
            <Option label="Будь-який" active={value.age === 'any'} onPress={() => set({ age: 'any' })} />
            <Option label="До 1 року" active={value.age === 'baby'} onPress={() => set({ age: 'baby' })} />
            <Option label="1–2 роки" active={value.age === 'young'} onPress={() => set({ age: 'young' })} />
            <Option label="Від 3 років" active={value.age === 'adult'} onPress={() => set({ age: 'adult' })} />
          </Section>

          <Section title="Здоров'я">
            <Option
              label="Стерилізовані"
              active={value.sterilized}
              onPress={() => set({ sterilized: !value.sterilized })}
            />
            <Option label="Чиповані" active={value.chipped} onPress={() => set({ chipped: !value.chipped })} />
          </Section>

          <View style={styles.footer}>
            <PrimaryButton title={`Показати ${resultCount} ${petsWord(resultCount)}`} onPress={close} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.options}>{children}</View>
    </View>
  );
}

function Option({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.option, active && styles.optionActive]}>
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
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
    gap: 20,
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
  icon24: {
    width: 24,
    height: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  optionActive: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.white,
  },
  footer: {
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  reset: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.primary,
  },
  resetDisabled: {
    color: colors.placeholder,
  },
});
