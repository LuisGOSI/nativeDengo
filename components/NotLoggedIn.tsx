import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';

const NotLoggedIn = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <Text style={styles.loadingText}> No hay sesión activa. </Text>
            <Button
                mode="contained"
                onPress={() => router.replace('/login')}
                style={{ marginTop: 16, backgroundColor: colors.tint }}
                textColor={colorScheme === 'dark' ? colors.text : '#000'}
            >
                Iniciar sesión
            </Button>
        </View>)
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        opacity: 0.7,
    },
});

export default NotLoggedIn