import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '@/config/initSupabase';
import { AppState } from 'react-native';
import { useAuth } from '@/services/AuthContext';

export default function ModalLoginScreen() {
  const { session } = useAuth();
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (session) {
      // Si ya hay sesión, redirigir a pantalla de perfil.
      router.replace('/profile');
    }
  }, [session]);

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

        // Cerrar modal y navegar
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

      // El OAuth redirigirá automáticamente
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error con Google');
    } finally {
      setLoading(false);
    }
  };

  const inputBg = colorScheme === 'light' ? '#f5f5f5' : '#2a2a2a';
  const inputText = Colors[colorScheme ?? 'light'].text;
  const buttonBg = Colors[colorScheme ?? 'light'].tint;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: isSignUp ? 'Crear cuenta' : 'Inicio de sesión',
          headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 20
          },
          headerShadowVisible: false,
        }}
      />

      <Text style={styles.title}>
        {isSignUp ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
      </Text>

      <View style={styles.formContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: inputText }]}
          placeholder="Correo electrónico"
          placeholderTextColor={colorScheme === 'light' ? '#999' : '#666'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!loading}
        />

        <TextInput
          style={[styles.input, { backgroundColor: inputBg, color: inputText }]}
          placeholder="Contraseña"
          placeholderTextColor={colorScheme === 'light' ? '#999' : '#666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          editable={!loading}
        />

        <Pressable
          style={[
            styles.button,
            { backgroundColor: buttonBg },
            loading && styles.buttonDisabled
          ]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.switchButton}
          onPress={() => setIsSignUp(!isSignUp)}
          disabled={loading}
        >
          <Text style={[styles.switchButtonText, { color: buttonBg }]}>
            {isSignUp
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: inputBg }]} />
          <Text style={styles.dividerText}>O continúa con</Text>
          <View style={[styles.dividerLine, { backgroundColor: inputBg }]} />
        </View>

        <Pressable
          style={[
            styles.googleButton,
            { backgroundColor: inputBg },
            loading && styles.buttonDisabled
          ]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Text style={[styles.googleButtonText, { color: inputText }]}>
            Google
          </Text>
        </Pressable>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarText: {
    fontSize: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 16,
    padding: 8,
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#999',
  },
  googleButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});