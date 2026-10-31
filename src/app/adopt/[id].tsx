import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { QuizOption } from '@/components/QuizOption';
import { adoptionQuiz } from '@/data/adoptionQuiz';
import { colors, fonts, gentleEasing } from '@/theme';

// Анкета на усиновлення: 4 питання, по одному на екрані
export default function AdoptionQuizScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  // Напрямок руху: 1 — вперед, -1 — назад (від нього залежить, звідки виїжджає питання)
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);

  const question = adoptionQuiz[step];
  const total = adoptionQuiz.length;
  const isLast = step === total - 1;
  const selected = answers[step];

  // Смужка прогресу плавно доростає до наступного кроку
  const progress = useSharedValue((step + 1) / total);
  useEffect(() => {
    progress.set(withTiming((step + 1) / total, { duration: 650, easing: gentleEasing }));
  }, [step, total, progress]);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  const choose = (option: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = option;
      return next;
    });
  };

  const goBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setDirection(-1);
    setStep(step - 1);
  };

  const goNext = () => {
    if (isLast) {
      // Заміна, а не перехід — щоб «назад» з екрана успіху не повертав в анкету
      router.replace('/adopt/success');
      return;
    }
    setDirection(1);
    setStep(step + 1);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 11, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={goBack} hitSlop={12}>
            <Image
              source={require('../../../assets/images/icon-arrow-quiz.svg')}
              style={[styles.icon24, { transform: [{ scaleX: -1 }] }]}
            />
          </Pressable>
          <Text style={styles.counter}>
            {step + 1} з {total}
          </Text>
        </View>
        <View style={styles.track}>
          <Animated.View style={[styles.progress, progressStyle]} />
        </View>
      </View>

      <Animated.View
        key={step}
        style={styles.body}
        entering={(direction > 0 ? FadeInRight : FadeInLeft).duration(500).easing(gentleEasing)}
        exiting={(direction > 0 ? FadeOutLeft : FadeOutRight).duration(300).easing(gentleEasing)}
      >
        <View style={styles.illustrationFrame}>
          <Image
            source={question.illustration}
            contentFit="cover"
            style={[styles.illustration, question.illustrationStyle]}
          />
        </View>

        <View style={styles.question}>
          <Text style={styles.title}>{question.title}</Text>
          <View style={styles.options}>
            {question.options.map((option, i) => (
              <QuizOption key={option} label={option} selected={selected === i} onPress={() => choose(i)} />
            ))}
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <PrimaryButton
          title={isLast ? 'Подати заявку' : 'Продовжити'}
          onPress={goNext}
          disabled={selected === undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginHorizontal: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  track: {
    height: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.progressTrack,
  },
  progress: {
    height: 8,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  body: {
    flex: 1,
    marginTop: 24,
    marginHorizontal: 16,
    gap: 24,
  },
  illustrationFrame: {
    height: 234,
    overflow: 'hidden',
  },
  illustration: {
    position: 'absolute',
    width: 358,
    height: 239,
  },
  question: {
    gap: 20,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    textAlign: 'center',
  },
  options: {
    gap: 8,
  },
  footer: {
    marginHorizontal: 16,
  },
  icon24: {
    width: 24,
    height: 24,
  },
});
