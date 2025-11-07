import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { WelcomeHeader, SearchBar, CategoryGrid, FeaturedProducts } from "@/components/Home"
import * as Notifications from 'expo-notifications';
import Colors from '@/constants/Colors';

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("TODO")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

  // Filtra según la categoría seleccionada (muestra todo si es "TODO")
  const filteredProducts = selectedCategory === 'TODO'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <WelcomeHeader />

      <View style={styles.eventsSection}>
        <Button 
          mode="contained" 
          onPress={() => router.push("/(tabs)/events")} 
          style={styles.eventsButton}
          contentStyle={styles.eventsButtonContent}
          labelStyle={styles.eventsButtonLabel}
          icon="calendar"
        >
          Ver eventos
        </Button>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Disfruta de nuestros mejores postres y bebidas, además de los mejores precios.
        </Text>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Categorías</Text>
        <CategoryGrid 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </View>

      <View style={styles.productsSection}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Cargando productos...
            </Text>
          </View>
        ) : (
          <FeaturedProducts products={filteredProducts} />
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  eventsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  eventsButton: {
    backgroundColor: '#00704A',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventsButtonContent: {
    paddingVertical: 8,
  },
  eventsButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionLabel: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
  categoriesSection: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  productsSection: {
    paddingTop: 8,
  },
  loadingContainer: {
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.6,
  },
});
