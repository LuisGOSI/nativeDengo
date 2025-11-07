import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabMenuScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu</Text>
            <View style={styles.separator} lightColor="#000000ff" darkColor="rgba(255, 255, 255, 1)" />
            <Text style={styles.info}>Explora nuestro menú y disfruta de las mejores delicias.</Text>
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
