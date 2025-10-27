import { Text, View } from "@/components/Themed";
import { StyleSheet } from 'react-native';

export default function TabOrdersScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis pedidos</Text>
            <View style={styles.separator} lightColor="#000000ff" darkColor="rgba(255, 255, 255, 1)" />
            <Text style={styles.info}>Aqui podras gestionar tus pedidos.</Text>
        </View>)
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
