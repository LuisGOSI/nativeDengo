import { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        
        // Secuencia de animaciones minimalistas
        Animated.sequence([
          // 1. Fade in del logo
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 10,
              useNativeDriver: true,
            }),
          ]),
          // 2. Pequeña pausa
          Animated.delay(200),
          // 3. Línea decorativa
          Animated.timing(lineAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          // 4. Texto aparece
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          // 5. Pausa para visualización
          Animated.delay(1200),
          // 6. Fade out suave
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(textFadeAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          onFinish();
        });
        
        setIsReady(true);
      } catch (e) {
        console.warn('Error en splash:', e);
        onFinish();
      }
    }

    prepare();
  }, []);

  const lineWidth = lineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  // Colores adaptativos según el tema
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const lineColor = isDark ? '#4A9EFF' : '#0066CC';
  const textColor = isDark ? '#EBEBF5' : '#6C6C70';

  if (!isReady) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity: fadeAnim }]}>
      <View style={styles.content}>
        {/* Logo con animación sutil - Invierte según tema */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/Dengo_logo_png.png')}
            style={[
              styles.logo,
              isDark && { tintColor: '#FFFFFF' } // Logo blanco en tema oscuro
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Línea decorativa minimalista - Color según tema */}
        <View style={styles.lineWrapper}>
          <Animated.View
            style={[
              styles.decorativeLine,
              {
                width: lineWidth,
                opacity: lineAnim,
                backgroundColor: lineColor,
              },
            ]}
          />
        </View>

        {/* Texto minimalista - Color según tema */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFadeAnim,
              transform: [
                {
                  translateY: textFadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.tagline, { color: textColor }]}>
            CAFETERÍA
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 280,
    height: 160,
  },
  lineWrapper: {
    height: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  decorativeLine: {
    height: 2,
  },
  textContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});