"use client"

import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { useState } from "react"
import { StyleSheet } from "react-native"
import { Button, Card } from "react-native-paper"
import ProfileEditForm from "./ProfileEditForm"

interface ProfileEditDropdownProps {
    session: any
}

export default function ProfileEditDropdown({ session }: ProfileEditDropdownProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    const handleSaveSuccess = () => {
        // Opcional: puedes cerrar el dropdown después de guardar
        // setIsExpanded(false);
    }

    return (
        <Card style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Card.Content>
                <Button
                    onPress={() => setIsExpanded(!isExpanded)}
                    mode="outlined"
                    icon={isExpanded ? "chevron-up" : "chevron-down"}
                    style={styles.dropdownButton}
                    theme={{
                        colors: {
                            primary: colors.text,
                        },
                    }}
                >
                    <Text style={[styles.dropdownTitle, { color: colors.text }]}>Editar Información del Perfil</Text>
                </Button>

                {isExpanded && (
                    <View style={styles.formContainer}>
                        <ProfileEditForm session={session} onSaveSuccess={handleSaveSuccess} />
                    </View>
                )}
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: "hidden",
    },
    dropdownButton: {
        marginBottom: 0,
        justifyContent: "space-between",
        borderRadius: 8,
    },
    dropdownTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    formContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
})
