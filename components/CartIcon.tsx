import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/services/CartContext';
import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export const CartIcon: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const { getItemCount } = useCart();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const itemCount = getItemCount();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="cart" size={24} color={colors.text} />
      {itemCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.tint }]}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});