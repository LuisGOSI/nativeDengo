"use client"

import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { useAuth } from "@/services/AuthContext"
import { router } from "expo-router"
import { useEffect, useState, useRef } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Dimensions, Animated, TouchableOpacity } from "react-native"
import { Avatar, Provider } from "react-native-paper"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import NotLoggedIn from "@/components/NotLoggedIn"
import ProfileEditDropdown from "@/components/Profiles/ProfileEditDropdown"

const { width } = Dimensions.get("window")

// Componente animado para las opciones del menú
const MenuOption = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    colors,
    index,
    danger = false
}: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    onPress: () => void; 
    colors: any;
    index: number;
    danger?: boolean;
}) => {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                delay: index * 80,
                tension: 40,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                delay: index * 80,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View 
            style={{
                opacity: fadeAnim,
                transform: [
                    { translateX: slideAnim },
                    { scale: scaleAnim }
                ]
            }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <View style={[styles.menuOption, { backgroundColor: colors.cardBackground }]}>
                    <View style={[
                        styles.iconContainer, 
                        { backgroundColor: danger ? '#FEE2E2' : colors.tint + '15' }
                    ]}>
                        <Ionicons 
                            name={icon as any} 
                            size={24} 
                            color={danger ? '#DC2626' : colors.tint} 
                        />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={[styles.menuTitle, { color: danger ? '#DC2626' : colors.text }]}>
                            {title}
                        </Text>
                        {subtitle && (
                            <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
                                {subtitle}
                            </Text>
                        )}
                    </View>
                    <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color={colors.textSecondary} 
                    />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

// Componente de estadística animada
const StatCard = ({ 
    icon, 
    value, 
    label, 
    color,
    index 
}: { 
    icon: string; 
    value: string; 
    label: string; 
    color: string;
    index: number;
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 100,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                delay: index * 100,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <Animated.View 
            style={[
                styles.statCard,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <LinearGradient
                colors={[color + '20', color + '10']}
                style={styles.statGradient}
            >
                <View style={[styles.statIconContainer, { backgroundColor: color + '30' }]}>
                    <Ionicons name={icon as any} size={22} color={color} />
                </View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </LinearGradient>
        </Animated.View>
    );
};

export default function TabProfileScreen() {
    const { session, user, loading: authLoading, signOut } = useAuth()
    const [loading, setLoading] = useState(true)
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]
    
    const headerAnim = useRef(new Animated.Value(0)).current;
    const avatarAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (session) {
            setLoading(false)
            Animated.parallel([
                Animated.spring(headerAnim, {
                    toValue: 1,
                    tension: 40,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.spring(avatarAnim, {
                    toValue: 1,
                    delay: 200,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [session])

    async function handleLogOut() {
        Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres cerrar sesión?", [
            {
                text: "Cancelar",
                style: "cancel",
            },
            {
                text: "Cerrar sesión",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut()
                        router.replace("/")
                    } catch (error) {
                        Alert.alert("Error", "No se pudo cerrar la sesión")
                    }
                },
            },
        ])
    }

    if (!session || !user) {
        return <NotLoggedIn />
    }

    if (loading || authLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Cargando perfil...</Text>
            </View>
        )
    }

    const initials = user?.email?.substring(0, 2).toUpperCase() || "??"
    const memberDate = new Date(user?.created_at || "").toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
    })

    return (
        <Provider>
            <ScrollView 
                style={[styles.scrollView, { backgroundColor: colors.background }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header con gradiente */}
                    <Animated.View 
                        style={{
                            opacity: headerAnim,
                            transform: [{
                                translateY: headerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-30, 0]
                                })
                            }]
                        }}
                    >
                        <LinearGradient
                            colors={colorScheme === 'dark' 
                                ? ['#1F2937', '#111827'] 
                                : ['#F9FAFB', '#FFFFFF']
                            }
                            style={styles.headerGradient}
                        >
                            <Animated.View 
                                style={{
                                    transform: [{ scale: avatarAnim }]
                                }}
                            >
                                    <LinearGradient
                                        colors={['#7C3AED', '#5B21B6']}
                                        style={styles.avatarGradient}
                                    >
                                        <Avatar.Text
                                            size={100}
                                            label={initials}
                                            style={styles.avatar}
                                            color="#FFFFFF"
                                            labelStyle={styles.avatarLabel}
                                        />
                                    </LinearGradient>
                            </Animated.View>
                            
                            <Text style={[styles.emailText, { color: colors.text }]}>
                                {user?.email}
                            </Text>
                            <View style={styles.memberBadge}>
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text style={styles.memberText}>Miembro desde {memberDate}</Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Estadísticas */}
                    <View style={styles.statsContainer}>
                        <StatCard 
                            icon="gift" 
                            value="250" 
                            label="Puntos" 
                            color="#F59E0B"
                            index={0}
                        />
                        <StatCard 
                            icon="cart" 
                            value="12" 
                            label="Órdenes" 
                            color="#7C3AED"
                            index={1}
                        />
                        <StatCard 
                            icon="heart" 
                            value="8" 
                            label="Favoritos" 
                            color="#EC4899"
                            index={2}
                        />
                    </View>

                    {/* Editar perfil */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Configuración
                        </Text>
                        <ProfileEditDropdown session={session} />
                    </View>

                    {/* Opciones del menú */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Mi Cuenta
                        </Text>
                        
                        <View style={styles.menuContainer}>
                            <MenuOption
                                icon="person-outline"
                                title="Información personal"
                                subtitle="Edita tu perfil y preferencias"
                                onPress={() => {}}
                                colors={colors}
                                index={0}
                            />
                            <MenuOption
                                icon="receipt-outline"
                                title="Historial de órdenes"
                                subtitle="Revisa tus compras anteriores"
                                onPress={() => {}}
                                colors={colors}
                                index={1}
                            />
                            <MenuOption
                                icon="card-outline"
                                title="Métodos de pago"
                                subtitle="Gestiona tus tarjetas"
                                onPress={() => {}}
                                colors={colors}
                                index={2}
                            />
                            <MenuOption
                                icon="location-outline"
                                title="Direcciones"
                                subtitle="Gestiona tus ubicaciones"
                                onPress={() => {}}
                                colors={colors}
                                index={3}
                            />
                            <MenuOption
                                icon="notifications-outline"
                                title="Notificaciones"
                                subtitle="Preferencias de notificaciones"
                                onPress={() => {}}
                                colors={colors}
                                index={4}
                            />
                        </View>
                    </View>

                    {/* Soporte */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Soporte
                        </Text>
                        
                        <View style={styles.menuContainer}>
                            <MenuOption
                                icon="help-circle-outline"
                                title="Centro de ayuda"
                                subtitle="Preguntas frecuentes"
                                onPress={() => {}}
                                colors={colors}
                                index={0}
                            />
                            <MenuOption
                                icon="chatbubble-outline"
                                title="Contáctanos"
                                subtitle="Envía tus comentarios"
                                onPress={() => {}}
                                colors={colors}
                                index={1}
                            />
                            <MenuOption
                                icon="information-circle-outline"
                                title="Acerca de"
                                subtitle="Versión 1.0.0"
                                onPress={() => {}}
                                colors={colors}
                                index={2}
                            />
                        </View>
                    </View>

                    {/* Botón de cerrar sesión */}
                    <View style={styles.section}>
                        <MenuOption
                            icon="log-out-outline"
                            title="Cerrar sesión"
                            onPress={handleLogOut}
                            colors={colors}
                            index={0}
                            danger={true}
                        />
                    </View>

                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>
        </Provider>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
        fontWeight: '500',
    },
    headerGradient: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginHorizontal: -20,
        marginBottom: 24,
    },
    avatarWrapper: {
        marginBottom: 20,
    },
    avatarGradient: {
        borderRadius: 60,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    avatar: {
        backgroundColor: 'transparent',
    },
    avatarLabel: {
        fontSize: 36,
        fontWeight: '800',
    },
    emailText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    memberBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    memberText: {
        fontSize: 13,
        color: '#059669',
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    statGradient: {
        padding: 16,
        alignItems: 'center',
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    menuContainer: {
        gap: 12,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    menuTextContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
        letterSpacing: 0.2,
    },
    menuSubtitle: {
        fontSize: 13,
        opacity: 0.7,
    },
    bottomSpacer: {
        height: 40,
    },
});