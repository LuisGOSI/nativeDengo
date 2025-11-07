import { Text, View } from "@/components/Themed"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { StyleSheet, Pressable, ScrollView } from "react-native"
import ProductCard from "./ProductCard"
import { router } from "expo-router"

interface FeaturedProduct {
    id: number
    title: string
    category: string
    rating: number
    time: string
    price: number
}

interface FeaturedProductsProps {
    products: FeaturedProduct[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]

    const handleSeeAll = () => {
        router.push("/(tabs)/menu")
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View style={{ backgroundColor: "transparent" }}>
                    <Text style={[styles.title, { color: colors.text }]}>Bebidas destacadas</Text>
                    <Text style={[styles.subtitle, { color: colors.text, opacity: 0.6 }]}>
                        Recomendadas por la comunidad
                    </Text>
                </View>
                <Pressable 
                    onPress={handleSeeAll}
                    style={({ pressed }) => [
                        styles.seeAllButton,
                        { 
                            backgroundColor: colors.tint + '15',
                            opacity: pressed ? 0.7 : 1 
                        }
                    ]}
                >
                    <Text style={[styles.seeAll, { color: colors.tint }]}>Ver todo</Text>
                </Pressable>
            </View>

            {products.length > 0 ? (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.productsContainer}
                    style={{ backgroundColor: "transparent" }}
                >
                    {products.map((product) => (
                        <View key={product.id} style={styles.cardWrapper}>
                            <ProductCard
                                id={product.id}
                                title={product.title}
                                category={product.category}
                                rating={product.rating}
                                time={product.time}
                                price={product.price}
                            />
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.text, opacity: 0.6 }]}>
                        No hay productos disponibles
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: "400",
    },
    seeAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    seeAll: {
        fontSize: 13,
        fontWeight: "600",
    },
    productsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    cardWrapper: {
        marginRight: 12,
    },
    emptyContainer: {
        paddingVertical: 40,
        paddingHorizontal: 16,
    },
    emptyText: {
        fontSize: 14,
        textAlign: "center",
    },
})
