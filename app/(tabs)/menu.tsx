import { StyleSheet, FlatList, Image, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from "react";
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/services/AuthContext';
import { router } from "expo-router";

import { CartIcon } from '@/components/CartIcon';
import { useCart } from '@/services/CartContext';

const { width } = Dimensions.get('window');

interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    url_imagen?: string;
    categoria_id: number; // ← Agrega esta propiedad
    activo?: boolean;
    categoria?: {        // ← Opcional: si el backend devuelve la relación completa
        id: number;
        nombre: string;
    };
}

const ProductCard = ({ item, colors, onOrdenar, index }: {
    item: Producto;
    colors: any;
    onOrdenar: (producto: Producto) => void;
    index: number;
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                delay: index * 100,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                delay: index * 100,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.cardWrapper,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => onOrdenar(item)}
            >
                <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: item.url_imagen || "https://th.bing.com/th/id/R.403d54007e81cf13a37ba3219c1b1545?rik=6v1j3oNo0dbstg&pid=ImgRaw&r=0" }}
                            style={styles.imagen}
                            resizeMode="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.3)']}
                            style={styles.imageGradient}
                        />
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.textContainer}>
                            <Text style={[styles.nombre, { color: colors.text }]} numberOfLines={1}>
                                {item.nombre}
                            </Text>
                            <Text style={[styles.descripcion, { color: colors.textSecondary }]} numberOfLines={2}>
                                {item.descripcion || "Delicioso producto preparado con los mejores ingredientes"}
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <View style={styles.precioContainer}>
                                <Text style={styles.precioLabel}>Precio</Text>
                                <Text style={styles.precio}>${item.precio?.toFixed(2)}</Text>
                            </View>
                            <View style={styles.botonContainer}>
                                <LinearGradient
                                    colors={['#00704A', '#005a3c']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.botonGradient}
                                >
                                    <Text style={styles.botonTexto}>Ordenar</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default function TabMenuScreen() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const headerAnim = useRef(new Animated.Value(0)).current;

    const { session } = useAuth();
    const { getItemCount } = useCart();
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`${backendUrl}api/productos`);
                const result = await response.json();
                if (result.success) {
                    setProductos(result.data);
                } else {
                    console.error("Error:", result.error);
                }
            } catch (error) {
                console.error("Error al obtener productos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();

        Animated.spring(headerAnim, {
            toValue: 1,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleOrdenar = (producto: Producto) => {
        if (!session) {
            Alert.alert(
                "Inicia sesión requerida",
                "Debes iniciar sesión para ordenar productos.",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Iniciar sesión",
                        onPress: () => router.push("/(modals)/login"),
                    },
                ]
            );
            return;
        }

        // Navegar al modal de personalización
        router.push({
            pathname: "/(modals)/customize-product",
            params: {
                productId: producto.id,
                productName: producto.nombre,
                productPrice: producto.precio,
                categoryId: producto.categoria_id || 1 // Valor por defecto si no existe
            }
        });
    };

    const handleCartPress = () => {
        router.push("/(modals)/cart");
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: headerAnim,
                            transform: [{
                                translateY: headerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-20, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>Nuestro Menú</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Cargando productos disponibles...
                    </Text>
                </Animated.View>
            </View>
        );
    }

    const renderProducto = ({ item, index }: { item: Producto; index: number }) => (
        <ProductCard
            item={item}
            colors={colors}
            onOrdenar={handleOrdenar}
            index={index}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerAnim,
                        transform: [{
                            translateY: headerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-20, 0]
                            })
                        }]
                    }
                ]}
            >
                <View style={styles.headerTop}>
                    <View style={styles.headerTextContainer}>
                        <Text style={[styles.title, { color: colors.text }]}>Nuestro Menú</Text>
                        <View style={styles.subtitleContainer}>
                            <View style={styles.decorativeLine} />
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                                Explora todo lo que Dengo tiene para ofrecerte
                            </Text>
                            <View style={styles.decorativeLine} />
                        </View>
                    </View>
                    <CartIcon onPress={handleCartPress} />
                </View>
            </Animated.View>

            <FlatList
                data={productos}
                renderItem={renderProducto}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.lista}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        marginTop: 0,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        letterSpacing: 1,
        marginBottom: 12,
    },
    subtitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    decorativeLine: {
        width: 30,
        height: 2,
        backgroundColor: "#00704A",
        borderRadius: 1,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.5,
        opacity: 0.7,
        textAlign: "center",
    },
    lista: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    row: {
        justifyContent: "space-between",
    },
    cardWrapper: {
        width: (width - 48) / 2,
        marginVertical: 10,
    },
    card: {
        borderRadius: 24,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        overflow: "hidden",
    },
    imageContainer: {
        width: "100%",
        height: 160,
        backgroundColor: "#F5F5F5",
        position: "relative",
    },
    imagen: {
        width: "100%",
        height: "100%",
    },
    imageGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 60,
    },
    contentContainer: {
        backgroundColor: "transparent",
    },
    textContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: "transparent",
    },
    nombre: {
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    descripcion: {
        fontSize: 12,
        lineHeight: 17,
        opacity: 0.7,
    },
    footer: {
        flexDirection: "column",
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: "transparent",
        gap: 12,
    },
    precioContainer: {
        backgroundColor: "transparent",
    },
    precioLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#666",
        marginBottom: 2,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    precio: {
        fontSize: 24,
        fontWeight: "800",
        color: "#00704A",
        letterSpacing: 0.5,
    },
    botonContainer: {
        backgroundColor: "transparent",
    },
    botonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#00704A",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    botonTexto: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 15,
        letterSpacing: 1,
        textTransform: "uppercase",
    },
});