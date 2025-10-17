import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';


import { Text, View } from '@/components/Themed';
import { Stack } from 'expo-router';

export default function ModalScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Inicio de sesion',
          headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
          headerTitleStyle: { fontWeight: 'bold', color: Colors[colorScheme ?? 'light'].text, fontSize: 20},
          headerShadowVisible: false,
        }}
      />
      <Text style={styles.title}>Aqui estara el login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
