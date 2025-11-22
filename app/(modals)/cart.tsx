import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { useCart } from '@/services/CartContext';
import { ProductoPersonalizado } from '@/interfaces/Cart';
import { Ionicons } from '@expo/vector-icons';

export default function CartModal() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [processing, setProcessing] = useState(false);

  const incrementQuantity = (productoId: number, currentQuantity: number) => {
    updateQuantity(productoId, currentQuantity + 1);
  };

  const decrementQuantity = (productoId: number, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      removeFromCart(productoId);
    } else {
      updateQuantity(productoId, currentQuantity - 1);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos al carrito antes de continuar');
      return;
    }

    setProcessing(true);
    
    // Aquí integrarás con tu API de pedidos
    Alert.alert(
      'Procesar Pedido',
      `Total: $${getTotal().toFixed(2)}\n\n¿Deseas continuar con el pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Continuar', 
          onPress: () => {
            // Navegar a pantalla de checkout o procesar directamente
            procesarPedido();
          }
        }
      ]
    );
    
    setProcessing(false);
  };

  const procesarPedido = async () => {
    // Aquí va la integración con tu endpoint crearPedido
    console.log('Procesando pedido:', items);
    Alert.alert('Pedido en desarrollo', 'La funcionalidad de checkout estará disponible pronto');
  };

  const renderItem = (item: ProductoPersonalizado, index: number) => (
    <View key={`${item.producto_id}-${index}`} style={[styles.cartItem, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
          {item.producto_nombre}
        </Text>
        <Pressable 
          onPress={() => removeFromCart(item.producto_id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </Pressable>
      </View>

      {item.ingredientes.length > 0 && (
        <View style={styles.ingredientsContainer}>
          <Text style={[styles.ingredientsLabel, { color: colors.textSecondary }]}>
            Personalización:
          </Text>
          {item.ingredientes.map((ing, idx) => (
            <Text key={idx} style={[styles.ingredient, { color: colors.textSecondary }]}>
              • {ing.nombre} ({ing.tipo})
            </Text>
          ))}
        </View>
      )}

      <View style={styles.itemFooter}>
        <View style={styles.quantityContainer}>
          <Pressable 
            style={[styles.quantityButton, { backgroundColor: colors.tabBarColor }]}
            onPress={() => decrementQuantity(item.producto_id, item.cantidad)}
          >
            <Ionicons name="remove" size={16} color={colors.text} />
          </Pressable>
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {item.cantidad}
          </Text>
          <Pressable 
            style={[styles.quantityButton, { backgroundColor: colors.tabBarColor }]}
            onPress={() => incrementQuantity(item.producto_id, item.cantidad)}
          >
            <Ionicons name="add" size={16} color={colors.text} />
          </Pressable>
        </View>
        
        <Text style={[styles.itemPrice, { color: colors.tint }]}>
          ${(item.producto_precio * item.cantidad).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Mi Carrito',
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: colors.text,
              fontSize: 20
            },
            headerShadowVisible: false,
          }}
        />

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Tu carrito está vacío
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Agrega algunos productos deliciosos
          </Text>
          <Pressable 
            style={[styles.continueButton, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}
          >
            <Text style={styles.continueButtonText}>Seguir Comprando</Text>
          </Pressable>
        </View>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: `Mi Carrito (${items.length})`,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: colors.text,
            fontSize: 20
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {items.map((item, index) => renderItem(item, index))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.tabBarColor }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: colors.tint }]}>
            ${getTotal().toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.footerButtons}>
          <Pressable 
            style={[styles.secondaryButton, { backgroundColor: colors.tabBarColor }]}
            onPress={clearCart}
          >
            <Ionicons name="trash-outline" size={20} color={colors.text} />
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Vaciar
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.primaryButton, { backgroundColor: colors.tint }]}
            onPress={handleCheckout}
            disabled={processing}
          >
            {processing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="card" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>
                  Pagar
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  continueButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    gap: 16,
    paddingVertical: 16,
  },
  cartItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  deleteButton: {
    padding: 4,
  },
  ingredientsContainer: {
    marginBottom: 12,
  },
  ingredientsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  ingredient: {
    fontSize: 12,
    lineHeight: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    gap: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});