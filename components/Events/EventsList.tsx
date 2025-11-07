import { useEffect, useState } from "react"
import { View, StyleSheet, ActivityIndicator, Alert, FlatList, Dimensions, RefreshControl, SafeAreaView } from "react-native"
import { Text } from "react-native-paper"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import EventCard from "./EventCard"

interface Event {
    id: number
    titulo: string
    descripcion: string
    inicia_en: string
    termina_en: string
    capacidad: number
    activo: boolean
    sucursales: {
        id: number
        nombre: string
        direccion: string
    }
}

interface EventsListProps {
    onEventPress?: (event: Event) => void
}

export default function EventsList({ onEventPress }: EventsListProps) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]
    const { width } = Dimensions.get("window")

    const apiURL = process.env.EXPO_PUBLIC_BACKEND_URL;

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const response = await fetch(apiURL+`api/eventos`)

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const data = await response.json()

            if (data.success && Array.isArray(data.data)) {
                const activeEvents = data.data
                    .filter((event: Event) => event.activo)
                    .sort((a: Event, b: Event) => new Date(a.inicia_en).getTime() - new Date(b.inicia_en).getTime())

                setEvents(activeEvents)
            }
        } catch (error) {
            console.error("Error fetching events:", error)
            Alert.alert("Error", "No se pudieron cargar los eventos")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchEvents()
    }

    if (loading && !refreshing) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={[styles.loadingText, { color: colors.text }]}>Cargando eventos...</Text>
            </View>
        )
    }

    if (events.length === 0) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
                <View style={styles.emptyContent}>
                    <Text style={styles.emptyIcon}>🎉</Text>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>No hay eventos disponibles</Text>
                    <Text style={[styles.emptyText, { color: colors.text }]}>
                        Por el momento no hay eventos programados.{"\n"}Vuelve pronto para descubrir nuevas experiencias
                    </Text>
                </View>
            </View>
        )
    }

    const numColumns = width > 768 ? 2 : 1
    const maxWidth = width > 1200 ? 1200 : width

    return (
        <FlatList
            data={events}
            renderItem={({ item }) => <EventCard event={item} onPress={() => onEventPress?.(item)} />}
            keyExtractor={(item) => item.id.toString()}
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={[
                styles.listContent,
                { 
                    paddingHorizontal: Math.max(16, (width - maxWidth) / 2),
                    paddingBottom: 24 
                }
            ]}
            numColumns={numColumns}
            key={numColumns}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.tint]}
                    tintColor={colors.tint}
                />
            }
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingTop: 16,
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
        fontWeight: "500",
        opacity: 0.7,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyContent: {
        maxWidth: 320,
        alignItems: "center",
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
    },
    emptyText: {
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
        opacity: 0.6,
    },
})
