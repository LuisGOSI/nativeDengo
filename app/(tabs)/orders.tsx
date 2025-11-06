import NotLoggedIn from "@/components/NotLoggedIn";
import OrderCard from "@/components/Orders/OrderCard";
import OrderDetailModal from "@/components/Orders/OrderDetailModal";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from "@/services/AuthContext";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator } from "react-native-paper";
interface Order {
    id: number
    usuario_id: string
    sucursal_id: number
    numero_pedido: string
    metodo_entrega: string
    estado: "recibido" | "preparando" | "listo" | "entregado" | "cancelado"
    notas: string
    datos_personalizados: string
    subtotal: number
    descuentos: number
    impuestos: number
    total: number
    creado_en: string
    actualizado_en: string | null
    sucursales: {
        id: number
        nombre: string
        direccion: string
    }
    items_pedido: {
        id: number
        cantidad: number
        pedido_id: number
        receta_id: number | null
        nombre_item: string
        producto_id: number
        precio_unitario: number
        personalizacion_item: string | null
    }[]
    pagos: any[] // Puedes tiparlo mejor si defines su estructura luego
}


interface ApiResponse {
    pedidos: Order[]
    paginacion: {
        pagina: number
        por_pagina: number
        total: number
    }
}


export default function TabOrdersScreen() {
    const { session, user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];


    //? Efecto para obtener los pedidos del usuario 
    useEffect(() => {
        if (user) {
            fetchOrders(user.id);
        }
    }, [user]);

    //? Función para obtener los pedidos del usuario desde la API
    const fetchOrders = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://x4gcc65w-3000.usw3.devtunnels.ms/api/pedidos/usuario/${userId}`);
            if (!response.ok) {
                throw new Error('Error al obtener los pedidos');
            }
            const data: ApiResponse = await response.json();
            setOrders(data.pedidos || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    //? Manejar la selección de un pedido
    const handleOrderPress = (order: Order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleReOrder = (order: Order) => {
        // TODO: Lógica para repetir el pedido
    };

    //? Renderizado si no hay sesión activa
    if (!session || !user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.warning, { backgroundColor: colors.background }]}>Debe iniciar sesión para ver sus pedidos.</Text>
                <NotLoggedIn />
            </View>
        );
    }

    //? Renderizado mientras se cargan los datos
    if (authLoading || loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.tabIconDefault} />
            </View>
        )
    }


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Mis pedidos</Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    {orders.length} pedido{orders.length !== 1 ? "s" : ""} realizado
                    {orders.length !== 1 ? "s" : ""}
                </Text>
            </View>

            {/* Error Message */}
            {error && (
                <View
                    style={[
                        styles.errorContainer,
                        { backgroundColor: colorScheme === "dark" ? "#3b0a0a" : "#ffebee" },
                    ]}
                >
                    <Text
                        style={[
                            styles.errorText,
                            { color: colorScheme === "dark" ? "#ff8080" : "#c62828" },
                        ]}
                    >
                        {error}
                    </Text>
                </View>
            )}

            {/* Orders List */}
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.text }]}>
                        No tienes pedidos aún
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <OrderCard
                            order={item}
                            onPress={() => handleOrderPress(item)}
                            colors={colors}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            {/* Modal de detalle */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    visible={modalVisible}
                    onClose={() => {
                        setModalVisible(false);
                        setSelectedOrder(null);
                    }}
                    onReorder={() => handleReOrder(selectedOrder)}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    warning: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    container: {
        flex: 1,
        paddingTop: 16,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: "500",
    },
    errorContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 12,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 14,
        fontWeight: "500",
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "500",
    },
});
