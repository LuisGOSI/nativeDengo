import type React from "react"
import { View, Text, Modal, Pressable, StyleSheet, ScrollView, SafeAreaView, useColorScheme, Platform } from "react-native"
import { getStatusColor, getStatusLabel, formatDate } from "../../utils/orderUtils"
import Colors from "@/constants/Colors"

interface OrderItem {
    id: number
    nombre_item: string
    cantidad: number
    precio_unitario: number
}

interface Order {
    id: number
    numero_pedido: string
    estado: "recibido" | "preparando" | "listo" | "entregado" | "cancelado"
    creado_en: string
    total: number
    subtotal: number
    descuentos: number
    impuestos: number
    items_pedido: OrderItem[]
    sucursales: {
        nombre: string
        direccion: string
    }
    datos_personalizados: string
}

interface OrderDetailModalProps {
    order: Order
    visible: boolean
    onClose: () => void
    onReorder: () => void
}

const SPACING = 16
const RADIUS = 12
const FONT = {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
}

const shadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    android: {
        elevation: 3,
    },
    default: {},
})

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, visible, onClose, onReorder }) => {
    const colorScheme = useColorScheme()
    const colors = Colors[colorScheme ?? "light"]
    const statusColor = getStatusColor(order.estado)
    const statusLabel = getStatusLabel(order.estado)

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView style={[styles.container, { backgroundColor: colors.secondaryBackground ?? colors.background }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.tabBarColor }]}>
                    <Pressable onPress={onClose} hitSlop={8} style={styles.closeWrapper}>
                        <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕ Cerrar</Text>
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Detalles del Pedido</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Order Header */}
                    <View style={[styles.section, { backgroundColor: colors.cardBackground, ...shadow }]}>
                        <View style={styles.orderHeaderRow}>
                            <View style={styles.orderMeta}>
                                <Text style={[styles.orderNumberDetail, { color: colors.text }]}>{order.numero_pedido}</Text>
                                <Text style={[styles.orderDateDetail, { color: colors.textSecondary ?? colors.tabBarColor }]}>
                                    {formatDate(order.creado_en)}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: statusColor.background }]}>
                                <Text style={[styles.statusText, { color: statusColor.text }]}>{statusLabel}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Branch Info */}
                    <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sucursal</Text>
                        <Text style={[styles.branchName, { color: colors.text }]}>{order.sucursales.nombre}</Text>
                        <Text style={[styles.branchAddress, { color: colors.textSecondary ?? colors.tabBarColor }]}>
                            {order.sucursales.direccion}
                        </Text>
                    </View>

                    {/* Items */}
                    <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Items del pedido</Text>
                        {order.items_pedido.map((item) => (
                            <View
                                key={item.id}
                                style={[
                                    styles.itemDetailRow,
                                    { borderBottomColor: colors.tabBarColor, paddingVertical: SPACING / 2 },
                                ]}
                            >
                                <View style={styles.itemDetailInfo}>
                                    <Text style={[styles.itemDetailName, { color: colors.text }]} numberOfLines={2}>
                                        {item.nombre_item}
                                    </Text>
                                    <Text style={[styles.itemDetailQty, { color: colors.textSecondary ?? colors.tabBarColor }]}>
                                        Cantidad: {item.cantidad}
                                    </Text>
                                </View>
                                <Text style={[styles.itemDetailPrice, { color: colors.text }]}>
                                    ${Number(item.cantidad * item.precio_unitario).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Price Summary */}
                    <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                        <View style={styles.priceRow}>
                            <Text style={[styles.priceLabel, { color: colors.text }]}>Subtotal</Text>
                            <Text style={[styles.priceValue, { color: colors.text }]}>${Number(order.subtotal).toFixed(2)}</Text>
                        </View>
                        {order.descuentos > 0 && (
                            <View style={styles.priceRow}>
                                <Text style={[styles.priceLabel, { color: colors.text }]}>Descuentos</Text>
                                <Text style={[styles.priceValue, { color: "#4caf50" }]}>-${Number(order.descuentos).toFixed(2)}</Text>
                            </View>
                        )}
                        {order.impuestos > 0 && (
                            <View style={styles.priceRow}>
                                <Text style={[styles.priceLabel, { color: colors.text }]}>Impuestos</Text>
                                <Text style={[styles.priceValue, { color: colors.text }]}>${Number(order.impuestos).toFixed(2)}</Text>
                            </View>
                        )}
                        <View style={[styles.priceRow, styles.totalRow, { borderTopColor: colors.tabBarColor }]}>
                            <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                            <Text style={[styles.totalValue, { color: colors.text }]}>${Number(order.total).toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        <Pressable
                            style={[
                                styles.actionButton,
                                styles.secondaryActionButton,
                                { borderColor: colors.tabBarColor, backgroundColor: "transparent" },
                            ]}
                            onPress={onClose}
                        >
                            <Text style={[styles.actionButtonText, { color: colors.text }]}>Volver</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.actionButton,
                                styles.primaryActionButton,
                                { backgroundColor: colors.button ?? "#5b4db8" },
                            ]}
                            onPress={onReorder}
                        >
                            <Text style={[styles.actionButtonText, { color: "#fff" }]}>Volver a pedir</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: SPACING,
        paddingVertical: SPACING / 1.25,
        borderBottomWidth: 1,
    },
    closeWrapper: { minWidth: 44, alignItems: "flex-start" },
    closeButton: { fontSize: FONT.sm, fontWeight: "600" },
    headerTitle: { fontSize: FONT.xl, fontWeight: "700" },
    scrollContent: { paddingVertical: SPACING / 1.5, paddingBottom: SPACING * 2 },
    section: {
        marginHorizontal: SPACING,
        marginBottom: SPACING,
        borderRadius: RADIUS,
        padding: SPACING,
    },
    sectionTitle: { fontSize: FONT.lg, fontWeight: "600", marginBottom: SPACING / 1.2 },
    orderHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    orderMeta: { flex: 1, paddingRight: SPACING / 1.5 },
    orderNumberDetail: { fontSize: FONT.xl, fontWeight: "700", marginBottom: 4 },
    orderDateDetail: { fontSize: FONT.sm },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
        minWidth: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    statusText: { fontSize: FONT.xs, fontWeight: "600" },
    branchName: { fontSize: FONT.md, fontWeight: "600", marginBottom: 4 },
    branchAddress: { fontSize: FONT.sm },
    itemDetailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
    },
    itemDetailInfo: { flex: 1, paddingRight: SPACING / 2 },
    itemDetailName: { fontSize: FONT.md, fontWeight: "600", marginBottom: 4 },
    itemDetailQty: { fontSize: FONT.xs },
    itemDetailPrice: { fontSize: FONT.md, fontWeight: "700", marginLeft: 12 },
    priceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: SPACING / 2 },
    priceLabel: { fontSize: FONT.sm },
    priceValue: { fontSize: FONT.sm, fontWeight: "600" },
    totalRow: { paddingTop: SPACING / 1.5, borderTopWidth: 1, marginTop: SPACING / 2 },
    totalLabel: { fontSize: FONT.lg, fontWeight: "700" },
    totalValue: { fontSize: FONT.xl, fontWeight: "800" },
    actionsContainer: {
        flexDirection: "row",
        paddingHorizontal: SPACING,
        paddingVertical: SPACING,
    },
    actionButton: {
        flex: 1,
        paddingVertical: SPACING / 1.2,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    primaryActionButton: { backgroundColor: "#5b4db8" },
    secondaryActionButton: { borderWidth: 1, marginRight: SPACING / 2 },
    actionButtonText: { fontSize: FONT.sm, fontWeight: "700" },
})

export default OrderDetailModal
