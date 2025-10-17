import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabRewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recompensas</Text>
      <View style={styles.separator} lightColor="#000000ff" darkColor="#fff" />
      <Text>Explora y canjea tus recompensas aquí.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
