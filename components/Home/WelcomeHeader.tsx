"use client"

import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { StyleSheet } from "react-native"

export default function WelcomeHeader() {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.titleContainer}>
                <View>
                    <Text style={[styles.greeting, { color: colors.text }]}>Bienvenido a</Text>
                    <Text style={[styles.cafeteriaName, { color: colors.text }]}>Dengo - Cafetería</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    greeting: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 4,
    },
    cafeteriaName: {
        fontSize: 24,
        fontWeight: "bold",
    },
    avatar: {
        backgroundColor: "#333",
    },
})
