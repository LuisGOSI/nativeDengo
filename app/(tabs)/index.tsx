import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect } from 'react';

//import notificaciobes
import * as Notifications from 'expo-notifications';

export default function TabHomeScreen() {

  useEffect(() => {
    // Cuando se abre la pantalla, se programa una notificación
    const notificarAlEntrar = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '¡Bienvenido a Dengo! 🍰',
          body: 'Disfruta de nuestros mejores postres y bebidas.',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 2, repeats: false }// se mostrará 2 segundos después de entrar
      });
    };

    notificarAlEntrar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <View style={styles.separator} lightColor="#000000ff" darkColor="rgba(255, 255, 255, 1)" />
      <Text style={styles.welcome}>Bienvenido a Dengo!</Text>
      <Text style={styles.info}>Disfruta de nuestros mejores postres y bebidas, además de los mejores precios.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '85%',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
  },
});
