import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/services/AuthContext';
import AnimatedSplash from '@/components/AnimatedSplash';

//import notificaciones
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Manejo de notificaciones global
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// -----------------FUNCION DE REGISTRO DE NOTIFICACIONES PUSH Locales-----------------
async function registerForPushNotificationsAsync() {
  // Solo configuramos permisos, sin pedir push token (causa error en Expo Go)
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permisos de notificación no otorgados.');
    return;
  }

  // Configuración solo local para Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  console.log('Notificaciones locales listas');
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [showSplash, setShowSplash] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Preparar la app
  useEffect(() => {
    async function prepare() {
      try {
        // Registrar notificaciones
        await registerForPushNotificationsAsync();
        
        // Simular carga de recursos adicionales si es necesario
        // await loadAsyncResources();
        
        // Marcar app como lista
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Ocultar splash nativo cuando las fuentes estén cargadas
  useEffect(() => {
    if (loaded && appIsReady) {
      // El splash animado manejará el hideAsync
    }
  }, [loaded, appIsReady]);

  // Mostrar splash animado mientras carga
  if (!loaded || !appIsReady || showSplash) {
    return (
      <AnimatedSplash 
        onFinish={() => {
          setShowSplash(false);
        }} 
      />
    );
  }

  return <RootLayoutNav />;
}

// AQUI NO TOQUEN
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)/login" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}