import { Image, type ImageSource } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInputInstance,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FaceIdSheet } from '@/components/FaceIdSheet';
import { GoogleIcon } from '@/components/GoogleIcon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { colors, fonts, gentleEasing } from '@/theme';

type Method = 'phone' | 'email' | 'apple' | 'google' | 'facebook';
type Social = 'apple' | 'google' | 'facebook';

const SOCIAL: Record<Social, { name: string; account: string; icon: ReactNode }> = {
  apple: {
    name: 'Apple',
    account: 'Apple ID',
    icon: <Image source={require('../../../assets/images/icon-apple.svg')} style={{ width: 40, height: 40 }} />,
  },
  google: { name: 'Google', account: 'акаунта Google', icon: <GoogleIcon size={40} /> },
  facebook: {
    name: 'Facebook',
    account: 'акаунта Facebook',
    icon: <Image source={require('../../../assets/images/icon-facebook.svg')} style={{ width: 40, height: 40 }} />,
  },
};

// Поява блоків одне за одним — м'яко, без стрибків
const appear = (index: number) =>
  FadeInDown.delay(80 * index)
    .duration(500)
    .easing(gentleEasing);

// Тимчасово: справжнього входу ще немає — після короткої «перевірки» відкриваємо головну
function useFakeSignIn() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const signIn = () => {
    setLoading(true);
    timer.current = setTimeout(() => {
      // Закриваємо знайомство й вхід, щоб «назад» не повертав сюди
      router.dismissAll();
      router.replace('/home');
    }, 900);
  };
  return { loading, signIn };
}

// Сторінка входу: за номером, з Email або через Apple / Google / Facebook
export default function AuthScreen() {
  const { method } = useLocalSearchParams<{ method: Method }>();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Image source={require('../../../assets/images/icon-back.svg')} style={styles.icon34} />
        </Pressable>

        {method === 'phone' || method === 'email' ? (
          <CredentialsForm method={method} />
        ) : (
          <SocialConsent provider={method in SOCIAL ? (method as Social) : 'apple'} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ——— Вхід за номером або з Email ———

function CredentialsForm({ method }: { method: 'phone' | 'email' }) {
  const { loading, signIn } = useFakeSignIn();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInputInstance>(null);

  const isPhone = method === 'phone';
  const loginValid = isPhone ? login.replace(/\D/g, '').length === 9 : /^\S+@\S+\.\S{2,}$/.test(login.trim());
  const canSubmit = loginValid && password.length >= 6;

  return (
    <>
      <Animated.View entering={appear(0)} style={styles.header}>
        <View style={styles.logoCircle}>
          <Image source={require('../../../assets/images/logo-small.png')} style={styles.logo} contentFit="cover" />
        </View>
        <Text style={styles.title}>{isPhone ? 'Вхід за номером' : 'Вхід з Email'}</Text>
        <Text style={styles.subtitle}>
          {isPhone ? 'Введи номер телефону та пароль, щоб продовжити.' : 'Введи свою пошту та пароль, щоб продовжити.'}
        </Text>
      </Animated.View>

      <Animated.View entering={appear(1)} style={styles.fields}>
        {isPhone ? (
          <TextField
            label="Номер телефону"
            value={login}
            onChangeText={(text) => setLogin(formatPhone(text))}
            placeholder="67 123 45 67"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            prefix={
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>🇺🇦 +380</Text>
                <View style={styles.prefixDivider} />
              </View>
            }
          />
        ) : (
          <TextField
            label="Email"
            value={login}
            onChangeText={setLogin}
            placeholder="name@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
        <TextField
          ref={passwordRef}
          label="Пароль"
          value={password}
          onChangeText={setPassword}
          placeholder="Щонайменше 6 символів"
          password
          textContentType="password"
          autoComplete="password"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={() => canSubmit && signIn()}
        />
        <Pressable hitSlop={8} style={styles.forgot}>
          <Text style={styles.link}>Забули пароль?</Text>
        </Pressable>
      </Animated.View>

      <View style={styles.spacer} />

      <Animated.View entering={appear(2)} style={styles.footer}>
        <PrimaryButton title="Увійти" onPress={signIn} disabled={!canSubmit} loading={loading} />
        <Text style={styles.note}>
          Ще немає акаунта? <Text style={styles.link}>Зареєструватися</Text>
        </Text>
      </Animated.View>
    </>
  );
}

// Номер у вигляді «67 123 45 67» (без коду країни — він уже стоїть перед полем)
function formatPhone(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 9);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return parts.filter(Boolean).join(' ');
}

// ——— Вхід через Apple / Google / Facebook ———

function SocialConsent({ provider }: { provider: Social }) {
  const { loading, signIn } = useFakeSignIn();
  const social = SOCIAL[provider];
  // Для Apple спершу з'являється вікно з Face ID, як у системному «Увійти з Apple»
  const [faceIdOpen, setFaceIdOpen] = useState(false);
  const onContinue = provider === 'apple' ? () => setFaceIdOpen(true) : signIn;

  return (
    <>
      <Animated.View entering={appear(0)} style={[styles.header, styles.headerCentered]}>
        <View style={styles.socialCircle}>{social.icon}</View>
        <Text style={[styles.title, styles.centered]}>Увійти з {social.name}</Text>
        <Text style={[styles.subtitle, styles.centered]}>
          Хатинка хвостиків отримає кілька даних з {social.account}. Твій пароль ми не бачимо.
        </Text>
      </Animated.View>

      <Animated.View entering={appear(1)} style={styles.card}>
        <Text style={styles.cardTitle}>Ми отримаємо</Text>
        <Permission text="Ім'я та прізвище" />
        <Permission text="Адресу електронної пошти" />
        <Permission text="Фото профілю" />
      </Animated.View>

      <View style={styles.spacer} />

      <Animated.View entering={appear(2)} style={styles.footer}>
        <PrimaryButton title={`Продовжити з ${social.name}`} onPress={onContinue} loading={loading} />
        <PrimaryButton title="Скасувати" variant="light" onPress={() => router.back()} />
      </Animated.View>

      {faceIdOpen && (
        <FaceIdSheet
          onSuccess={() => {
            setFaceIdOpen(false);
            signIn();
          }}
          onCancel={() => setFaceIdOpen(false)}
        />
      )}
    </>
  );
}

function Permission({ text }: { text: string }) {
  return (
    <View style={styles.permission}>
      <Image source={require('../../../assets/images/icon-check.svg') as ImageSource} style={styles.icon24} />
      <Text style={styles.permissionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  back: {
    alignSelf: 'flex-start',
  },
  header: {
    marginTop: 24,
    gap: 8,
  },
  headerCentered: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 40,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  logo: {
    position: 'absolute',
    left: 1,
    top: 0,
    width: 47,
    height: 47,
  },
  socialCircle: {
    width: 96,
    height: 96,
    marginBottom: 12,
    borderRadius: 48,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  centered: {
    textAlign: 'center',
  },
  fields: {
    marginTop: 32,
    gap: 16,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prefixText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  prefixDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.surface,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  link: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  spacer: {
    flex: 1,
    minHeight: 32,
  },
  footer: {
    gap: 12,
  },
  note: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginTop: 32,
    padding: 16,
    gap: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  cardTitle: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.text,
  },
  permission: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  permissionText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.healthText,
  },
  icon24: {
    width: 24,
    height: 24,
  },
  icon34: {
    width: 34,
    height: 34,
  },
});
