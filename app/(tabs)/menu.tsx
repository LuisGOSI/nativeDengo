import { StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Text, View } from '@/components/Themed';

import { useAuth } from '@/services/AuthContext';
import { router } from "expo-router";

interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    url_imagen?: string;
}

export default function TabMenuScreen() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    const { session } = useAuth();
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`${backendUrl}api/productos/activos`);
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
                        onPress: () => router.push("/login"),
                    },
                ]
            );
            return;
        }

        // Si sí hay sesión activa
        Alert.alert("Orden realizada", `Has ordenado: ${producto.nombre}`);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.title, { color: colors.text }]}>Menú</Text>
                <View style={[styles.separator, { backgroundColor: colors.text }]} />
                <Text style={[styles.info, { color: colors.textSecondary }]}>Cargando menú...</Text>
            </View>
        );
    }

    const renderProducto = ({ item }: { item: Producto }) => (
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <Image
                source={{ uri: item.url_imagen || "https://th.bing.com/th/id/R.403d54007e81cf13a37ba3219c1b1545?rik=6v1j3oNo0dbstg&pid=ImgRaw&r=0" }}
                style={styles.imagen}
            />
            <View style={styles.infoContainer}>
                <Text style={[styles.nombre, { color: colors.text }]}>{item.nombre}</Text>
                <Text style={[styles.descripcion, { color: colors.textSecondary }]} numberOfLines={2}>
                    {item.descripcion || "Sin descripción"}
                </Text>
                <Text style={[styles.precio, { color: "#2e7d32" }]}>${item.precio?.toFixed(2)}</Text>
                <TouchableOpacity
                    style={[styles.boton, { backgroundColor: "#00704A" }]}
                    onPress={() => handleOrdenar(item)}
                >
                    <Text style={styles.botonTexto}>Ordenar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Menú</Text>
            <View style={[styles.separator, { backgroundColor: colors.text }]} />
            <Text style={[styles.info, { color: colors.textSecondary }]}>
                Explora nuestro menú y disfruta de las mejores delicias.
            </Text>

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
        alignItems: "center",
        paddingVertical: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 10,
    },
    separator: {
        marginVertical: 10,
        height: 1,
        width: "85%",
    },
    info: {
        fontSize: 16,
        textAlign: "center",
        marginHorizontal: 20,
        marginBottom: 10,
    },
    lista: {
        paddingBottom: 100,
    },
    row: {
        justifyContent: "space-around",
    },
    card: {
        borderRadius: 16,
        marginVertical: 10,
        width: "45%",
        backgroundColor: "#fff", // color fijo para mantener contraste Starbucks
        shadowColor: "#000",
        shadowOpacity: 0.15, // un poco más de profundidad
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
    },
    imagen: {
        width: "100%",
        height: 120,
    },
    infoContainer: {
        padding: 10,
        backgroundColor: "#282321ff",
    },
    nombre: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: "center",
    },
    descripcion: {
        fontSize: 13,
        marginBottom: 6,
        textAlign: "center",
    },
    precio: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 8,
        color: "#2e7d32", // verde Starbucks
        textAlign: "center",
    },
    boton: {
        backgroundColor: "#00704A", // verde Starbucks
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: "center",
    },
    botonTexto: {
        color: "#fff",
        fontWeight: "bold",
    },
});
