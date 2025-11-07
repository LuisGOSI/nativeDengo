import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { Image, StyleSheet, Pressable } from "react-native"
import { IconButton } from "react-native-paper"

interface ProductCardProps {
    id: number
    title: string
    category: string
    rating: number
    time: string
    price: number
    isFavorite?: boolean
    onFavoritePress?: () => void
}

export default function ProductCard({
    id,
    title,
    category,
    rating,
    time,
    price,
    isFavorite = false,
    onFavoritePress,
}: ProductCardProps) {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    return (
        <Pressable style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: "/cafe-drink.jpg" }} style={styles.image} />
                <IconButton
                    icon={isFavorite ? "heart" : "heart-outline"}
                    iconColor={isFavorite ? "#ff4757" : colors.text}
                    size={24}
                    onPress={onFavoritePress}
                    style={styles.favoriteButton}
                />
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.category, { color: colors.text, opacity: 0.6 }]}>{category}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.star}>⭐</Text>
                        <Text style={[styles.rating, { color: colors.text }]}>{rating}</Text>
                    </View>
                    <Text style={[styles.time, { color: colors.text, opacity: 0.6 }]}>⏱️ {time} mins.</Text>
                </View>

                <Text style={[styles.price, { color: colors.tint }]}>${price}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: "hidden",
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    imageContainer: {
        position: "relative",
        marginBottom: 12,
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    favoriteButton: {
        position: "absolute",
        top: -8,
        right: -8,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },
    category: {
        fontSize: 13,
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    star: {
        fontSize: 14,
    },
    rating: {
        fontSize: 13,
        fontWeight: "600",
    },
    time: {
        fontSize: 12,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
    },
})
