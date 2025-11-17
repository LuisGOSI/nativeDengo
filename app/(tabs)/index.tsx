import { ScrollView, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { WelcomeHeader, CategoryGrid, FeaturedProducts } from "@/components/Home"
import * as Notifications from 'expo-notifications';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  title: string;
  category: string;
  rating: number;
  time: string;
  price: number;
}

export default function TabHomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCategory, setSelectedCategory] = useState("TODO")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const FEATURED_PRODUCTS: Product[] = [
    {
      id: 1,
      title: "Café negro",
      category: "CAFE",
      rating: 4.8,
      time: "15-20",
      price: 36,
    },
    {
      id: 2,
      title: "Frappuccino Dengo",
      category: "CAFE",
      rating: 4.9,
      time: "15-35",
      price: 55,
    },
    {
      id: 3,
      title: "Pastel de chocolate",
      category: "POSTRES",
      rating: 4.7,
      time: "20-30",
      price: 80,
    },
    {
      id: 4,
      title: "Croissant de almendra",
      category: "POSTRES",  
      rating: 4.6,
      time: "15-25",
      price: 45,
    },
    {
      id: 5,
      title: "Sándwich de jamón y queso",
      category: "COMIDA",
      rating: 4.5,
      time: "10-20",
      price: 70,
    },
    {
      id: 6,
      title: "Ensalada César",
      category: "COMIDA",
      rating: 4.4,
      time: "15-25",
      price: 65,
    },
  ]

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Carga de productos
    setTimeout(() => {
      setProducts(FEATURED_PRODUCTS)
      setLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    const notificarAlEntrar = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Bienvenido a Dengo! 🍰',
          body: 'Disfruta de nuestros mejores postres y bebidas.',
        },
        trigger: null
      });
    };
    notificarAlEntrar();
  }, []);

  // Animación del botón de eventos
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const filteredProducts = selectedCategory === 'TODO'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con animación */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <WelcomeHeader />
      </Animated.View>

      {/* Botón de eventos con gradiente y animación */}
      <Animated.View 
        style={[
          styles.eventsSection,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          }
        ]}
      >
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <LinearGradient
            colors={['#00704A', '#005c3d', '#004d33']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Button 
              mode="contained" 
              onPress={() => router.push("/(tabs)/events")}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.eventsButton}
              contentStyle={styles.eventsButtonContent}
              labelStyle={styles.eventsButtonLabel}
              icon="calendar"
            >
              Ver eventos especiales
            </Button>
          </LinearGradient>
        </Animated.View>

        {/* Indicador decorativo */}
        <View style={styles.decorativeBar} />
      </Animated.View>

      {/* Descripción con animación */}
      <Animated.View 
        style={[
          styles.descriptionSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['rgba(0, 112, 74, 0.15)', 'rgba(0, 112, 74, 0.05)']
            : ['rgba(0, 112, 74, 0.08)', 'rgba(0, 112, 74, 0.02)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.descriptionCard}
        >
          <Text style={[styles.descriptionIcon, { color: colors.tint }]}>✨</Text>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            Disfruta de nuestros mejores postres y bebidas, además de los mejores precios.
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Sección de categorías con animación */}
      <Animated.View 
        style={[
          styles.categoriesSection,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categorías
          </Text>
          <View style={[styles.titleUnderline, { backgroundColor: colors.tint }]} />
        </View>
        <CategoryGrid 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </Animated.View>

      {/* Productos con animación */}
      <Animated.View 
        style={[
          styles.productsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.View
              style={{
                transform: [{
                  rotate: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }}
            >
              <ActivityIndicator size="large" color={colors.tint} />
            </Animated.View>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Cargando productos deliciosos...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {selectedCategory === 'TODO' ? 'Productos destacados' : selectedCategory}
              </Text>
              <View style={[styles.titleUnderline, { backgroundColor: colors.tint }]} />
            </View>
            <FeaturedProducts products={filteredProducts} />
          </>
        )}
      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  eventsSection: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 16,
  },
  gradientButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#00704A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  eventsButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  eventsButtonContent: {
    paddingVertical: 12,
  },
  eventsButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  decorativeBar: {
    height: 4,
    width: 60,
    backgroundColor: '#00704A',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 16,
    opacity: 0.3,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  descriptionCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 112, 74, 0.1)',
  },
  descriptionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoriesSection: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  titleUnderline: {
    height: 4,
    width: 40,
    borderRadius: 2,
    opacity: 0.8,
  },
  productsSection: {
    paddingTop: 8,
  },
  loadingContainer: {
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 15,
    opacity: 0.7,
    fontWeight: '500',
  },
});