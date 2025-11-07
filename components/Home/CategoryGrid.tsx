import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { ScrollView, StyleSheet, Pressable } from "react-native"

const CATEGORIES = [
    { id: 1, label: "TODO", icon: "🍽️" },
    { id: 2, label: "CAFE", icon: "☕" },
    { id: 3, label: "POSTRES", icon: "🍰" },
    { id: 4, label: "COMIDA", icon: "🥐" },
]

interface CategoryGridProps {
    selectedCategory: string
    onSelectCategory: (category: string) => void
}

export default function CategoryGrid({ selectedCategory, onSelectCategory }: CategoryGridProps) {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category.label
                    return (
                        <Pressable
                            key={category.id}
                            onPress={() => onSelectCategory(category.label)}
                            style={({ pressed }) => [
                                styles.categoryCard,
                                {
                                    backgroundColor: isSelected ? colors.tint : colors.cardBackground,
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                    shadowColor: isSelected ? colors.tint : "#000",
                                    shadowOpacity: isSelected ? 0.3 : 0.1,
                                    elevation: isSelected ? 8 : 3,
                                },
                            ]}
                        >
                            <Text style={[styles.icon, { transform: [{ scale: isSelected ? 1.1 : 1 }] }]}>
                                {category.icon}
                            </Text>
                            <Text
                                style={[
                                    styles.categoryLabel,
                                    {
                                        color: isSelected ? "#fff" : colors.text,
                                        fontWeight: isSelected ? "700" : "600",
                                    },
                                ]}
                            >
                                {category.label}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        alignItems: "center",
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    categoryCard: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        minWidth: 90,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        marginBottom: 4,
    },
    icon: {
        fontSize: 32,
        marginBottom: 6,
    },
    categoryLabel: {
        fontSize: 11,
        letterSpacing: 0.5,
        textAlign: "center",
        textTransform: "capitalize",
    },
})
