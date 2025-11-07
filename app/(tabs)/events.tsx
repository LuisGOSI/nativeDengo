import { View, StyleSheet } from "react-native"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { EventsList } from "@/components/Events"
import { IconButton, Text } from "react-native-paper"
import { router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function EventsScreen() {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]
    const insets = useSafeAreaInsets()

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View 
                style={[
                    styles.header, 
                    { 
                        paddingTop: insets.top + 8,
                        borderBottomWidth: 1,
                        borderBottomColor: '#e0e0e0',
                    }
                ]}
            >
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => router.back()}
                />
                <Text 
                    variant="headlineSmall"
                    style={[styles.headerTitle, { color: colors.text }]}
                >
                    Eventos
                </Text>
                <View style={{ width: 48 }} />
            </View>

            {/* Events List */}
            <View style={styles.content}>
                <EventsList
                    onEventPress={(event) => {
                        console.log("Event pressed:", event)
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 4,
        paddingBottom: 8,
    },
    headerTitle: {
        fontWeight: "600",
        flex: 1,
        textAlign: "center",
    },
    content: {
        flex: 1,
        paddingTop: 8,
    },
})