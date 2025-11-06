"use client"

import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { useAuth } from "@/services/AuthContext"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Platform, Dimensions } from "react-native"
import { Avatar, Button, Card, Divider, Provider } from "react-native-paper"
import NotLoggedIn from "@/components/NotLoggedIn"
import ProfileEditDropdown from "@/components/Profiles/ProfileEditDropdown"

export default function TabProfileScreen() {
    const { session, user, loading: authLoading, signOut } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    const { width } = Dimensions.get("window")
    const AVATAR_SIZE = Math.min(120, Math.max(80, Math.floor(width * 0.22)))

    //? Cargar datos al montar el componente
    useEffect(() => {
        if (session) {
            setLoading(false)
        }
    }, [session])

    //? Función para manejar el cierre de sesión
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
                        router.replace("/(tabs)")
                    } catch (error) {
                        Alert.alert("Error", "No se pudo cerrar la sesión")
                    }
                },
            },
        ])
    }

    //? Renderizado si no hay sesión activa
    if (!session || !user) {
        return <NotLoggedIn />
    }

    //? Renderizado condicional mientras se cargan los datos
    if (loading || authLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        )
    }

    //? Obtener iniciales para el avatar
    const initials = user?.email?.substring(0, 2).toUpperCase() || "??"

    return (
        <Provider>
            <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    {/* Header con Avatar */}
                    <View style={styles.headerSection}>
                        <Avatar.Text
                            size={AVATAR_SIZE}
                            label={initials}
                            style={[styles.avatar, { backgroundColor: colors.tint }]}
                            color={colorScheme === "dark" ? colors.text : "#000"}
                        />
                        <Text style={[styles.emailText, { color: colors.text }]}>{user?.email}</Text>
                        <Text style={[styles.memberSince, { color: colors.text, opacity: 0.7 }]}>
                            Miembro desde{" "}
                            {new Date(user?.created_at || "").toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                            })}
                        </Text>
                    </View>

                    <Divider style={[styles.divider, { backgroundColor: colors.tabIconDefault }]} />

                    <ProfileEditDropdown session={session} />

                    {/* Sección de Cuenta */}
                    <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                        <Card.Content>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Cuenta</Text>

                            <Button
                                onPress={handleLogOut}
                                disabled={saving}
                                style={[styles.logoutButton, { backgroundColor: "#d32f2f" }]}
                                icon="logout"
                                textColor="#fcfcfcff"
                            >
                                Cerrar sesión
                            </Button>
                        </Card.Content>
                    </Card>
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
        padding: 16,
        maxWidth: 900,
        alignSelf: "stretch",
        alignItems: "stretch",
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
        opacity: 0.8,
    },
    headerSection: {
        alignItems: "center",
        paddingVertical: 28,
    },
    avatar: {
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    emailText: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    memberSince: {
        fontSize: 13,
    },
    divider: {
        marginVertical: 12,
        height: 1,
    },
    card: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    logoutButton: {
        marginTop: 8,
        borderRadius: 10,
        height: 48,
        justifyContent: "center",
    },
})
