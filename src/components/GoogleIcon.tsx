import MaskedViewBase from '@react-native-masked-view/masked-view';
import { Image, type ImageSource } from 'expo-image';
import type { ComponentType, ReactElement } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

// Типи бібліотеки застаріли для React 19, тому уточнюємо їх тут
const MaskedView = MaskedViewBase as unknown as ComponentType<ViewProps & { maskElement: ReactElement }>;

// Кольоровий шар Google, обрізаний за формою літери «G» (як у Figma)
const googleColors: ImageSource = require('../../assets/images/icon-google.svg');
const googleMask: ImageSource = require('../../assets/images/icon-google-mask.svg');

// Різнокольорова літера «G»; size — бажаний розмір (у Figma 24)
export function GoogleIcon({ size = 24 }: { size?: number }) {
  const k = size / 24;
  const box = { width: size, height: size };
  return (
    <View style={box}>
      <MaskedView style={box} maskElement={<Image source={googleMask} style={box} />}>
        <Image
          source={googleColors}
          style={[styles.colors, { left: -0.96 * k, top: -2.45 * k, width: 25.65 * k, height: 27.07 * k }]}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  colors: {
    position: 'absolute',
  },
});
