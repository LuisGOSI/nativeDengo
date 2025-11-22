import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StyleSheet, View, Animated, Pressable, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import { IconButton } from 'react-native-paper';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const NotLoggedIn = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const isDark = colorScheme === 'dark';

    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const iconRotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const floatAnim1 = useRef(new Animated.Value(0)).current;
    const floatAnim2 = useRef(new Animated.Value(0)).current;

    const [buttonPressed, setButtonPressed] = useState(false);

    useEffect(() => {
        // Animación de entrada secuencial
        Animated.stagger(150, [
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
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
            ]),
        ]).start();

        // Animación de rotación del ícono
        Animated.loop(
            Animated.sequence([
                Animated.timing(iconRotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(iconRotateAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Animación de pulso sutil
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Animaciones de flotación para elementos decorativos
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim1, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim1, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim2, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim2, {
                    toValue: 0,
                    duration: 5000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const iconRotate = iconRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '15deg'],
    });

    const float1Y = floatAnim1.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });

    const float2Y = floatAnim2.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 15],
    });

    // Paleta de colores premium
    const premiumColors = {
        primary: isDark ? "#60A5FA" : "#3B82F6",
        primaryLight: isDark ? "#93C5FD" : "#60A5FA",
        background: isDark ? "#0F172A" : "#F8FAFC",
        surface: isDark ? "#1E293B" : "#FFFFFF",
        text: isDark ? "#F1F5F9" : "#0F172A",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        accent: isDark ? "#F59E0B" : "#F59E0B",
    };

    const handleLoginPress = () => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                tension: 300,
                friction: 10,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 300,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start(() => {
            router.replace('/login');
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: premiumColors.background }]}>
            {/* Elementos decorativos de fondo */}
            <View style={styles.decorativeContainer}>
                <Animated.View
                    style={[
                        styles.decorativeCircle1,
                        {
                            backgroundColor: premiumColors.primaryLight,
                            opacity: isDark ? 0.05 : 0.08,
                            transform: [
                                { translateY: float1Y },
                                { scale: pulseAnim },
                            ],
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.decorativeCircle2,
                        {
                            backgroundColor: premiumColors.accent,
                            opacity: isDark ? 0.03 : 0.05,
                            transform: [
                                { translateY: float2Y },
                                { scale: pulseAnim },
                            ],
                        },
                    ]}
                />
            </View>

            {/* Contenido principal */}
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
                {/* Ícono principal animado */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: isDark
                                ? 'rgba(96, 165, 250, 0.1)'
                                : 'rgba(59, 130, 246, 0.08)',
                            transform: [{ rotate: iconRotate }],
                        },
                    ]}
                >
                    <IconButton
                        icon="lock-outline"
                        size={64}
                        iconColor={premiumColors.primary}
                    />
                </Animated.View>

                {/* Título principal */}
                <Text style={[styles.title, { color: premiumColors.text }]}>
                    Acceso requerido
                </Text>

                {/* Descripción */}
                <Text style={[styles.description, { color: premiumColors.textSecondary }]}>
                    Inicia sesión para acceder a todas las funciones de la cafetería
                </Text>

                {/* Botón de inicio de sesión */}
                <Pressable
                    onPress={handleLoginPress}
                    onPressIn={() => setButtonPressed(true)}
                    onPressOut={() => setButtonPressed(false)}
                    style={[
                        styles.loginButton,
                        {
                            backgroundColor: premiumColors.primary,
                            transform: [{ scale: buttonPressed ? 0.97 : 1 }],
                        },
                    ]}
                >
                    <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                    <IconButton
                        icon="arrow-right"
                        size={20}
                        iconColor="#FFFFFF"
                        style={{ margin: 0 }}
                    />
                </Pressable>

                {/* Texto adicional */}
                <View style={styles.footerContainer}>
                    <Text style={[styles.footerText, { color: premiumColors.textSecondary }]}>
                        ¿No tienes una cuenta?
                    </Text>
                    <Pressable onPress={() => router.push('/login')}>
                        <Text style={[styles.footerLink, { color: premiumColors.primary }]}>
                            Regístrate aquí
                        </Text>
                    </Pressable>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        width: 350,
        height: 350,
        borderRadius: 175,
        top: -100,
        right: -80,
    },
    decorativeCircle2: {
        position: 'absolute',
        width: 280,
        height: 280,
        borderRadius: 140,
        bottom: -80,
        left: -60,
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 32,
        maxWidth: 400,
        width: '100%',
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        paddingHorizontal: 16,
    },
    loginButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        maxWidth: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 32,
        gap: 6,
    },
    footerText: {
        fontSize: 14,
    },
    footerLink: {
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default NotLoggedIn;