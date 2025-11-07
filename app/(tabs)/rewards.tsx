import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, useColorScheme, View as RNView } from 'react-native';
import React, { useState } from 'react';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/services/AuthContext';
import Colors from '@/constants/Colors';
import NotLoggedIn from "@/components/NotLoggedIn";

const { width } = Dimensions.get('window');

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

export default function TabRewardsScreen() {
  const { session, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'productos' | 'descuentos'>('productos');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
      const colors = Colors[colorScheme ?? 'light'];
  
  const puntosActuales = 250;

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
        {/* Header con Tarjeta de Puntos */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Recompensas</Text>
              <Text style={styles.headerSubtitle}>Dengo Cafetería</Text>
            </View>
            <Ionicons name="gift" size={40} color="#FCD34D" />
          </View>
          
          <View style={styles.pointsCard}>
            <View style={styles.pointsCardContent}>
              <View style={styles.pointsMain}>
                <View style={styles.pointsLeft}>
                  <Text style={styles.pointsLabel}>Tus puntos disponibles</Text>
                  <View style={styles.pointsAmount}>
                    <Text style={styles.pointsNumber}>{puntosActuales}</Text>
                    <Ionicons name="star" size={24} color="#FCD34D" />
                  </View>
                </View>
                <TouchableOpacity style={styles.qrButton}>
                  <Ionicons name="qr-code" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.pointsStats}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Ganados este mes</Text>
                  <Text style={styles.statValue}>+180</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Canjeados</Text>
                  <Text style={styles.statValue}>430</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Info de acumulación */}
        <View style={styles.infoBox}>
          <Ionicons name="trophy" size={20} color="#2563EB" style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>¿Cómo ganar puntos?</Text>
            <Text style={styles.infoText}>
              Por cada compra obtienes un porcentaje en puntos. Compras en la app se acreditan 
              automáticamente, en tienda escanea tu QR en el ticket.
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'productos' && styles.tabActive]}
            onPress={() => setActiveTab('productos')}
          >
            <Ionicons 
              name="cafe" 
              size={18} 
              color={activeTab === 'productos' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, activeTab === 'productos' && styles.tabTextActive]}>
              Productos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'descuentos' && styles.tabActive]}
            onPress={() => setActiveTab('descuentos')}
          >
            <Ionicons 
              name="pricetag" 
              size={18} 
              color={activeTab === 'descuentos' ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[styles.tabText, activeTab === 'descuentos' && styles.tabTextActive]}>
              Descuentos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contenido según tab */}
        {activeTab === 'productos' ? (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cart" size={20} color={isDark ? '#FFFFFF' : '#1F2937'} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Canjea por productos</Text>
            </View>
            
            <View style={styles.productsGrid}>
              {productosRecompensa.map((producto) => (
                <RNView 
                  key={producto.id} 
                  style={[
                    styles.productCard,
                    { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }
                  ]}
                >
                  <View style={styles.productImage}>
                    <Text style={styles.productEmoji}>{producto.emoji}</Text>
                  </View>
                  <RNView style={[
                    styles.productInfo,
                    { backgroundColor: isDark ? '#835C3E' : '#f1dcccff' }
                  ]}>
                    <Text style={[
                      styles.productName,
                      { color: isDark ? '#FFFFFF' : '#1F2937' }
                    ]}>{producto.nombre}</Text>
                    <RNView style={styles.productFooter}>
                      <RNView style={styles.productPoints}>
                        <Ionicons name="star" size={16} color="#F59E0B" />
                        <Text style={styles.productPointsText}>{producto.puntos}</Text>
                      </RNView>
                      <TouchableOpacity
                        style={[
                          styles.canjeButton,
                          puntosActuales < producto.puntos && styles.canjeButtonDisabled
                        ]}
                        disabled={puntosActuales < producto.puntos}
                      >
                        <Text style={[
                          styles.canjeButtonText,
                          puntosActuales < producto.puntos && styles.canjeButtonTextDisabled
                        ]}>
                          Canjear
                        </Text>
                      </TouchableOpacity>
                    </RNView>
                  </RNView>
                </RNView>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetag" size={20} color={isDark ? '#FFFFFF' : '#1F2937'} />
              <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1F2937' }]}>Descuentos disponibles</Text>
            </View>
            
            <View style={styles.descuentosList}>
              {descuentosDisponibles.map((descuento) => (
                <RNView 
                  key={descuento.id} 
                  style={[
                    styles.descuentoCard,
                    { backgroundColor: isDark ? '#23160bff' : '#ffffffff' }
                  ]}
                >
                  <View style={styles.descuentoIcon}>
                    <Ionicons name="pricetag" size={24} color="#059669" />
                  </View>
                  <RNView style={styles.descuentoContent}>
                    <Text style={[
                      styles.descuentoName,
                      { color: isDark ? '#FFFFFF' : '#1F2937' }
                    ]}>{descuento.nombre}</Text>
                    <RNView style={styles.descuentoMeta}>
                      <RNView style={styles.descuentoMetaItem}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.descuentoMetaText}>{descuento.puntos} puntos</Text>
                      </RNView>
                      <Text style={styles.descuentoMetaSeparator}>•</Text>
                      <Text style={styles.descuentoMetaText}>Válido {descuento.valido}</Text>
                    </RNView>
                    <TouchableOpacity
                      style={[
                        styles.canjeDescuentoButton,
                        puntosActuales < descuento.puntos && styles.canjeDescuentoButtonDisabled
                      ]}
                      disabled={puntosActuales < descuento.puntos}
                    >
                      <Text style={[
                        styles.canjeDescuentoButtonText,
                        puntosActuales < descuento.puntos && styles.canjeDescuentoButtonTextDisabled
                      ]}>
                        {puntosActuales >= descuento.puntos ? 'Canjear descuento' : 'Puntos insuficientes'}
                      </Text>
                      {puntosActuales >= descuento.puntos && (
                        <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  </RNView>
                </RNView>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
      warning: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#835C3E',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7d7d7dff',
  },
  pointsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pointsCardContent: {
    backgroundColor: 'transparent',
  },
  pointsMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  pointsLeft: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#FCD34D',
    marginBottom: 8,
  },
  pointsAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  pointsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  qrButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  pointsStats: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'transparent',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#FCD34D',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productEmoji: {
    fontSize: 56,
  },
  productInfo: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  canjeButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  canjeButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  canjeButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  canjeButtonTextDisabled: {
    color: '#9CA3AF',
  },
  descuentosList: {
    gap: 12,
  },
  descuentoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descuentoIcon: {
    backgroundColor: '#D1FAE5',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descuentoContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  descuentoName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  descuentoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  descuentoMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
  },
  descuentoMetaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  descuentoMetaSeparator: {
    fontSize: 12,
    color: '#6B7280',
  },
  canjeDescuentoButton: {
    backgroundColor: '#cc8814ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  canjeDescuentoButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  canjeDescuentoButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  canjeDescuentoButtonTextDisabled: {
    color: '#9CA3AF',
  },
  bottomSpacer: {
    height: 40,
  },
});