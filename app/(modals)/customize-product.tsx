// app/(modals)/customize-product.tsx
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Text, View } from '@/components/Themed';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useCart } from '@/services/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { IngredientePersonalizado, ProductoPersonalizado } from '@/interfaces/Cart';
import { Ingrediente } from '@/interfaces/CustomizeProduct';

export default function CustomizeProductModal() {
  const { productId, productName, productPrice, categoryId } = useLocalSearchParams();
  const { addToCart } = useCart();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [loading, setLoading] = useState(true);
  const [ingredientes, setIngredientes] = useState<{[key: string]: Ingrediente[]}>({});
  const [selecciones, setSelecciones] = useState<{[tipo: string]: Ingrediente | null}>({});
  const [cantidad, setCantidad] = useState(1);

  const backEndUrl = process.env.EXPO_PUBLIC_BACKEND_URL

  useEffect(() => {
    cargarIngredientes();
  }, []);

  const cargarIngredientes = async () => {
    try {
      setLoading(true);
      
      // Usar el endpoint que obtiene ingredientes por categoría del producto
      const response = await fetch(
        `${backEndUrl}api/ingredientes/producto/${productId}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setIngredientes(result.data);
        // Inicializar selecciones vacías
        const inicialSelecciones: {[key: string]: Ingrediente | null} = {};
        Object.keys(result.data).forEach(tipo => {
          inicialSelecciones[tipo] = null;
        });
        setSelecciones(inicialSelecciones);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los ingredientes');
      }
    } catch (error) {
      console.error('Error cargando ingredientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los ingredientes');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarIngrediente = (tipo: string, ingrediente: Ingrediente) => {
    setSelecciones(prev => ({
      ...prev,
      [tipo]: ingrediente
    }));
  };

  const deseleccionarIngrediente = (tipo: string) => {
    setSelecciones(prev => ({
      ...prev,
      [tipo]: null
    }));
  };

  const agregarAlCarrito = () => {
    const ingredientesSeleccionados: IngredientePersonalizado[] = [];
    
    Object.values(selecciones).forEach(ingrediente => {
      if (ingrediente) {
        ingredientesSeleccionados.push({
          id: ingrediente.id,
          nombre: ingrediente.nombre,
          tipo: ingrediente.tipo,
          id_categoria: ingrediente.id_categoria,
          categoria_nombre: ingrediente.categorias.nombre
        });
      }
    });

    const productoPersonalizado: ProductoPersonalizado = {
      producto_id: Number(productId),
      producto_nombre: String(productName),
      producto_precio: Number(productPrice),
      ingredientes: ingredientesSeleccionados,
      cantidad: cantidad
    };

    addToCart(productoPersonalizado);
    
    Alert.alert(
      '¡Agregado al carrito!',
      `${productoPersonalizado.producto_nombre} personalizado agregado al carrito`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const incrementarCantidad = () => setCantidad(prev => prev + 1);
  const decrementarCantidad = () => setCantidad(prev => Math.max(1, prev - 1));

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Cargando opciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Personalizar Producto',
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
        {/* Header del producto */}
        <View style={styles.productHeader}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {productName}
          </Text>
          <Text style={[styles.productPrice, { color: colors.tint }]}>
            ${Number(productPrice).toFixed(2)}
          </Text>
        </View>

        {/* Selector de cantidad */}
        <View style={styles.quantitySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cantidad</Text>
          <View style={styles.quantitySelector}>
            <Pressable 
              style={[styles.quantityButton, { backgroundColor: colors.tabBarColor }]}
              onPress={decrementarCantidad}
            >
              <Ionicons name="remove" size={20} color={colors.text} />
            </Pressable>
            <Text style={[styles.quantityText, { color: colors.text }]}>
              {cantidad}
            </Text>
            <Pressable 
              style={[styles.quantityButton, { backgroundColor: colors.tabBarColor }]}
              onPress={incrementarCantidad}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Secciones de ingredientes */}
        {Object.entries(ingredientes).map(([tipo, ingredientesDelTipo]) => (
          <View key={tipo} style={styles.ingredientSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {tipo} {ingredientesDelTipo.length > 0 && '(Elige uno)'}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              {ingredientesDelTipo.length === 0 ? 'No hay opciones disponibles' : 'Selecciona una opción'}
            </Text>
            
            <View style={styles.ingredientsGrid}>
              {ingredientesDelTipo.map((ingrediente) => (
                <Pressable
                  key={ingrediente.id}
                  style={[
                    styles.ingredientCard,
                    { 
                      backgroundColor: colors.cardBackground,
                      borderColor: selecciones[tipo]?.id === ingrediente.id ? colors.tint : 'transparent'
                    }
                  ]}
                  onPress={() => {
                    if (selecciones[tipo]?.id === ingrediente.id) {
                      deseleccionarIngrediente(tipo);
                    } else {
                      seleccionarIngrediente(tipo, ingrediente);
                    }
                  }}
                >
                  <View style={styles.ingredientContent}>
                    <Text style={[styles.ingredientName, { color: colors.text }]}>
                      {ingrediente.nombre}
                    </Text>
                    <Text style={[styles.ingredientDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                      {ingrediente.descripcion}
                    </Text>
                  </View>
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radio,
                      { 
                        borderColor: colors.tint,
                        backgroundColor: selecciones[tipo]?.id === ingrediente.id ? colors.tint : 'transparent'
                      }
                    ]}>
                      {selecciones[tipo]?.id === ingrediente.id && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botón de agregar al carrito */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.tabBarColor }]}>
        <Pressable 
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={agregarAlCarrito}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.addButtonText}>
            Agregar al Carrito - ${(Number(productPrice) * cantidad).toFixed(2)}
          </Text>
        </Pressable>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  productHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '800',
  },
  quantitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  ingredientSection: {
    marginBottom: 24,
  },
  ingredientsGrid: {
    gap: 12,
  },
  ingredientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  radioContainer: {
    marginLeft: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});