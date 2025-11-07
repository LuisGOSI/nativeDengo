import { View, StyleSheet, Pressable, Platform, Alert } from "react-native"
import { Card, Text, Button } from "react-native-paper"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"

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

interface EventCardProps {
    event: Event
    onPress?: () => void
}

export default function EventCard({ event, onPress }: EventCardProps) {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    const startDate = new Date(event.inicia_en)
    const endDate = new Date(event.termina_en)

    const formatDateTime = (date: Date) => {
        return date.toLocaleDateString("es-MX", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getDurationInHours = () => {
        const diff = endDate.getTime() - startDate.getTime()
        return Math.floor(diff / (1000 * 60 * 60))
    }

    const handleConfirmAttendance = () => {
        Alert.alert(
            "Confirmar asistencia",
            `¿Estás seguro de que quieres confirmar tu asistencia a "${event.titulo}"?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    onPress: () => {
                        // TODO: Implementar lógica de confirmación de asistencia
                        console.log("Asistencia confirmada para el evento:", event.id)
                        Alert.alert("¡Éxito!", "Tu asistencia ha sido confirmada.")
                    }
                }
            ]
        )
    }

    return (
        <Pressable onPress={onPress}>
            <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                <Card.Content>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                        {event.titulo}
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={[styles.icon]}>📍</Text>
                        <Text style={[styles.sucursal, { color: colors.text, opacity: 0.8 }]} numberOfLines={1}>
                            {event.sucursales.nombre}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.icon]}>📅</Text>
                        <Text style={[styles.fecha, { color: colors.text, opacity: 0.7 }]} numberOfLines={1}>
                            {formatDateTime(startDate)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={[styles.icon]}>⏱️</Text>
                        <Text style={[styles.duration, { color: colors.text, opacity: 0.7 }]}>
                            {getDurationInHours()}h de duración
                        </Text>
                    </View>

                    <Text style={[styles.descripcion, { color: colors.text, opacity: 0.75 }]} numberOfLines={2}>
                        {event.descripcion}
                    </Text>

                    <View style={styles.footer}>
                        <View style={styles.capacityRow}>
                            <Text style={[styles.capacityBadge, { backgroundColor: colors.secondaryButton }]}>
                                Capacidad: {event.capacidad}
                            </Text>
                        </View>
                        
                        <Button
                            mode="contained"
                            onPress={handleConfirmAttendance}
                            style={[styles.confirmButton, { backgroundColor: "#00704A" }]}
                            labelStyle={styles.confirmButtonLabel}
                        >
                            Confirmar asistencia
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        fontSize: 18,
        marginRight: 8,
        width: 20,
    },
    sucursal: {
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
    },
    fecha: {
        fontSize: 13,
        flex: 1,
    },
    duration: {
        fontSize: 13,
    },
    descripcion: {
        fontSize: 13,
        lineHeight: 18,
        marginVertical: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    capacityRow: {
        flex: 1,
    },
    capacityBadge: {
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        color: "#fff",
        overflow: "hidden",
        alignSelf: 'flex-start',
    },
    confirmButton: {
        marginLeft: 12,
        borderRadius: 8,
    },
    confirmButtonLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
})