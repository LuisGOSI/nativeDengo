import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput, Alert, ActivityIndicator, Animated, KeyboardAvoidingView, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/services/AuthContext';
import { IconButton } from 'react-native-paper';

export default function ModalLoginScreen() {
  const { session } = useAuth();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const steamAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (session) {
      router.replace('/profile');
    }
  }, [session]);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de rotación suave del logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de vapor/humo
    Animated.loop(
      Animated.sequence([
        Animated.timing(steamAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(steamAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        Alert.alert(
          'Éxito',
          'Cuenta creada. Por favor verifica tu correo electrónico.',
          [
            {
              text: 'OK',
              onPress: () => {
                setEmail('');
                setPassword('');
                setIsSignUp(false);
              }
            }
          ]
        );
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        Alert.alert('Éxito', 'Has iniciado sesión correctamente');

        if (router.canGoBack()) {
          router.back();
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error con Google');
    } finally {
      setLoading(false);
    }
  };

  const isDark = colorScheme === 'dark';
  
  const premiumColors = {
    primary: isDark ? "#D4A574" : "#8B5E34",
    primaryLight: isDark ? "#E5C29F" : "#A67C52",
    background: isDark ? "#0F172A" : "#FFF8F0",
    surface: isDark ? "#1E293B" : "#FFFFFF",
    surfaceVariant: isDark ? "#334155" : "#F5E6D3",
    border: isDark ? "#334155" : "#E5D4C1",
    text: isDark ? "#F1F5F9" : "#2C1810",
    textSecondary: isDark ? "#94A3B8" : "#8B7355",
    accent: isDark ? "#F59E0B" : "#D97706",
  };

  const logoRotate = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  const steamOpacity = steamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0],
  });

  const steamTranslateY = steamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { backgroundColor: premiumColors.background }]}>
          <Stack.Screen
            options={{
              title: '',
              headerStyle: { backgroundColor: premiumColors.background },
              headerShadowVisible: false,
              headerTransparent: true,
            }}
          />

          {/* Elementos decorativos de fondo */}
          <View style={styles.decorativeContainer}>
            <Animated.View
              style={[
                styles.decorativeCircle1,
                {
                  backgroundColor: premiumColors.primaryLight,
                  opacity: isDark ? 0.05 : 0.1,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.decorativeCircle2,
                {
                  backgroundColor: premiumColors.accent,
                  opacity: isDark ? 0.03 : 0.08,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />
          </View>

          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Logo de cafetería con animación */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: premiumColors.surface,
                  transform: [{ rotate: logoRotate }],
                },
              ]}
            >
              <IconButton
                icon="coffee"
                size={56}
                iconColor={premiumColors.primary}
              />
              
              {/* Vapor animado */}
              <Animated.View
                style={[
                  styles.steamContainer,
                  {
                    opacity: steamOpacity,
                    transform: [{ translateY: steamTranslateY }],
                  },
                ]}
              >
                <Text style={[styles.steam, { color: premiumColors.textSecondary }]}>
                  ☁️
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Título */}
            <Text style={[styles.title, { color: premiumColors.text }]}>
              {isSignUp ? 'Únete a nosotros' : 'Bienvenido'}
            </Text>

            <Text style={[styles.subtitle, { color: premiumColors.textSecondary }]}>
              {isSignUp 
                ? 'Crea tu cuenta para disfrutar del mejor café' 
                : 'Disfruta de tu café favorito'}
            </Text>

            {/* Formulario */}
            <View style={[styles.formContainer, { backgroundColor: 'transparent' }]}>
              {/* Input de Email */}
              <View style={[styles.inputContainer, { backgroundColor: premiumColors.surface }]}>
                <IconButton
                  icon="email-outline"
                  size={20}
                  iconColor={premiumColors.textSecondary}
                  style={{ margin: 0 }}
                />
                <TextInput
                  style={[styles.input, { color: premiumColors.text }]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={premiumColors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!loading}
                />
              </View>

              {/* Input de Password */}
              <View style={[styles.inputContainer, { backgroundColor: premiumColors.surface }]}>
                <IconButton
                  icon="lock-outline"
                  size={20}
                  iconColor={premiumColors.textSecondary}
                  style={{ margin: 0 }}
                />
                <TextInput
                  style={[styles.input, { color: premiumColors.text }]}
                  placeholder="Contraseña"
                  placeholderTextColor={premiumColors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!loading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <IconButton
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    iconColor={premiumColors.textSecondary}
                    style={{ margin: 0 }}
                  />
                </Pressable>
              </View>

              {/* Botón principal */}
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: premiumColors.primary },
                  loading && styles.buttonDisabled
                ]}
                onPress={handleAuth}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
                    </Text>
                    <IconButton
                      icon="arrow-right"
                      size={20}
                      iconColor="#FFFFFF"
                      style={{ margin: 0 }}
                    />
                  </>
                )}
              </Pressable>

              {/* Switch entre login y registro */}
              <Pressable
                style={styles.switchButton}
                onPress={() => setIsSignUp(!isSignUp)}
                disabled={loading}
              >
                <Text style={[styles.switchButtonText, { color: premiumColors.textSecondary }]}>
                  {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                  <Text style={{ color: premiumColors.primary, fontWeight: '700' }}>
                    {isSignUp ? 'Inicia sesión' : 'Regístrate'}
                  </Text>
                </Text>
              </Pressable>

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: 'transparent' }]}>
                <View style={[styles.dividerLine, { backgroundColor: premiumColors.border }]} />
                <Text style={[styles.dividerText, { color: premiumColors.textSecondary }]}>
                  O continúa con
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: premiumColors.border }]} />
              </View>

              {/* Botón de Google */}
              <Pressable
                style={[
                  styles.googleButton,
                  { 
                    backgroundColor: premiumColors.surface,
                    borderColor: premiumColors.border,
                  },
                  loading && styles.buttonDisabled
                ]}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <IconButton
                  icon="google"
                  size={20}
                  iconColor={premiumColors.primary}
                  style={{ margin: 0 }}
                />
                <Text style={[styles.googleButtonText, { color: premiumColors.text }]}>
                  Google
                </Text>
              </Pressable>
            </View>

            {/* Footer decorativo */}
            <View style={[styles.footerDecoration, { backgroundColor: 'transparent' }]}>
              <Text style={{ fontSize: 24 }}>☕</Text>
              <View style={[styles.decorativeDot, { backgroundColor: premiumColors.primary }]} />
              <Text style={{ fontSize: 24 }}>🥐</Text>
              <View style={[styles.decorativeDot, { backgroundColor: premiumColors.accent }]} />
              <Text style={{ fontSize: 24 }}>🍰</Text>
            </View>
          </Animated.View>

          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 90,
    paddingBottom: 40,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    right: -80,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: -80,
    left: -60,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 28, // ← Cambiado de 65 a 28
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  steamContainer: {
    position: 'absolute',
    top: -30,
  },
  steam: {
    fontSize: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  switchButton: {
    marginTop: 20,
    padding: 8,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 15,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 13,
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  decorativeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});