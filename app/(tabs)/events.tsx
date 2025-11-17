import { View, StyleSheet, Animated } from "react-native"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { EventsList } from "@/components/Events"
import { IconButton, Text } from "react-native-paper"
import { router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useEffect, useRef } from "react"

export default function EventsScreen() {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]
    const insets = useSafeAreaInsets()
    
    // Animaciones
    const fadeAnim = useRef(new Animated.Value(0)).current
    const slideAnim = useRef(new Animated.Value(-20)).current
    const scaleAnim = useRef(new Animated.Value(0.95)).current

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start()
    }, [])

    // Colores adaptables según el tema
    const isDark = colorScheme === "dark"
    const dynamicColors = {
        headerBg: isDark ? "rgba(18, 18, 18, 0.95)" : "rgba(255, 255, 255, 0.98)",
        headerShadow: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.08)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
        gradient1: isDark ? "#1a1a2e" : "#f8f9fa",
        gradient2: isDark ? "#16213e" : "#ffffff",
        accentColor: isDark ? "#4a9eff" : "#2196F3",
        textSecondary: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
    }

    return (
        <View style={[styles.container, { backgroundColor: dynamicColors.gradient2 }]}>
            {/* Header con efecto glassmorphism */}
            <Animated.View 
                style={[
                    styles.header, 
                    { 
                        paddingTop: insets.top,
                        backgroundColor: dynamicColors.headerBg,
                        borderBottomColor: dynamicColors.borderColor,
                        shadowColor: dynamicColors.headerShadow,
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                <View style={styles.headerContent}>
                    {/* Botón de retroceso con animación */}
                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            iconColor={dynamicColors.accentColor}
                            onPress={() => router.back()}
                            style={[
                                styles.backButton,
                                { backgroundColor: isDark ? "rgba(74, 158, 255, 0.15)" : "rgba(33, 150, 243, 0.1)" }
                            ]}
                        />
                    </Animated.View>

                    {/* Título con gradiente sutil */}
                    <View style={styles.titleContainer}>
                        <Text 
                            variant="headlineMedium"
                            style={[styles.headerTitle, { color: colors.text }]}
                        >
                            Eventos
                        </Text>
                        <View style={[styles.titleUnderline, { backgroundColor: dynamicColors.accentColor }]} />
                    </View>

                    {/* Espaciador para centrar el título */}
                    <View style={{ width: 48 }} />
                </View>
            </Animated.View>

            {/* Content con animación */}
            <Animated.View 
                style={[
                    styles.content,
                    { 
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                <EventsList
                    onEventPress={(event) => {
                        console.log("Event pressed:", event)
                    }}
                />
            </Animated.View>

            {/* Decoración sutil de fondo */}
            <View style={[styles.bgDecoration, { opacity: isDark ? 0.03 : 0.02 }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backButton: {
        margin: 0,
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontWeight: "700",
        letterSpacing: 0.5,
        textAlign: "center",
    },
    titleUnderline: {
        width: 40,
        height: 3,
        borderRadius: 2,
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingTop: 12,
        paddingHorizontal: 16,
    },
    bgDecoration: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#2196F3",
        pointerEvents: "none",
    },
})