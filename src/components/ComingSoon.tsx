import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

// Тимчасовий екран для розділів, які ще не зроблені
export function ComingSoon({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Цей розділ зробимо на наступних етапах</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 20,
    color: colors.text,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
