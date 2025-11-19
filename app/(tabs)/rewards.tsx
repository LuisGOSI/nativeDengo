import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, useColorScheme, View as RNView, Animated, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/services/AuthContext';
import Colors from '@/constants/Colors';
import NotLoggedIn from "@/components/NotLoggedIn";
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Producto {
  id: number;
  nombre: string;
  puntos: number;
  emoji: string;
  disponible: boolean;
}

interface Descuento {
  id: number;
  nombre: string;
  porcentaje: number;
  puntos: number;
  valido: string;
}

type PointsCardProps = {
  puntosActuales: number;
  visitas: number;
  nivel: string;
  onQRPress: () => void;
};


// Componente PointsCard con animación
const PointsCard = ({ puntosActuales, visitas, nivel, onQRPress }: PointsCardProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={[styles.pointsCard, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pointsGradient}
      >
        <View style={styles.pointsCardContent}>
          <View style={styles.pointsMain}>
            <View style={styles.pointsLeft}>
              <Text style={styles.pointsLabel}>Tus puntos disponibles</Text>

              <View style={styles.pointsAmount}>
                <Text style={styles.pointsNumber}>{puntosActuales}</Text>
              </View>

              <Text style={{ color: "white", marginTop: 5 }}>
                Nivel: {nivel}
              </Text>

              <Text style={{ color: "white", marginTop: 2 }}>
                Visitas: {visitas}
              </Text>
            </View>

            <TouchableOpacity style={styles.qrButton} onPress={onQRPress}>
              <Ionicons name="qr-code" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

};

// Componente ProductCard con animación
const ProductCard = ({
  producto,
  puntosActuales,
  isDark,
  index,
  onCanjear
}: {
  producto: Producto;
  puntosActuales: number;
  isDark: boolean;
  index: number;
  onCanjear: (producto: Producto) => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 80,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay: index * 80,
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

  const canCanje = puntosActuales >= producto.puntos;

  const handleCanjear = () => {
    if (canCanje) {
      onCanjear(producto);
    }
  };

  return (
    <Animated.View
      style={[
        styles.productCardWrapper,
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
        disabled={!canCanje}
      >
        <RNView style={[
          styles.productCard,
          { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
        ]}>
          <LinearGradient
            colors={canCanje ? ['#FEF3C7', '#FDE68A'] : ['#F3F4F6', '#E5E7EB']}
            style={styles.productImage}
          >
            <Text style={styles.productEmoji}>{producto.emoji}</Text>
          </LinearGradient>
          <RNView style={[
            styles.productInfo,
            { backgroundColor: isDark ? '#374151' : '#F9FAFB' }
          ]}>
            <Text style={[
              styles.productName,
              { color: isDark ? '#FFFFFF' : '#1F2937' }
            ]}>{producto.nombre}</Text>
            <RNView style={styles.productFooter}>
              <RNView style={styles.productPoints}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={styles.productPointsText}>{producto.puntos}</Text>
              </RNView>
              <TouchableOpacity
                onPress={handleCanjear}
                disabled={!canCanje}
                style={[
                  styles.canjeButton,
                  !canCanje && styles.canjeButtonDisabled
                ]}
              >
                {canCanje ? (
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.canjeButtonGradient}
                  >
                    <Text style={styles.canjeButtonText}>Canjear</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.canjeButtonTextDisabled}>Bloqueado</Text>
                )}
              </TouchableOpacity>
            </RNView>
          </RNView>
        </RNView>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Componente DescuentoCard con animación
const DescuentoCard = ({
  descuento,
  puntosActuales,
  isDark,
  index
}: {
  descuento: Descuento;
  puntosActuales: number;
  isDark: boolean;
  index: number;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        tension: 40,
        friction: 8,
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

  const canCanje = puntosActuales >= descuento.puntos;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }]
      }}
    >
      <RNView style={[
        styles.descuentoCard,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
      ]}>
        <LinearGradient
          colors={canCanje ? ['#D1FAE5', '#A7F3D0'] : ['#F3F4F6', '#E5E7EB']}
          style={styles.descuentoIcon}
        >
          <Ionicons name="pricetag" size={28} color={canCanje ? '#059669' : '#9CA3AF'} />
        </LinearGradient>
        <RNView style={styles.descuentoContent}>
          <View style={styles.descuentoBadge}>
            <Text style={styles.descuentoBadgeText}>{descuento.porcentaje}% OFF</Text>
          </View>
          <Text style={[
            styles.descuentoName,
            { color: isDark ? '#FFFFFF' : '#1F2937' }
          ]}>{descuento.nombre}</Text>
          <RNView style={styles.descuentoMeta}>
            <RNView style={styles.descuentoMetaItem}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.descuentoMetaText}>{descuento.puntos} pts</Text>
            </RNView>
            <Text style={styles.descuentoMetaSeparator}>•</Text>
            <RNView style={styles.descuentoMetaItem}>
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text style={styles.descuentoMetaText}>{descuento.valido}</Text>
            </RNView>
          </RNView>
          <TouchableOpacity
            disabled={!canCanje}
            activeOpacity={0.8}
          >
            <View style={[
              styles.canjeDescuentoButton,
              !canCanje && styles.canjeDescuentoButtonDisabled
            ]}>
              {canCanje ? (
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.canjeDescuentoGradient}
                >
                  <Text style={styles.canjeDescuentoButtonText}>Canjear descuento</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </LinearGradient>
              ) : (
                <Text style={styles.canjeDescuentoButtonTextDisabled}>Puntos insuficientes</Text>
              )}
            </View>
          </TouchableOpacity>
        </RNView>
      </RNView>
    </Animated.View>
  );
};

