import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { formatDate, getStatusColor, getStatusLabel } from "../../utils/orderUtils";

interface OrderItem {
    id: number;
    nombre_item: string;
    cantidad: number;
    precio_unitario: number;
}

interface Order {
    id: number;
    numero_pedido: string;
    estado: "recibido" | "preparando" | "listo" | "entregado" | "cancelado";
    creado_en: string;
    total: number;
    items_pedido: OrderItem[];
}

interface OrderCardProps {
    order: Order;
    onPress: () => void;
    colors: any;
}

const metrics = {
    spacing: 12,
    radius: 12,
    cardPadding: 16,
    smallText: 12,
    baseText: 14,
    largeText: 16,
};

const SHADOW = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    android: {
        elevation: 3,
    },
    default: {},
});

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress, colors }) => {
    const statusColor = getStatusColor(order.estado);
    const statusLabel = getStatusLabel(order.estado);

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                SHADOW,
                {
                    backgroundColor: colors.cardBackground ?? colors.background,
                    opacity: pressed ? 0.9 : 1,
                    borderColor: colors.border ?? "transparent",
                },
            ]}
        >
            {/* Header: Order Number and Status */}
            <View style={styles.cardHeader}>
                <View style={styles.headerText}>
                    <Text
                        style={[
                            styles.orderNumber,
                            { color: colors.text },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        #{order.numero_pedido}
                    </Text>
                    <Text
                        style={[
                            styles.orderDate,
                            { color: colors.tabIconDefault },
                        ]}
                    >
                        {formatDate(order.creado_en)}
                    </Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor.background },
                    ]}
                    pointerEvents="none"
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: statusColor.text },
                        ]}
                        numberOfLines={1}
                    >
                        {statusLabel}
                    </Text>
                </View>
            </View>

            {/* Items List */}
            <View
                style={[
                    styles.itemsContainer,
                    { borderBottomColor: colors.border ?? colors.tabIconDefault },
                ]}
            >
                {order.items_pedido.slice(0, 3).map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text
                            style={[styles.itemName, { color: colors.text }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.cantidad}x {item.nombre_item}
                        </Text>
                        <Text style={[styles.itemPrice, { color: colors.text }]}>
                            ${item.cantidad * item.precio_unitario}
                        </Text>
                    </View>
                ))}
                {order.items_pedido.length > 3 && (
                    <Text style={[styles.moreItems, { color: colors.tabIconDefault }]}>
                        +{order.items_pedido.length - 3} más
                    </Text>
                )}
            </View>

            {/* Total */}
            <View
                style={[
                    styles.totalRow,
                    { borderTopColor: colors.border ?? colors.tabIconDefault },
                ]}
            >
                <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalAmount, { color: colors.text }]}>
                    ${order.total}
                </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
                <Pressable
                    style={[
                        styles.button,
                        styles.secondaryButton,
                        { borderColor: colors.tabIconDefault },
                    ]}
                    android_ripple={{ color: "rgba(0,0,0,0.05)" }}
                    onPress={onPress}
                >
                    <Text
                        style={[styles.buttonText, { color: colors.tabIconDefault }]}
                    >
                        Ver detalles
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.button,
                        styles.primaryButton,
                        { backgroundColor: colors.tint, marginLeft: metrics.spacing },
                    ]}
                    android_ripple={{ color: "rgba(255,255,255,0.12)" }}
                >
                    <Text style={[styles.buttonText, { color: colors.background }]}>
                        Volver a pedir
                    </Text>
                </Pressable>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: metrics.radius,
        padding: metrics.cardPadding,
        marginBottom: metrics.spacing,
        borderWidth: 1,
        overflow: "hidden",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: metrics.spacing,
    },
    headerText: {
        flex: 1,
        paddingRight: metrics.spacing,
    },
    orderNumber: {
        fontSize: metrics.largeText,
        fontWeight: "700",
    },
    orderDate: {
        fontSize: metrics.smallText,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 88,
        alignItems: "center",
        justifyContent: "center",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    itemsContainer: {
        marginBottom: metrics.spacing,
        paddingBottom: metrics.spacing,
        borderBottomWidth: 1,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        alignItems: "center",
    },
    itemName: {
        fontSize: 13,
        flex: 1,
        marginRight: 8,
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: "600",
    },
    moreItems: {
        fontSize: metrics.smallText,
        marginTop: 2,
        fontStyle: "italic",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: metrics.spacing,
        paddingBottom: metrics.spacing,
        borderTopWidth: 1,
    },
    totalLabel: {
        fontSize: metrics.baseText,
        fontWeight: "600",
    },
    totalAmount: {
        fontSize: metrics.largeText,
        fontWeight: "700",
    },
    buttonsContainer: {
        flexDirection: "row",
        marginTop: metrics.spacing,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 42,
    },
    primaryButton: {
        // color dinámico aplicado desde props
    },
    secondaryButton: {
        borderWidth: 1,
        backgroundColor: "transparent",
    },
    buttonText: {
        fontSize: 13,
        fontWeight: "600",
    },
});

export default OrderCard;
