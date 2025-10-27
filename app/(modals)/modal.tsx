import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';
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
          headerTitleStyle: { fontWeight: 'bold', color: Colors[colorScheme ?? 'light'].text, fontSize: 20 },
          headerShadowVisible: false,
        }}
      />

      <Text style={styles.title}>Aqui estara el login</Text>

      {/* Placeholder / Skeleton para el login */}
      <LoginPlaceholder colorScheme={colorScheme ?? 'light'} />

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

function LoginPlaceholder({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const skeletonBg = colorScheme === 'light' ? '#e6e6e6' : '#ffffffff';
  const skeletonHighlight = colorScheme === 'light' ? '#f2f2f2' : '#393939';
  const skeletonText = colorScheme === 'light' ? '#cccccc' : '#080808ff';

  return (
    <View style={styles.skeletonContainer}>
      <View style={[styles.skeletonAvatar, { backgroundColor: skeletonBg }]} />
      <TextInput style={[styles.skeletonInput, { backgroundColor: skeletonBg }]} placeholder='Nombre' placeholderTextColor={skeletonText}/>
      <TextInput style={[styles.skeletonInput, { backgroundColor: skeletonBg }]}  placeholder='Correo'  placeholderTextColor={skeletonText}/>
      <TextInput style={[styles.skeletonInput, { backgroundColor: skeletonBg }]} placeholder='Contraseña'  placeholderTextColor={skeletonText}/>
      <Pressable style={[styles.skeletonButton, { backgroundColor: skeletonHighlight }]}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  // Skeleton styles
  skeletonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 24,
  },
  skeletonInput: {
    width: '90%',
    height: 44,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  skeletonButton: {
    width: '60%',
    height: 44,
    borderRadius: 8,
    marginTop: 16,
  },
});