export default function TabRewardsScreen() {
  const { session, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'productos' | 'descuentos'>('productos');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const headerAnim = useRef(new Animated.Value(0)).current;

  const [puntos, setPuntos] = useState(0);
  const [visitas, setVisitas] = useState(0);
  const [nivel, setNivel] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [procesandoCanje, setProcesandoCanje] = useState<number | null>(null);


  // Función para obtener puntos
  const obtenerPuntos = async () => {
    if (!session?.user.id) {
      console.log("No hay usuario logueado");
      return;
    }

    setRefreshing(true);
    try {
      const response = await fetch(
        `${backendUrl}api/puntos?idUsuario=${session.user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPuntos(data.puntos);
        setVisitas(data.visitas);
        setNivel(data.nivel);
        console.log("Puntos actualizados:", data.puntos);
      } else {
        console.error("Error del servidor:", data.error);
      }
    } catch (error) {
      console.log("Error al obtener puntos:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    obtenerPuntos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      obtenerPuntos();
    }, [session?.user.id])
  );

  const handleCanjearProducto = async (producto: Producto) => {
    if (!session?.user.id) {
      Alert.alert('Error', 'Debes iniciar sesión para canjear productos');
      return;
    }

    if (puntos < producto.puntos) {
      Alert.alert('Puntos insuficientes', `Necesitas ${producto.puntos} puntos para canjear este producto`);
      return;
    }

    setProcesandoCanje(producto.id);

    try {
      // Preparar los datos para la venta
      const ventaData = {
        sucursal_id: 1, // Sucursal por defecto
        usuario_id: session.user.id,
        items: [
          {
            producto_id: producto.id,
            nombre_item: producto.nombre,
            precio_unitario: 0, // Precio en dinero es 0 porque se paga con puntos
            cantidad: 1
          }
        ],
        metodo_pago: 'puntos',
        monto_pagado: 0, // No se paga dinero
        puntos_usados: producto.puntos,
        descuento_aplicado: 0,
        notas: `Canje de recompensa: ${producto.nombre}`
      };

      console.log('Enviando datos de canje:', ventaData);

      const response = await fetch(`${backendUrl}api/ventas/registrar-venta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar el canje');
      }

      if (result.mensaje) {
        // Canje exitoso
        Alert.alert(
          '¡Canje Exitoso!',
          `Has canjeado ${producto.puntos} puntos por: ${producto.nombre}`,
          [
            {
              text: 'Aceptar',
              onPress: () => {
                // Actualizar los puntos localmente
                setPuntos(prev => prev - producto.puntos);
                // Actualizar datos del usuario
                obtenerPuntos();
              }
            }
          ]
        );
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }

    } catch (error: any) {
      console.error('Error en canje:', error);
      Alert.alert(
        'Error en el Canje',
        error.message || 'No se pudo completar el canje. Intenta nuevamente.'
      );
    } finally {
      setProcesandoCanje(null);
    }
  };

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!session || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.warning, { backgroundColor: colors.background }]}>
          Debe iniciar sesión para ver sus recompensas.
        </Text>
        <NotLoggedIn />
      </View>
    );
  }

  const productosRecompensa: Producto[] = [
    { id: 1, nombre: 'Café Americano', puntos: 50, emoji: '☕', disponible: true },
    { id: 2, nombre: 'Cappuccino', puntos: 75, emoji: '☕', disponible: true },
    { id: 3, nombre: 'Croissant', puntos: 60, emoji: '🥐', disponible: true },
    { id: 4, nombre: 'Muffin', puntos: 45, emoji: '🧁', disponible: true },
    { id: 5, nombre: 'Sandwich', puntos: 120, emoji: '🥪', disponible: true },
    { id: 6, nombre: 'Jugo Natural', puntos: 80, emoji: '🧃', disponible: true },
  ];

  const descuentosDisponibles: Descuento[] = [
    { id: 1, nombre: '10% en tu próxima compra', porcentaje: 10, puntos: 100, valido: '30 días' },
    { id: 2, nombre: '15% en bebidas', porcentaje: 15, puntos: 150, valido: '15 días' },
    { id: 3, nombre: '20% en alimentos', porcentaje: 20, puntos: 200, valido: '15 días' },
    { id: 4, nombre: '25% en total', porcentaje: 25, puntos: 300, valido: '7 días' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con gradiente */}
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
          <LinearGradient
            colors={['#7C3AED', '#5B21B6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Recompensas</Text>
                <Text style={styles.headerSubtitle}>Dengo Cafetería</Text>
              </View>
              <View style={styles.giftIconContainer}>
                <Ionicons name="gift" size={44} color="#FCD34D" />
              </View>
            </View>

            <PointsCard
              puntosActuales={puntos}
              visitas={visitas}
              nivel={nivel}
              onQRPress={() => router.push("./ScanQRScreen")}
            />

          </LinearGradient>
        </Animated.View>

        {/* Info de acumulación */}
        <View style={styles.infoBox}>
          <LinearGradient
            colors={['#DBEAFE', '#BFDBFE']}
            style={styles.infoGradient}
          >
            <Ionicons name="information-circle" size={24} color="#2563EB" style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>¿Cómo ganar puntos?</Text>
              <Text style={styles.infoText}>
                Por cada compra obtienes un porcentaje en puntos. Compras en la app se acreditan
                automáticamente, en tienda escanea tu QR en el ticket.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Tabs con animación */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'productos' && styles.tabActive]}
            onPress={() => setActiveTab('productos')}
            activeOpacity={0.7}
          >
            {activeTab === 'productos' ? (
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabActiveGradient}
              >
                <Ionicons name="cafe" size={20} color="#FFFFFF" />
                <Text style={styles.tabTextActive}>Productos</Text>
              </LinearGradient>
            ) : (
              <>
                <Ionicons name="cafe-outline" size={20} color="#6B7280" />
                <Text style={styles.tabText}>Productos</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'descuentos' && styles.tabActive]}
            onPress={() => setActiveTab('descuentos')}
            activeOpacity={0.7}
          >
            {activeTab === 'descuentos' ? (
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabActiveGradient}
              >
                <Ionicons name="pricetag" size={20} color="#FFFFFF" />
                <Text style={styles.tabTextActive}>Descuentos</Text>
              </LinearGradient>
            ) : (
              <>
                <Ionicons name="pricetag-outline" size={20} color="#6B7280" />
                <Text style={styles.tabText}>Descuentos</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Contenido según tab */}
        {activeTab === 'productos' ? (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Ionicons name="gift" size={24} color={isDark ? '#F59E0B' : '#D97706'} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Canjea por productos
              </Text>
            </View>

            <View style={styles.productsGrid}>
              {productosRecompensa.map((producto, index) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  puntosActuales={puntos}
                  isDark={isDark}
                  index={index}
                  onCanjear={handleCanjearProducto}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetags" size={24} color={isDark ? '#10B981' : '#059669'} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>
                Descuentos disponibles
              </Text>
            </View>

            <View style={styles.descuentosList}>
              {descuentosDisponibles.map((descuento, index) => (
                <DescuentoCard
                  key={descuento.id}
                  descuento={descuento}
                  puntosActuales={puntos}
                  isDark={isDark}
                  index={index}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      {/* Loading overlay para canje */}
      {procesandoCanje && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.processingText}>Procesando canje...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  warning: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  headerTextContainer: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  giftIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 20,
  },
  pointsCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  pointsGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pointsCardContent: {
    backgroundColor: 'transparent',
  },
  pointsMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  pointsLeft: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#FCD34D',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  pointsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'transparent',
  },
  pointsNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  qrButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pointsStats: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  infoBox: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoGradient: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  infoText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 19,
    opacity: 0.9,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabActiveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCardWrapper: {
    width: (width - 56) / 2,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productEmoji: {
    fontSize: 64,
  },
  productInfo: {
    padding: 14,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  productPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  productPointsText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.3,
  },
  canjeButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  canjeButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  canjeButtonDisabled: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  canjeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  canjeButtonTextDisabled: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  descuentosList: {
    gap: 16,
  },
  descuentoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  descuentoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descuentoContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  descuentoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  descuentoBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  descuentoName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  descuentoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  descuentoMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  descuentoMetaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  descuentoMetaSeparator: {
    fontSize: 13,
    color: '#6B7280',
  },
  canjeDescuentoButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  canjeDescuentoGradient: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  canjeDescuentoButtonDisabled: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  canjeDescuentoButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  canjeDescuentoButtonTextDisabled: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  bottomSpacer: {
    height: 60,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  processingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});