import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
        headerShadowVisible: false,
        headerTitle: () => null,
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].tabBarColor },
      }}>

      {/* Boton para regresar a Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
          headerLeft: () => (
            <Link href="/(tabs)/branches" asChild>
              <Pressable
                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}
              >
                {({ pressed }) => (
                  <>
                    <Ionicons
                      name="location"
                      size={20}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ opacity: pressed ? 0.5 : 1 }}
                    />
                    <Text
                      style={{
                        marginLeft: 6,
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors[colorScheme ?? 'light'].text,
                        opacity: pressed ? 0.5 : 1,
                      }}
                    >
                      Sucursales
                    </Text>
                  </>
                )}
              </Pressable>
            </Link>
          ),
          headerRight: () => (
            <Link href="/(modals)/login" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* Boton para Menu */}
      <Tabs.Screen
        name='menu'
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'reader' : 'reader-outline'} color={color} size={24} />
          )
        }}
      />

      <Tabs.Screen
        name="(modals)/customize-product"
        options={{
          href: null,
          title: 'Personalizar Producto',
        }}
      />

      <Tabs.Screen
        name="(modals)/cart"
        options={{
          href: null,
          title: 'Carrito',
        }}
      />

      {/* Boton para recompensas */}
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Recompensas',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} color={color} size={24} />
          ),
        }}
      />

      {/* Boton para pedidos */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'ticket' : 'ticket-outline'} color={color} size={24} />
          ),
        }}
      />

      {/*  Boton para el perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
        }}
      />

      {/* Boton OCULTO para eventos */}
      <Tabs.Screen name='events'
        options={{
          href: null,
          title: 'Eventos',
        }}
      />

      <Tabs.Screen name='ScanQRScreen'
        options={{
          href: null,
          title: 'Qr Scanner',
        }}
      />

      {/* Sucursales: no aparece en tabs, sin barra y con flecha */}
      <Tabs.Screen
        name="branches"
        options={{
          href: null,
          title: 'Sucursales',
          tabBarStyle: { display: 'none' },
          headerLeft: () => (
            <Link href="/" asChild>
              <Pressable style={{ marginLeft: 15 }}>
                {({ pressed }) => (
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
